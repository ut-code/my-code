/// <reference lib="webworker" />

import { expose } from "comlink";
import type { ReplOutput } from "../repl";
import type { WorkerCapabilities } from "./runtime";
import type { UpdatedFile } from "../runtime";
import inspect from "object-inspect";
import { replLikeEval, checkSyntax } from "@my-code/js-eval";

function format(...args: unknown[]): string {
  // TODO: console.logの第1引数はフォーマット指定文字列を取ることができる
  // https://nodejs.org/api/util.html#utilformatformat-args
  return args.map((a) => (typeof a === "string" ? a : inspect(a))).join(" ");
}
let currentOutputCallback: ((output: ReplOutput) => void) | null = null;

// Helper function to capture console output
const originalConsole = self.console;
self.console = {
  ...originalConsole,
  log: (...args: unknown[]) =>
    currentOutputCallback?.({ type: "stdout", message: format(...args) }),
  error: (...args: unknown[]) =>
    currentOutputCallback?.({ type: "stderr", message: format(...args) }),
  warn: (...args: unknown[]) =>
    currentOutputCallback?.({ type: "stderr", message: format(...args) }),
  info: (...args: unknown[]) =>
    currentOutputCallback?.({ type: "stdout", message: format(...args) }),
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
  onOutput: (output: ReplOutput | UpdatedFile) => void
): Promise<void> {
  currentOutputCallback = onOutput;
  try {
    const result = await replLikeEval(code);
    onOutput({
      type: "return",
      message: inspect(result),
    });
  } catch (e) {
    originalConsole.log(e);
    // TODO: stack trace?
    if (e instanceof Error) {
      onOutput({
        type: "error",
        message: `${e.name}: ${e.message}`,
      });
    } else {
      onOutput({
        type: "error",
        message: `${String(e)}`,
      });
    }
  }
}

function runFile(
  name: string,
  files: Record<string, string>,
  onOutput: (output: ReplOutput | UpdatedFile) => void
): void {
  // pyodide worker などと異なり、複数ファイルを読み込んでimportのようなことをするのには対応していません。
  currentOutputCallback = onOutput;
  try {
    self.eval(files[name]);
  } catch (e) {
    originalConsole.log(e);
    // TODO: stack trace?
    if (e instanceof Error) {
      onOutput({
        type: "error",
        message: `${e.name}: ${e.message}`,
      });
    } else {
      onOutput({
        type: "error",
        message: `${String(e)}`,
      });
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

const api = {
  init,
  runCode,
  runFile,
  checkSyntax,
  restoreState,
};

expose(api);
