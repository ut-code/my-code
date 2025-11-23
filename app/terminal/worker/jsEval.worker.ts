/// <reference lib="webworker" />

import type { ReplOutput } from "../repl";
import type { MessageType, WorkerRequest, WorkerResponse } from "./runtime";

let jsOutput: ReplOutput[] = [];

// Helper function to capture console output
const originalConsole = self.console;
self.console = {
  ...originalConsole,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log: (...args: any[]) => {
    jsOutput.push({ type: "stdout", message: args.join(" ") });
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (...args: any[]) => {
    jsOutput.push({ type: "stderr", message: args.join(" ") });
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn: (...args: any[]) => {
    jsOutput.push({ type: "stderr", message: args.join(" ") });
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: (...args: any[]) => {
    jsOutput.push({ type: "stdout", message: args.join(" ") });
  },
};

async function init({ id }: WorkerRequest["init"]) {
  // Initialize the worker and report capabilities
  self.postMessage({
    id,
    payload: { capabilities: { interrupt: "restart" } },
  } satisfies WorkerResponse["init"]);
}

async function runCode({ id, payload }: WorkerRequest["runCode"]) {
  let { code } = payload;
  try {
    // eval()の中でconst,letを使って変数を作成した場合、
    // 次に実行するコマンドはスコープ外扱いでありアクセスできなくなってしまうので、
    // varに置き換えている
    if (code.trim().startsWith("const ")) {
      code = "var " + code.trim().slice(6);
    } else if (code.trim().startsWith("let ")) {
      code = "var " + code.trim().slice(4);
    }

    // Execute code directly with eval in the worker global scope
    // This will preserve variables across calls
    const result = self.eval(code);

    jsOutput.push({
      type: "return",
      message: JSON.stringify(result),
    });
  } catch (e) {
    originalConsole.log(e);
    // TODO: stack trace?
    if (e instanceof Error) {
      jsOutput.push({
        type: "error",
        message: `${e.name}: ${e.message}`,
      });
    } else {
      jsOutput.push({
        type: "error",
        message: `${String(e)}`,
      });
    }
  }

  const output = [...jsOutput];
  jsOutput = []; // Clear output

  self.postMessage({
    id,
    payload: { output, updatedFiles: [] },
  } satisfies WorkerResponse["runCode"]);
}

function runFile({ id, payload }: WorkerRequest["runFile"]) {
  const { name, files } = payload;
  // pyodide worker などと異なり、複数ファイルを読み込んでimportのようなことをするのには対応していません。
  try {
    // Execute code directly with eval in the worker global scope
    // This will preserve variables across calls
    self.eval(files[name]);
  } catch (e) {
    originalConsole.log(e);
    // TODO: stack trace?
    if (e instanceof Error) {
      jsOutput.push({
        type: "error",
        message: `${e.name}: ${e.message}`,
      });
    } else {
      jsOutput.push({
        type: "error",
        message: `${String(e)}`,
      });
    }
  }

  const output = [...jsOutput];
  jsOutput = []; // Clear output

  self.postMessage({
    id,
    payload: { output, updatedFiles: [] },
  } satisfies WorkerResponse["runFile"]);
}

async function checkSyntax({ id, payload }: WorkerRequest["checkSyntax"]) {
  const { code } = payload;

  try {
    // Try to create a Function to check syntax
    new Function(code);
    self.postMessage({
      id,
      payload: { status: "complete" },
    } satisfies WorkerResponse["checkSyntax"]);
  } catch (e) {
    // Check if it's a syntax error or if more input is expected
    if (e instanceof SyntaxError) {
      // Simple heuristic: check for "Unexpected end of input"
      if (
        e.message.includes("Unexpected end of input") ||
        e.message.includes("expected expression")
      ) {
        self.postMessage({
          id,
          payload: { status: "incomplete" },
        } satisfies WorkerResponse["checkSyntax"]);
      } else {
        self.postMessage({
          id,
          payload: { status: "invalid" },
        } satisfies WorkerResponse["checkSyntax"]);
      }
    } else {
      self.postMessage({
        id,
        payload: { status: "invalid" },
      } satisfies WorkerResponse["checkSyntax"]);
    }
  }
}

async function restoreState({ id, payload }: WorkerRequest["restoreState"]) {
  // Re-execute all previously successful commands to restore state
  const { commands } = payload;
  jsOutput = []; // Clear output for restoration

  for (const command of commands) {
    try {
      self.eval(command);
    } catch (e) {
      // If restoration fails, we still continue with other commands
      originalConsole.error("Failed to restore command:", command, e);
    }
  }

  jsOutput = []; // Clear any output from restoration
  self.postMessage({
    id,
    payload: {},
  } satisfies WorkerResponse["restoreState"]);
}

self.onmessage = async (event: MessageEvent<WorkerRequest[MessageType]>) => {
  switch (event.data.type) {
    case "init":
      await init(event.data);
      return;
    case "runCode":
      await runCode(event.data);
      return;
    case "runFile":
      runFile(event.data);
      return;
    case "checkSyntax":
      await checkSyntax(event.data);
      return;
    case "restoreState":
      await restoreState(event.data);
      return;
    default:
      event.data satisfies never;
      originalConsole.error(`Unknown message: ${event.data}`);
      return;
  }
};
