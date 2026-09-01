/// <reference lib="webworker" />

import { expose } from "comlink";
import type { Diagnostic, ReplOutput, UpdatedFile } from "../interface";
import type { WorkerAPI, WorkerCapabilities } from "./runtime";
import inspect from "object-inspect";
import {
  replLikeEval,
  checkSyntax,
  createReplConsole,
  parseError,
} from "@my-code/js-eval";

let currentOutputCallback: ((output: ReplOutput) => Promise<void>) | null =
  null;
let pendingOutputPromise: Promise<void>[] = [];

// Helper function to capture console output
const originalConsole = self.console;
self.console = {
  ...originalConsole,
  ...createReplConsole((output) => {
    if (currentOutputCallback) {
      pendingOutputPromise.push(currentOutputCallback(output));
    }
  }),
};

async function init(/*_interruptBuffer?: Uint8Array*/): Promise<{
  capabilities: WorkerCapabilities;
}> {
  // Initialize the worker and report capabilities
  // interruptBuffer is not used for JavaScript (restart-based interruption)
  return { capabilities: { interrupt: "restart" } };
}

async function runCode(
  code: string,
  onOutput: (output: ReplOutput | UpdatedFile) => Promise<void>
): Promise<void> {
  currentOutputCallback = onOutput;
  pendingOutputPromise = [];
  try {
    const result = await replLikeEval(code);
    await Promise.all(pendingOutputPromise);
    if (result !== undefined) {
      await onOutput({
        type: "return",
        message: inspect(result),
      });
    }
  } catch (e) {
    originalConsole.log(e);
    await Promise.all(pendingOutputPromise);
    const parsed = parseError(e, code, "REPL");
    await onOutput({
      type: "error",
      message: parsed.formattedStackTrace,
    });
  }
}

async function runFile(
  name: string,
  files: Record<string, string>,
  onOutput: (output: ReplOutput | UpdatedFile) => Promise<void>,
  onDiagnostic?: (diagnostic: Diagnostic) => Promise<void>
): Promise<void> {
  // pyodide worker などと異なり、複数ファイルを読み込んでimportのようなことをするのには対応していません。
  currentOutputCallback = onOutput;
  pendingOutputPromise = [];
  try {
    const code = files[name] ?? "";
    const sourceUrlComment = code.endsWith("\n")
      ? `//# sourceURL=${name}`
      : `\n//# sourceURL=${name}`;
    self.eval(`${code}${sourceUrlComment}`);
    await Promise.all(pendingOutputPromise);
  } catch (e) {
    originalConsole.log(e);
    await Promise.all(pendingOutputPromise);
    const parsed = parseError(e, files[name], name);
    await onOutput({
      type: "error",
      message: parsed.formattedStackTrace,
    });
    if (onDiagnostic && parsed.diagnostic) {
      await onDiagnostic(parsed.diagnostic);
    }
  }
}

async function restoreState(commands: string[]): Promise<object> {
  // Re-execute all previously successful commands to restore state
  for (const command of commands) {
    try {
      replLikeEval(command);
    } catch (e) {
      // If restoration fails, we still continue with other commands
      originalConsole.error("Failed to restore command:", command, e);
    }
  }

  return {};
}

const api: WorkerAPI = {
  init,
  runCode,
  runFile,
  checkSyntax,
  restoreState,
};

expose(api);
