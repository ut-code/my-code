/// <reference lib="webworker" />
/// <reference lib="ES2023" />

import { expose } from "comlink";
import { DefaultRubyVM } from "@ruby/wasm-wasi/dist/browser";
import type { RubyVM } from "@ruby/wasm-wasi/dist/vm";
import type { WorkerAPI, WorkerCapabilities } from "./runtime";
import type { ReplOutput, ReplOutputType, UpdatedFile } from "../interface";

import init_rb from "./ruby/init.rb?raw";

let rubyVM: RubyVM | null = null;
let currentOutputCallback: ((output: ReplOutput | UpdatedFile) => Promise<void>) | null = null;
let stdoutBuffer = "";
let stderrBuffer = "";

// Pyodide,jsEvalと違ってrubyは標準出力を非同期関数で置き換えることが可能
// onOutputの戻り値のPromiseを配列にためておいて最後にまとめてawaitする実装にすることもできるが、
// どちらがシンプルか?
declare global {
  var stdout: { write: (str: string) => void };
  var stderr: { write: (str: string) => void };
}
self.stdout = {
  async write(str: string) {
    stdoutBuffer += str;
    stdoutBuffer = await handleBatchOutput(stdoutBuffer, "stdout");
  },
};
self.stderr = {
  async write(str: string) {
    stderrBuffer += str;
    stderrBuffer = await handleBatchOutput(stderrBuffer, "stderr");
  },
};
async function handleBatchOutput(buffer: string, type: ReplOutputType): Promise<string> {
  // If buffer contains newlines, flush complete lines immediately
  if (buffer.includes("\n")) {
    const lines = buffer.split("\n");
    for (let i = 0; i < lines.length - 1; i++) {
      await currentOutputCallback?.({ type, message: lines[i] });
    }
    return lines[lines.length - 1];
  }
  return buffer;
}

async function init(/*_interruptBuffer?: Uint8Array*/): Promise<{
  capabilities: WorkerCapabilities;
}> {
  // interruptBuffer is not used for Ruby (restart-based interruption)
  if (!rubyVM) {
    try {
      // Fetch and compile the Ruby WASM module
      const rubyWasmRes = await fetch(
        // ruby.ts 内にもRubyのバージョン(3.4)を直書きしている箇所がある
        "https://cdn.jsdelivr.net/npm/@ruby/3.4-wasm-wasi@latest/dist/ruby+stdlib.wasm"
      );
      const rubyModule = await WebAssembly.compileStreaming(rubyWasmRes);
      const { vm } = await DefaultRubyVM(rubyModule);
      rubyVM = vm;

      rubyVM.eval(init_rb);

      return { capabilities: { interrupt: "restart" } };
    } catch (e: unknown) {
      console.error("Failed to initialize Ruby VM:", e);
      throw new Error(`Failed to initialize Ruby: ${e}`);
    }
  }
  return { capabilities: { interrupt: "restart" } };
}

async function flushOutput() {
  // Flush any remaining non-empty text without newlines
  if (stdoutBuffer && stdoutBuffer.trim()) {
    await currentOutputCallback?.({ type: "stdout", message: stdoutBuffer });
  }
  stdoutBuffer = "";

  if (stderrBuffer && stderrBuffer.trim()) {
    await currentOutputCallback?.({ type: "stderr", message: stderrBuffer });
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

async function runCode(
  code: string,
  onOutput: (output: ReplOutput | UpdatedFile) => Promise<void>
): Promise<void> {
  if (!rubyVM) {
    throw new Error("Ruby VM not initialized");
  }

  currentOutputCallback = onOutput;
  try {
    stdoutBuffer = "";
    stderrBuffer = "";

    const result = await rubyVM.evalAsync(code);

    const resultStr = await result.callAsync("inspect");

    // Flush any buffered output
    await flushOutput();

    // Add result to output if it's not nil and not empty
    await onOutput({
      type: "return",
      message: resultStr.toString(),
    });
  } catch (e) {
    console.log(e);

    // Flush any buffered output
    await flushOutput();

    await onOutput({
      type: "error",
      message: formatRubyError(e, false),
    });
  }

  const updatedFiles = readAllFiles();
  for (const [filename, content] of Object.entries(updatedFiles)) {
    await onOutput({ type: "file", filename, content });
  }
}

async function runFile(
  name: string,
  files: Record<string, string>,
  onOutput: (output: ReplOutput | UpdatedFile) => Promise<void>
): Promise<void> {
  if (!rubyVM) {
    throw new Error("Ruby VM not initialized");
  }

  currentOutputCallback = onOutput;
  try {
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
    await rubyVM.evalAsync(`load ${JSON.stringify(name)}`);

    // Flush any buffered output
    await flushOutput();
  } catch (e) {
    console.log(e);

    // Flush any buffered output
    await flushOutput();

    await onOutput({
      type: "error",
      message: formatRubyError(e, true),
    });
  }

  const updatedFiles = readAllFiles();
  for (const [filename, content] of Object.entries(updatedFiles)) {
    await onOutput({ type: "file", filename, content });
  }
}

async function checkSyntax(
  code: string
): Promise<{ status: "complete" | "incomplete" | "invalid" }> {
  if (!rubyVM) {
    return { status: "invalid" };
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
        return { status: "incomplete" };
      }
      // If it's our check exception, syntax is valid
      if (e instanceof Error && e.message && e.message.includes("check")) {
        return { status: "complete" };
      }
      // Otherwise it's a syntax error
      return { status: "invalid" };
    }
    return { status: "complete" };
  } catch (e) {
    console.error("Syntax check error:", e);
    return { status: "invalid" };
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

async function restoreState(commands: string[]): Promise<object> {
  // Re-execute all previously successful commands to restore state
  if (!rubyVM) {
    throw new Error("Ruby VM not initialized");
  }

  stdoutBuffer = "";
  stderrBuffer = "";

  for (const command of commands) {
    try {
      await rubyVM.evalAsync(command);
    } catch (e) {
      // If restoration fails, we still continue with other commands
      console.error("Failed to restore command:", command, e);
    }
  }

  // Clear any buffered output from restoration
  stdoutBuffer = "";
  stderrBuffer = "";

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
