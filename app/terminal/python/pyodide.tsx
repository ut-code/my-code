"use client";

// Nextjsではドキュメント通りにpyodideをimportすると動かない? typeのインポートだけはできる
import { type PyodideAPI } from "pyodide";
import {
  useState,
  useRef,
  useCallback,
  ReactNode,
  createContext,
  useContext,
} from "react";
import { SyntaxStatus, ReplOutput } from "../repl";
import { Mutex, MutexInterface } from "async-mutex";
import { PyCallable } from "pyodide/ffi";
import { useFile } from "../file";

declare global {
  interface Window {
    loadPyodide: (options: { indexURL: string }) => Promise<PyodideAPI>;
  }
}

interface IPyodideContext {
  init: () => Promise<void>; // Pyodideを初期化する
  initializing: boolean; // Pyodideの初期化が実行中
  ready: boolean; // Pyodideの初期化が完了した
  // runPython() などを複数の場所から同時実行すると結果が混ざる。
  // コードブロックの実行全体を mutex.runExclusive() で囲うことで同時実行を防ぐ必要がある
  mutex: MutexInterface;
  runPython: (code: string) => Promise<ReplOutput[]>;
  runFile: (name: string) => Promise<ReplOutput[]>;
  checkSyntax: (code: string) => Promise<SyntaxStatus>;
}
const PyodideContext = createContext<IPyodideContext>(null!);

export function usePyodide() {
  const context = useContext(PyodideContext);
  if (!context) {
    throw new Error("usePyodide must be used within a PyodideProvider");
  }
  return context;
}

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
const WRITEFILE_CODE = `
def __writefile(filepath, content):
    with open(filepath, 'w') as f:
        f.write(content)

__writefile
`;
const READALLFILE_CODE = `
def __readallfile():
    import os
    files = []
    for file in os.listdir():
        if os.path.isfile(file):
          with open(file, 'r') as f:
              files.append((file, f.read()))
    return files

__readallfile
`;

export function PyodideProvider({ children }: { children: ReactNode }) {
  const pyodideRef = useRef<PyodideAPI>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(false);
  const pyodideOutput = useRef<ReplOutput[]>([]);
  const mutex = useRef<MutexInterface>(new Mutex());
  const { files, writeFile } = useFile();

  const init = useCallback(async () => {
    // next.config.ts 内でpyodideをimportし、バージョンを取得している
    const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${process.env.PYODIDE_VERSION}/full/`;

    const { promise, resolve } = Promise.withResolvers<void>();
    const initPyodide = () => {
      if (initializing) return;
      setInitializing(true);
      window
        .loadPyodide({
          indexURL: PYODIDE_CDN,
        })
        .then((pyodide) => {
          pyodideRef.current = pyodide;

          // 標準出力とエラーをハンドリングする設定
          pyodide.setStdout({
            batched: (str) => {
              pyodideOutput.current.push({ type: "stdout", message: str });
            },
          });
          pyodide.setStderr({
            batched: (str) => {
              pyodideOutput.current.push({ type: "stderr", message: str });
            },
          });

          setReady(true);
          setInitializing(false);
          resolve();
        });
    };

    // スクリプトタグを動的に追加
    if ("loadPyodide" in window) {
      initPyodide();
    } else {
      const script = document.createElement("script");
      script.src = `${PYODIDE_CDN}pyodide.js`;
      script.async = true;
      script.onload = initPyodide;
      script.onerror = () => {
        // TODO
      };
      document.body.appendChild(script);

      // コンポーネントのクリーンアップ時にスクリプトタグを削除
      // return () => {
      //   document.body.removeChild(script);
      // };
    }
    return promise;
  }, [initializing]);

  const runPython = useCallback<(code: string) => Promise<ReplOutput[]>>(
    async (code: string) => {
      if (!mutex.current.isLocked()) {
        throw new Error("mutex of PyodideContext must be locked for runPython");
      }

      const pyodide = pyodideRef.current;
      if (!pyodide || !ready) {
        return [{ type: "error", message: "Pyodide is not ready yet." }];
      }
      try {
        const result = await pyodide.runPythonAsync(code);
        if (result !== undefined) {
          pyodideOutput.current.push({
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
            pyodideOutput.current.push({
              type: "error",
              message: lines
                .slice(0, 1)
                .concat(lines.slice(execLineIndex))
                .join("\n")
                .trim(),
            });
          } else {
            pyodideOutput.current.push({
              type: "error",
              message: `予期せぬエラー: ${e.message.trim()}`,
            });
          }
        } else {
          pyodideOutput.current.push({
            type: "error",
            message: `予期せぬエラー: ${String(e).trim()}`,
          });
        }
      }
      
      const pyReadFile = pyodide.runPython(READALLFILE_CODE) as PyCallable;
      for(const [file, content] of pyReadFile() as [string, string][]){
        writeFile(file, content);
      }

      const output = [...pyodideOutput.current];
      pyodideOutput.current = []; // 出力をクリア
      return output;
    },
    [ready, writeFile]
  );

  /**
   * ファイルを実行する
   */
  const runFile = useCallback<(name: string) => Promise<ReplOutput[]>>(
    async (name: string) => {
      if (mutex.current.isLocked()) {
        throw new Error(
          "mutex of PyodideContext must not be locked for runFile"
        );
      }
      const pyodide = pyodideRef.current;
      if (!pyodide /*|| !ready*/) {
        return [{ type: "error", message: "Pyodide is not ready yet." }];
      }
      return mutex.current.runExclusive(async () => {
        try {
          const pyWriteFile = pyodide.runPython(WRITEFILE_CODE) as PyCallable;
          const pyExecFile = pyodide.runPython(EXECFILE_CODE) as PyCallable;

          for (const filename of Object.keys(files)) {
            if (files[filename]) {
              pyWriteFile(HOME + filename, files[filename]);
            }
          }
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
              pyodideOutput.current.push({
                type: "error",
                message: lines
                  .slice(0, 1)
                  .concat(lines.slice(execLineIndex + 1))
                  .join("\n")
                  .trim(),
              });
            } else {
              pyodideOutput.current.push({
                type: "error",
                message: `予期せぬエラー: ${e.message.trim()}`,
              });
            }
          } else {
            pyodideOutput.current.push({
              type: "error",
              message: `予期せぬエラー: ${String(e).trim()}`,
            });
          }
        }

        const pyReadFile = pyodide.runPython(READALLFILE_CODE) as PyCallable;
        for(const [file, content] of pyReadFile() as [string, string][]){
          writeFile(file, content);
        }
        
        const output = [...pyodideOutput.current];
        pyodideOutput.current = []; // 出力をクリア
        return output;
      });
    },
    [files, writeFile]
  );

  /**
   * Pythonコードの構文が完結しているかチェックする
   */
  const checkSyntax = useCallback<(code: string) => Promise<SyntaxStatus>>(
    async (code) => {
      if (mutex.current.isLocked()) {
        throw new Error(
          "mutex of PyodideContext must not be locked for checkSyntax"
        );
      }

      const pyodide = pyodideRef.current;
      if (!pyodide || !ready) return "invalid";

      try {
        // Pythonのコードを実行して結果を受け取る
        const status = await mutex.current.runExclusive(() =>
          (pyodide.runPython(CHECK_SYNTAX_CODE) as PyCallable)(code)
        );
        return status;
      } catch (e) {
        console.error("Syntax check error:", e);
        return "invalid";
      }
    },
    [ready]
  );

  return (
    <PyodideContext.Provider
      value={{
        init,
        initializing,
        ready,
        runPython,
        checkSyntax,
        mutex: mutex.current,
        runFile,
      }}
    >
      {children}
    </PyodideContext.Provider>
  );
}
