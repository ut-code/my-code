/// <reference lib="webworker" />
/// <reference lib="ES2023" />

import { DefaultRubyVM } from "@ruby/wasm-wasi/dist/browser";
import type { RubyVM } from "@ruby/wasm-wasi/dist/vm";
import type { MessageType, WorkerRequest, WorkerResponse } from "./runtime";
import type { ReplOutput } from "../repl";

import init_rb from "./ruby/init.rb?raw";

let rubyVM: RubyVM | null = null;
let rubyOutput: ReplOutput[] = [];
let stdoutBuffer = "";
let stderrBuffer = "";

declare global {
  var stdout: { write: (str: string) => void };
  var stderr: { write: (str: string) => void };
}
self.stdout = {
  write(str: string) {
    stdoutBuffer += str;
  },
};
self.stderr = {
  write(str: string) {
    stderrBuffer += str;
  },
};

async function init({ id }: WorkerRequest["init"]) {
  if (!rubyVM) {
    try {
      // Fetch and compile the Ruby WASM module
      const rubyWasmRes = await fetch(
        "https://cdn.jsdelivr.net/npm/@ruby/3.4-wasm-wasi@latest/dist/ruby+stdlib.wasm"
      );
      const rubyModule = await WebAssembly.compileStreaming(rubyWasmRes);
      const { vm } = await DefaultRubyVM(rubyModule);
      rubyVM = vm;

      rubyVM.eval(init_rb);

      self.postMessage({
        id,
        payload: { capabilities: { interrupt: "restart" } },
      } satisfies WorkerResponse["init"]);
    } catch (e: unknown) {
      console.error("Failed to initialize Ruby VM:", e);
      self.postMessage({
        id,
        error: `Failed to initialize Ruby: ${e}`,
      } satisfies WorkerResponse["init"]);
    }
  }
}

function flushOutput() {
  if (stdoutBuffer) {
    const lines = stdoutBuffer.split("\n");
    for (let i = 0; i < lines.length - 1; i++) {
      rubyOutput.push({ type: "stdout", message: lines[i] });
    }
    stdoutBuffer = lines[lines.length - 1];
  }
  // Final flush if there's remaining non-empty text
  if (stdoutBuffer && stdoutBuffer.trim()) {
    rubyOutput.push({ type: "stdout", message: stdoutBuffer });
  }
  stdoutBuffer = "";

  if (stderrBuffer) {
    const lines = stderrBuffer.split("\n");
    for (let i = 0; i < lines.length - 1; i++) {
      rubyOutput.push({ type: "stderr", message: lines[i] });
    }
    stderrBuffer = lines[lines.length - 1];
  }
  if (stderrBuffer && stderrBuffer.trim()) {
    rubyOutput.push({ type: "stderr", message: stderrBuffer });
  }
  stderrBuffer = "";
}

function formatRubyError(error: unknown, isFile: boolean): string {
  if (!(error instanceof Error)) {
    return `予期せぬエラー: ${String(error).trim()}`;
  }

  let errorMessage = error.message;

  // Clean up Ruby error messages by filtering out internal eval lines
  if (errorMessage.includes("Traceback") || errorMessage.includes("Error")) {
    let lines = errorMessage.split("\n");
    lines = lines.filter((line) => line !== "-e:in 'Kernel.eval'");
    if (isFile) {
      lines = lines.filter((line) => !line.startsWith("eval:1:in"));
    }
    errorMessage = lines.join("\n");
  }

  return errorMessage;
}

async function runCode({ id, payload }: WorkerRequest["runCode"]) {
  const { code } = payload;

  if (!rubyVM) {
    self.postMessage({
      id,
      error: "Ruby VM not initialized",
    } satisfies WorkerResponse["runCode"]);
    return;
  }

  try {
    rubyOutput = [];
    stdoutBuffer = "";
    stderrBuffer = "";

    const result = rubyVM.eval(code);

    // Flush any buffered output
    flushOutput();

    const resultStr = await result.callAsync("inspect");

    // Add result to output if it's not nil and not empty
    rubyOutput.push({
      type: "return",
      message: resultStr.toString(),
    });
  } catch (e) {
    console.log(e);
    flushOutput();

    rubyOutput.push({
      type: "error",
      message: formatRubyError(e, false),
    });
  }

  const updatedFiles = readAllFiles();
  const output = [...rubyOutput];
  rubyOutput = [];

  self.postMessage({
    id,
    payload: { output, updatedFiles },
  } satisfies WorkerResponse["runCode"]);
}

async function runFile({ id, payload }: WorkerRequest["runFile"]) {
  const { name, files } = payload;

  if (!rubyVM) {
    self.postMessage({
      id,
      error: "Ruby VM not initialized",
    } satisfies WorkerResponse["runFile"]);
    return;
  }

  try {
    rubyOutput = [];
    stdoutBuffer = "";
    stderrBuffer = "";

    // Write files to the virtual file system
    for (const [filename, content] of Object.entries(files)) {
      if (content) {
        rubyVM.eval(
          `File.write(${JSON.stringify(filename)}, ${JSON.stringify(
            content
          ).replaceAll("#", "\\#")})`
        );
      }
    }

    // clear LOADED_FEATURES so that `require` can reload files
    rubyVM.eval(`$LOADED_FEATURES.reject! { |f| f =~ /^\\/[^\\/]*\\.rb$/ }`);

    // Run the specified file
    rubyVM.eval(`load ${JSON.stringify(name)}`);

    // Flush any buffered output
    flushOutput();
  } catch (e) {
    console.log(e);
    flushOutput();

    rubyOutput.push({
      type: "error",
      message: formatRubyError(e, true),
    });
  }

  const updatedFiles = readAllFiles();
  const output = [...rubyOutput];
  rubyOutput = [];

  self.postMessage({
    id,
    payload: { output, updatedFiles },
  } satisfies WorkerResponse["runFile"]);
}

async function checkSyntax({ id, payload }: WorkerRequest["checkSyntax"]) {
  const { code } = payload;

  if (!rubyVM) {
    self.postMessage({
      id,
      payload: { status: "invalid" },
    } satisfies WorkerResponse["checkSyntax"]);
    return;
  }

  try {
    // Try to parse the code to check syntax
    // Ruby doesn't have a built-in compile_command like Python
    // We'll use a simple heuristic
    try {
      rubyVM.eval(`BEGIN { raise "check" }; ${code}`);
    } catch (e: unknown) {
      if (
        e instanceof Error &&
        e.message &&
        (e.message.includes("unexpected end-of-input") || // for `if` etc.
          e.message.includes("expected a matching") || // for ( ), [ ]
          e.message.includes("expected a `}` to close the hash literal") ||
          e.message.includes("unterminated string meets end of file"))
      ) {
        self.postMessage({
          id,
          payload: { status: "incomplete" },
        } satisfies WorkerResponse["checkSyntax"]);
        return;
      }
      // If it's our check exception, syntax is valid
      if (e instanceof Error && e.message && e.message.includes("check")) {
        self.postMessage({
          id,
          payload: { status: "complete" },
        } satisfies WorkerResponse["checkSyntax"]);
        return;
      }
      // Otherwise it's a syntax error
      self.postMessage({
        id,
        payload: { status: "invalid" },
      } satisfies WorkerResponse["checkSyntax"]);
      return;
    }
    self.postMessage({
      id,
      payload: { status: "complete" },
    } satisfies WorkerResponse["checkSyntax"]);
  } catch (e) {
    console.error("Syntax check error:", e);
    self.postMessage({
      id,
      payload: { status: "invalid" },
    } satisfies WorkerResponse["checkSyntax"]);
  }
}

// Helper function to read all files from the virtual file system
function readAllFiles(): Record<string, string> {
  if (!rubyVM) return {};
  const updatedFiles: Record<string, string> = {};

  try {
    // Get list of files in the home directory
    const result = rubyVM.eval(
      `
      require 'json'
      files = {}
      Dir.glob('*').each do |filename|
        if File.file?(filename)
          files[filename] = File.read(filename)
        end
      end
      JSON.generate(files)
    `
    );
    const filesObj = JSON.parse(result.toString());
    for (const [filename, content] of Object.entries(filesObj)) {
      updatedFiles[filename] = content as string;
    }
  } catch (e) {
    console.error("Error reading files:", e);
  }

  return updatedFiles;
}

async function restoreState({ id, payload }: WorkerRequest["restoreState"]) {
  // Re-execute all previously successful commands to restore state
  const { commands } = payload;
  if (!rubyVM) {
    self.postMessage({
      id,
      error: "Ruby VM not initialized",
    } satisfies WorkerResponse["restoreState"]);
    return;
  }

  rubyOutput = []; // Clear output for restoration
  stdoutBuffer = "";
  stderrBuffer = "";

  for (const command of commands) {
    try {
      rubyVM.eval(command);
    } catch (e) {
      // If restoration fails, we still continue with other commands
      console.error("Failed to restore command:", command, e);
    }
  }

  // Clear any output from restoration
  flushOutput();
  rubyOutput = [];

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
      await runFile(event.data);
      return;
    case "checkSyntax":
      await checkSyntax(event.data);
      return;
    case "restoreState":
      await restoreState(event.data);
      return;
    default:
      event.data satisfies never;
      console.error(`Unknown message: ${event.data}`);
      return;
  }
};
