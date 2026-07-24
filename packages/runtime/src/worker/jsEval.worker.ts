/// <reference lib="webworker" />

import { expose } from "comlink";
import type { ReplOutput, UpdatedFile } from "../interface";
import type { WorkerAPI, WorkerCapabilities } from "./runtime";
import inspect from "object-inspect";
import { replLikeEval, checkSyntax } from "@my-code/js-eval";

function format(...args: unknown[]): string {
  // TODO: console.logの第1引数はフォーマット指定文字列を取ることができる
  // https://nodejs.org/api/util.html#utilformatformat-args
  return args.map((a) => (typeof a === "string" ? a : inspect(a))).join(" ");
}
let currentOutputCallback: ((output: ReplOutput) => Promise<void>) | null =
  null;
let pendingOutputPromise: Promise<void>[] = [];
const consoleTimers = new Map<string, number>();

function formatElapsedTime(ms: number): string {
  if (ms < 1000) return `${ms.toFixed(3)}ms`;
  return `${(ms / 1000).toFixed(3)}s`;
}

// Helper function to capture console output
const originalConsole = self.console;
self.console = {
  ...originalConsole,
  time: (label: unknown = "default") => {
    const key = String(label);
    if (consoleTimers.has(key)) {
      if (currentOutputCallback) {
        pendingOutputPromise.push(
          currentOutputCallback({
            type: "stderr",
            message: `Warning: Label '${key}' already exists for console.time()`,
          })
        );
      }
      return;
    }
    consoleTimers.set(key, performance.now());
  },
  timeEnd: (label: unknown = "default") => {
    const key = String(label);
    const start = consoleTimers.get(key);
    if (start === undefined) {
      if (currentOutputCallback) {
        pendingOutputPromise.push(
          currentOutputCallback({
            type: "stderr",
            message: `Warning: No such label '${key}' for console.timeEnd()`,
          })
        );
      }
      return;
    }
    consoleTimers.delete(key);
    if (currentOutputCallback) {
      pendingOutputPromise.push(
        currentOutputCallback({
          type: "stdout",
          message: `${key}: ${formatElapsedTime(performance.now() - start)}`,
        })
      );
    }
  },
  log: (...args: unknown[]) => {
    if (currentOutputCallback) {
      pendingOutputPromise.push(
        currentOutputCallback({ type: "stdout", message: format(...args) })
      );
    }
  },
  error: (...args: unknown[]) => {
    if (currentOutputCallback) {
      pendingOutputPromise.push(
        currentOutputCallback({ type: "stderr", message: format(...args) })
      );
    }
  },
  warn: (...args: unknown[]) => {
    if (currentOutputCallback) {
      pendingOutputPromise.push(
        currentOutputCallback({ type: "stderr", message: format(...args) })
      );
    }
  },
  info: (...args: unknown[]) => {
    if (currentOutputCallback) {
      pendingOutputPromise.push(
        currentOutputCallback({ type: "stdout", message: format(...args) })
      );
    }
  },
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
    await onOutput({
      type: "return",
      message: inspect(result),
    });
  } catch (e) {
    originalConsole.log(e);
    await Promise.all(pendingOutputPromise);
    // TODO: stack trace?
    if (e instanceof Error) {
      await onOutput({
        type: "error",
        message: `${e.name}: ${e.message}`,
      });
    } else {
      await onOutput({
        type: "error",
        message: `${String(e)}`,
      });
    }
  }
}

async function runFile(
  name: string,
  files: Record<string, string>,
  onOutput: (output: ReplOutput | UpdatedFile) => Promise<void>
): Promise<void> {
  // pyodide worker などと異なり、複数ファイルを読み込んでimportのようなことをするのには対応していません。
  currentOutputCallback = onOutput;
  pendingOutputPromise = [];
  try {
    self.eval(files[name]);
    await Promise.all(pendingOutputPromise);
  } catch (e) {
    originalConsole.log(e);
    await Promise.all(pendingOutputPromise);
    // TODO: stack trace?
    if (e instanceof Error) {
      await onOutput({
        type: "error",
        message: `${e.name}: ${e.message}`,
      });
    } else {
      await onOutput({
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

const api: WorkerAPI = {
  init,
  runCode,
  runFile,
  checkSyntax,
  restoreState,
};

expose(api);
