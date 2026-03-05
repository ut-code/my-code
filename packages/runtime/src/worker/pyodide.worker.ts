/// <reference lib="webworker" />
/// <reference lib="ES2023" />

import { expose } from "comlink";
import type { PyodideInterface } from "pyodide";
import { loadPyodide } from "pyodide";
import { version as pyodideVersion } from "pyodide/package.json";
import type { PyCallable } from "pyodide/ffi";
import type { WorkerAPI, WorkerCapabilities } from "./runtime";
import type { ReplOutput, UpdatedFile } from "../interface";

import execfile_py from "./pyodide/execfile.py?raw";
import check_syntax_py from "./pyodide/check_syntax.py?raw";

const HOME = `/home/pyodide/`;

let pyodide: PyodideInterface;
let pendingOutputPromise: Promise<void>[] = [];
let currentOutputCallback:
  | ((output: ReplOutput | UpdatedFile) => Promise<void>)
  | null = null;

// Helper function to read all files from the Pyodide file system
function readAllFiles(): Record<string, string> {
  if (!pyodide) {
    return {};
  }
  const updatedFiles: Record<string, string> = {};
  const dirFiles = pyodide.FS.readdir(HOME);
  for (const filename of dirFiles) {
    if (filename === "." || filename === "..") continue;
    const filepath = `${HOME}/${filename}`;
    const stat = pyodide.FS.stat(filepath);
    if (pyodide.FS.isFile(stat.mode)) {
      const content = pyodide.FS.readFile(filepath, { encoding: "utf8" });
      updatedFiles[filename] = content;
    }
  }
  return updatedFiles;
}

async function init(
  interruptBuffer: Uint8Array
): Promise<{ capabilities: WorkerCapabilities }> {
  if (!pyodide) {
    try {
      pyodide = await loadPyodide({
        indexURL: `${self.location.origin}/_next/static/pyodide/v${pyodideVersion}`,
      });
    } catch {
      pyodide = await loadPyodide({
        indexURL: `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/`,
      });
    }

    pyodide.setStdout({
      batched: (str: string) => {
        if (currentOutputCallback) {
          pendingOutputPromise.push(
            currentOutputCallback({ type: "stdout", message: str })
          );
        }
      },
    });
    pyodide.setStderr({
      batched: (str: string) => {
        if (currentOutputCallback) {
          pendingOutputPromise.push(
            currentOutputCallback({ type: "stderr", message: str })
          );
        }
      },
    });

    pyodide.setInterruptBuffer(interruptBuffer);
  }
  return { capabilities: { interrupt: "buffer" } };
}

async function runCode(
  code: string,
  onOutput: (output: ReplOutput | UpdatedFile) => Promise<void>
): Promise<void> {
  if (!pyodide) {
    throw new Error("Pyodide not initialized");
  }
  currentOutputCallback = onOutput;
  pendingOutputPromise = [];
  try {
    const result = await pyodide.runPythonAsync(code);
    await Promise.all(pendingOutputPromise);
    if (result !== undefined) {
      await onOutput({
        type: "return",
        message: String(result),
      });
    }
  } catch (e: unknown) {
    console.log(e);
    await Promise.all(pendingOutputPromise);
    if (e instanceof Error) {
      // エラーがPyodideのTracebackの場合、2行目から<exec>が出てくるまでを隠す
      if (e.name === "PythonError" && e.message.startsWith("Traceback")) {
        const lines = e.message.split("\n");
        const execLineIndex = lines.findIndex((line) =>
          line.includes("<exec>")
        );
        await onOutput({
          type: "error",
          message: lines
            .slice(0, 1)
            .concat(lines.slice(execLineIndex))
            .join("\n")
            .trim(),
        });
      } else {
        await onOutput({
          type: "error",
          message: `予期せぬエラー: ${e.message.trim()}`,
        });
      }
    } else {
      await onOutput({
        type: "error",
        message: `予期せぬエラー: ${String(e).trim()}`,
      });
    }
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
  if (!pyodide) {
    throw new Error("Pyodide not initialized");
  }
  currentOutputCallback = onOutput;
  pendingOutputPromise = [];
  try {
    // Use Pyodide FS API to write files to the file system
    for (const filename of Object.keys(files)) {
      if (files[filename]) {
        pyodide.FS.writeFile(`${HOME}/${filename}`, files[filename]);
      }
    }

    const pyExecFile = pyodide.runPython(execfile_py) as PyCallable;
    pyExecFile(`${HOME}/${name}`);
    await Promise.all(pendingOutputPromise);
  } catch (e: unknown) {
    console.log(e);
    await Promise.all(pendingOutputPromise);
    if (e instanceof Error) {
      // エラーがPyodideのTracebackの場合、2行目から<exec>が出てくるまでを隠す
      // <exec> 自身も隠す
      if (e.name === "PythonError" && e.message.startsWith("Traceback")) {
        const lines = e.message.split("\n");
        const execLineIndex = lines.findLastIndex((line) =>
          line.includes("<exec>")
        );
        await onOutput({
          type: "error",
          message: lines
            .slice(0, 1)
            .concat(lines.slice(execLineIndex + 1))
            .join("\n")
            .trim(),
        });
      } else {
        await onOutput({
          type: "error",
          message: `予期せぬエラー: ${e.message.trim()}`,
        });
      }
    } else {
      await onOutput({
        type: "error",
        message: `予期せぬエラー: ${String(e).trim()}`,
      });
    }
  }

  const updatedFiles = readAllFiles();
  for (const [filename, content] of Object.entries(updatedFiles)) {
    await onOutput({ type: "file", filename, content });
  }
}

async function checkSyntax(
  code: string
): Promise<{ status: "complete" | "incomplete" | "invalid" }> {
  if (!pyodide) {
    return { status: "invalid" };
  }

  // 複数行コマンドは最後に空行を入れないと完了しないものとする
  if (code.includes("\n") && code.split("\n").at(-1) !== "") {
    return { status: "incomplete" };
  }

  try {
    // Pythonのコードを実行して結果を受け取る
    const status = (pyodide.runPython(check_syntax_py) as PyCallable)(code);
    return { status };
  } catch (e) {
    console.error("Syntax check error:", e);
    return { status: "invalid" };
  }
}

async function restoreState(): Promise<object> {
  throw new Error("not implemented");
}

const api: WorkerAPI = {
  init,
  runCode,
  runFile,
  checkSyntax,
  restoreState,
};

expose(api);
