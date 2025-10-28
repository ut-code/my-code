// Pyodide web worker
let pyodide;
let pyodideOutput = [];

async function init(id, payload) {
  const { PYODIDE_CDN, interruptBuffer } = payload;
  if (!pyodide) {
    importScripts(`${PYODIDE_CDN}pyodide.js`);
    pyodide = await loadPyodide({
      indexURL: PYODIDE_CDN,
    });

    pyodide.setStdout({
      batched: (str) => {
        pyodideOutput.push({ type: "stdout", message: str });
      },
    });
    pyodide.setStderr({
      batched: (str) => {
        pyodideOutput.push({ type: "stderr", message: str });
      },
    });
    
    pyodide.setInterruptBuffer(interruptBuffer);
  }
  self.postMessage({ id, payload: { success: true } });
}

async function runPython(id, payload) {
  const { code } = payload;
  if (!pyodide) {
    self.postMessage({ id, error: "Pyodide not initialized" });
    return;
  }
  try {
    const result = await pyodide.runPythonAsync(code);
    if (result !== undefined) {
      pyodideOutput.push({
        type: "return",
        message: String(result),
      });
    } else {
      // 標準出力/エラーがない場合
    }
  } catch (e) {
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

  // Use Pyodide FS API to read all files
  const dirFiles = pyodide.FS.readdir(HOME);
  const updatedFiles = [];
  for (const filename of dirFiles) {
    if (filename === "." || filename === "..") continue;
    const filepath = HOME + filename;
    const stat = pyodide.FS.stat(filepath);
    if (pyodide.FS.isFile(stat.mode)) {
      const content = pyodide.FS.readFile(filepath, { encoding: "utf8" });
      updatedFiles.push([filename, content]);
    }
  }

  const output = [...pyodideOutput];
  pyodideOutput = []; // 出力をクリア

  self.postMessage({
    id,
    payload: { output, updatedFiles },
  });
}

async function runFile(id, payload) {
  const { name, files } = payload;
  if (!pyodide) {
    self.postMessage({ id, error: "Pyodide not initialized" });
    return;
  }
  try {
    // Use Pyodide FS API to write files to the file system
    for (const filename of Object.keys(files)) {
      if (files[filename]) {
        pyodide.FS.writeFile(HOME + filename, files[filename], {
          encoding: "utf8",
        });
      }
    }

    const pyExecFile = pyodide.runPython(EXECFILE_CODE); /* as PyCallable*/
    pyExecFile(HOME + name);
  } catch (e) {
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

  // Use Pyodide FS API to read all files
  const dirFiles = pyodide.FS.readdir(HOME);
  const updatedFiles = [];
  for (const filename of dirFiles) {
    if (filename === "." || filename === "..") continue;
    const filepath = HOME + filename;
    const stat = pyodide.FS.stat(filepath);
    if (pyodide.FS.isFile(stat.mode)) {
      const content = pyodide.FS.readFile(filepath, { encoding: "utf8" });
      updatedFiles.push([filename, content]);
    }
  }

  const output = [...pyodideOutput];
  pyodideOutput = []; // 出力をクリア
  self.postMessage({
    id,
    payload: { output, updatedFiles },
  });
}

async function checkSyntax(id, payload) {
  const { code } = payload;
  if (!pyodide) {
    self.postMessage({
      id,
      payload: { status: "invalid" },
    });
    return;
  }

  try {
    // Pythonのコードを実行して結果を受け取る
    const status = pyodide.runPython(CHECK_SYNTAX_CODE)(code);
    self.postMessage({ id, payload: { status } });
  } catch (e) {
    console.error("Syntax check error:", e);
    self.postMessage({
      id,
      payload: { status: "invalid" },
    });
  }
}

self.onmessage = async (event) => {
  const { id, type, payload } = event.data;
  switch (type) {
    case "init":
      await init(id, payload);
      return;
    case "runPython":
      await runPython(id, payload);
      return;
    case "runFile":
      await runFile(id, payload);
      return;
    case "checkSyntax":
      await checkSyntax(id, payload);
      return;
    default:
      console.error(`Unknown message type: ${type}`);
      return;
  }
};

// Python側で実行する構文チェックのコード
// codeop.compile_commandは、コードが不完全な場合はNoneを返します。
const CHECK_SYNTAX_CODE = `
def __check_syntax(code):
    import codeop

    compiler = codeop.compile_command
    try:
        # compile_commandは、コードが完結していればコンパイルオブジェクトを、
        # 不完全(まだ続きがある)であればNoneを返す
        if compiler(code) is not None:
            return "complete"
        else:
            return "incomplete"
    except (SyntaxError, ValueError, OverflowError):
        # 明らかな構文エラーの場合
        return "invalid"

__check_syntax
`;

const HOME = `/home/pyodide/`;

// https://stackoverflow.com/questions/436198/what-alternative-is-there-to-execfile-in-python-3-how-to-include-a-python-fil
const EXECFILE_CODE = `
def __execfile(filepath):
  with open(filepath, 'rb') as file:
      exec_globals = {
          "__file__": filepath,
          "__name__": "__main__",
      }
      exec(compile(file.read(), filepath, 'exec'), exec_globals)

__execfile
`;
