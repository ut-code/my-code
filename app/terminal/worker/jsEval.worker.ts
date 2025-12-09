/// <reference lib="webworker" />

import { expose } from "comlink";
import type { ReplOutput } from "../repl";
import type { WorkerCapabilities } from "./runtime";
import inspect from "object-inspect";

function format(...args: unknown[]): string {
  // TODO: console.logの第1引数はフォーマット指定文字列を取ることができる
  // https://nodejs.org/api/util.html#utilformatformat-args
  return args.map((a) => (typeof a === "string" ? a : inspect(a))).join(" ");
}
let jsOutput: ReplOutput[] = [];

// Helper function to capture console output
const originalConsole = self.console;
self.console = {
  ...originalConsole,
  log: (...args: unknown[]) => {
    jsOutput.push({ type: "stdout", message: format(...args) });
  },
  error: (...args: unknown[]) => {
    jsOutput.push({ type: "stderr", message: format(...args) });
  },
  warn: (...args: unknown[]) => {
    jsOutput.push({ type: "stderr", message: format(...args) });
  },
  info: (...args: unknown[]) => {
    jsOutput.push({ type: "stdout", message: format(...args) });
  },
};

async function init(/*_interruptBuffer?: Uint8Array*/): Promise<{
  capabilities: WorkerCapabilities;
}> {
  // Initialize the worker and report capabilities
  // interruptBuffer is not used for JavaScript (restart-based interruption)
  return { capabilities: { interrupt: "restart" } };
}

async function replLikeEval(code: string): Promise<unknown> {
  // eval()の中でconst,letを使って変数を作成した場合、
  // 次に実行するコマンドはスコープ外扱いでありアクセスできなくなってしまうので、
  // varに置き換えている
  if (code.trim().startsWith("const ")) {
    code = "var " + code.trim().slice(6);
  } else if (code.trim().startsWith("let ")) {
    code = "var " + code.trim().slice(4);
  }
  // eval()の中でclassを作成した場合も同様
  const classRegExp = /^\s*class\s+(\w+)/;
  if (classRegExp.test(code)) {
    code = code.replace(classRegExp, "var $1 = class $1");
  }

  if (code.trim().startsWith("{") && code.trim().endsWith("}")) {
    // オブジェクトは ( ) で囲わなければならない
    try {
      return self.eval(`(${code})`);
    } catch (e) {
      if (e instanceof SyntaxError) {
        // オブジェクトではなくブロックだった場合、再度普通に実行
        return self.eval(code);
      } else {
        throw e;
      }
    }
  } else if (/^\s*await\W/.test(code)) {
    // promiseをawaitする場合は、promiseの部分だけをevalし、それを外からawaitする
    return await self.eval(code.trim().slice(5));
  } else {
    return self.eval(code);
  }
}

async function runCode(code: string): Promise<{
  output: ReplOutput[];
  updatedFiles: Record<string, string>;
}> {
  try {
    const result = await replLikeEval(code);
    jsOutput.push({
      type: "return",
      message: inspect(result),
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

  return { output, updatedFiles: {} as Record<string, string> };
}

function runFile(
  name: string,
  files: Record<string, string>
): { output: ReplOutput[]; updatedFiles: Record<string, string> } {
  // pyodide worker などと異なり、複数ファイルを読み込んでimportのようなことをするのには対応していません。
  try {
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

  return { output, updatedFiles: {} as Record<string, string> };
}

async function checkSyntax(
  code: string
): Promise<{ status: "complete" | "incomplete" | "invalid" }> {
  try {
    // Try to create a Function to check syntax
    // new Function(code); // <- not working
    self.eval(`() => {${code}}`);
    return { status: "complete" };
  } catch (e) {
    // Check if it's a syntax error or if more input is expected
    if (e instanceof SyntaxError) {
      // Simple heuristic: check for "Unexpected end of input"
      if (
        e.message.includes("Unexpected token '}'") ||
        e.message.includes("Unexpected end of input")
      ) {
        return { status: "incomplete" };
      } else {
        return { status: "invalid" };
      }
    } else {
      return { status: "invalid" };
    }
  }
}

async function restoreState(commands: string[]): Promise<object> {
  // Re-execute all previously successful commands to restore state
  jsOutput = []; // Clear output for restoration

  for (const command of commands) {
    try {
      replLikeEval(command);
    } catch (e) {
      // If restoration fails, we still continue with other commands
      originalConsole.error("Failed to restore command:", command, e);
    }
  }

  jsOutput = []; // Clear any output from restoration
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
