/// <reference lib="webworker" />
/// <reference lib="ES2023" />

import type { PyodideInterface } from "pyodide";
// import { loadPyodide } from "pyodide"; -> Reading from "node:child_process" is not handled by plugins
import { version as pyodideVersion } from "pyodide/package.json";
import type { PyCallable } from "pyodide/ffi";
import type { MessageType, WorkerRequest, WorkerResponse } from "./runtime";
import type { ReplOutput } from "../repl";

import execfile_py from "./pyodide/execfile.py?raw";
import check_syntax_py from "./pyodide/check_syntax.py?raw";

const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/`;
const HOME = `/home/pyodide/`;

let pyodide: PyodideInterface;
let pyodideOutput: ReplOutput[] = [];

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

async function init({ id, payload }: WorkerRequest["init"]) {
  const { interruptBuffer } = payload;
  if (!pyodide) {
    self.importScripts(`${PYODIDE_CDN}pyodide.js`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pyodide = await (self as any).loadPyodide({ indexURL: PYODIDE_CDN });

    pyodide.setStdout({
      batched: (str: string) => {
        pyodideOutput.push({ type: "stdout", message: str });
      },
    });
    pyodide.setStderr({
      batched: (str: string) => {
        pyodideOutput.push({ type: "stderr", message: str });
      },
    });

    pyodide.setInterruptBuffer(interruptBuffer);
  }
  self.postMessage({
    id,
    payload: { capabilities: { interrupt: "buffer" } },
  } satisfies WorkerResponse["init"]);
}

async function runCode({ id, payload }: WorkerRequest["runCode"]) {
  const { code } = payload;
  if (!pyodide) {
    self.postMessage({
      id,
      error: "Pyodide not initialized",
    } satisfies WorkerResponse["runCode"]);
    return;
  }
  try {
    const result = await pyodide.runPythonAsync(code);
    if (result !== undefined) {
      pyodideOutput.push({
        type: "return",
        message: String(result),
      });
    }
  } catch (e: unknown) {
    console.log(e);
    if (e instanceof Error) {
      // エラーがPyodideのTracebackの場合、2行目から<exec>が出てくるまでを隠す
      if (e.name === "PythonError" && e.message.startsWith("Traceback")) {
        const lines = e.message.split("\n");
        const execLineIndex = lines.findIndex((line) =>
          line.includes("<exec>")
        );
        pyodideOutput.push({
          type: "error",
          message: lines
            .slice(0, 1)
            .concat(lines.slice(execLineIndex))
            .join("\n")
            .trim(),
        });
      } else {
        pyodideOutput.push({
          type: "error",
          message: `予期せぬエラー: ${e.message.trim()}`,
        });
      }
    } else {
      pyodideOutput.push({
        type: "error",
        message: `予期せぬエラー: ${String(e).trim()}`,
      });
    }
  }

  const updatedFiles = readAllFiles();
  const output = [...pyodideOutput];
  pyodideOutput = []; // 出力をクリア

  self.postMessage({
    id,
    payload: { output, updatedFiles },
  } satisfies WorkerResponse["runCode"]);
}

async function runFile({ id, payload }: WorkerRequest["runFile"]) {
  const { name, files } = payload;
  if (!pyodide) {
    self.postMessage({
      id,
      error: "Pyodide not initialized",
    } satisfies WorkerResponse["runFile"]);
    return;
  }
  try {
    // Use Pyodide FS API to write files to the file system
    for (const filename of Object.keys(files)) {
      if (files[filename]) {
        pyodide.FS.writeFile(`${HOME}/${filename}`, files[filename]);
      }
    }

    const pyExecFile = pyodide.runPython(execfile_py) as PyCallable;
    pyExecFile(`${HOME}/${name}`);
  } catch (e: unknown) {
    console.log(e);
    if (e instanceof Error) {
      // エラーがPyodideのTracebackの場合、2行目から<exec>が出てくるまでを隠す
      // <exec> 自身も隠す
      if (e.name === "PythonError" && e.message.startsWith("Traceback")) {
        const lines = e.message.split("\n");
        const execLineIndex = lines.findLastIndex((line) =>
          line.includes("<exec>")
        );
        pyodideOutput.push({
          type: "error",
          message: lines
            .slice(0, 1)
            .concat(lines.slice(execLineIndex + 1))
            .join("\n")
            .trim(),
        });
      } else {
        pyodideOutput.push({
          type: "error",
          message: `予期せぬエラー: ${e.message.trim()}`,
        });
      }
    } else {
      pyodideOutput.push({
        type: "error",
        message: `予期せぬエラー: ${String(e).trim()}`,
      });
    }
  }

  const updatedFiles = readAllFiles();
  const output = [...pyodideOutput];
  pyodideOutput = []; // 出力をクリア
  self.postMessage({
    id,
    payload: { output, updatedFiles },
  } satisfies WorkerResponse["runFile"]);
}

async function checkSyntax({ id, payload }: WorkerRequest["checkSyntax"]) {
  const { code } = payload;
  if (!pyodide) {
    self.postMessage({
      id,
      payload: { status: "invalid" },
    } satisfies WorkerResponse["checkSyntax"]);
    return;
  }

  // 複数行コマンドは最後に空行を入れないと完了しないものとする
  if (code.includes("\n") && code.split("\n").at(-1) !== "") {
    self.postMessage({
      id,
      payload: { status: "incomplete" },
    } satisfies WorkerResponse["checkSyntax"]);
    return;
  }

  try {
    // Pythonのコードを実行して結果を受け取る
    const status = (pyodide.runPython(check_syntax_py) as PyCallable)(code);
    self.postMessage({
      id,
      payload: { status },
    } satisfies WorkerResponse["checkSyntax"]);
  } catch (e) {
    console.error("Syntax check error:", e);
    self.postMessage({
      id,
      payload: { status: "invalid" },
    } satisfies WorkerResponse["checkSyntax"]);
  }
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
      self.postMessage({
        id: event.data.id,
        error: "not implemented",
      } satisfies WorkerResponse["restoreState"]);
      return;
    default:
      event.data satisfies never;
      console.error(`Unknown message: ${event.data}`);
      return;
  }
};
