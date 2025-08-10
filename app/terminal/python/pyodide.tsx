"use client";

// Nextjsではドキュメント通りにpyodideをimportすると動かない? typeのインポートだけはできる
import { type PyodideAPI } from "pyodide";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
  createContext,
  useContext,
} from "react";
import { SyntaxStatus, TerminalOutput } from "../terminal";

declare global {
  interface Window {
    loadPyodide: (options: { indexURL: string }) => Promise<PyodideAPI>;
  }
}

interface IPyodideContext {
  init: () => void;
  isPyodideReady: boolean;
  runPython: (code: string) => Promise<TerminalOutput[]>;
  checkSyntax: (code: string) => Promise<SyntaxStatus>;
}
const PyodideContext = createContext<IPyodideContext>(null!);

// Python側で実行する構文チェックのコード
// codeop.compile_commandは、コードが不完全な場合はNoneを返します。
const CHECK_SYNTAX_CODE = `
def __check_syntax():
    import codeop
    import js

    code = js.__code_to_check
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

__check_syntax()
`;

export function PyodideProvider({ children }: { children: ReactNode }) {
  const pyodideRef = useRef<PyodideAPI>(null);
  const [isPyodideReady, setIsPyodideReady] = useState<boolean>(false);
  const pyodideOutput = useRef<TerminalOutput[]>([]);
  const initRunning = useRef<boolean>(false);

  const init = useCallback(() => {
    // next.config.ts 内でpyodideをimportし、バージョンを取得している
    const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${process.env.PYODIDE_VERSION}/full/`;

    const initPyodide = () => {
      if (initRunning.current) return; // 重複実行を防ぐ
      initRunning.current = true;
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

          setIsPyodideReady(true);
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
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  const runPython = useCallback<(code: string) => Promise<TerminalOutput[]>>(
    async (code: string) => {
      const pyodide = pyodideRef.current;
      if (!pyodide || !isPyodideReady) {
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
      const output = [...pyodideOutput.current];
      pyodideOutput.current = []; // 出力をクリア
      return output;
    },
    [isPyodideReady]
  );

  /**
   * Pythonコードの構文が完結しているかチェックする
   */
  const checkSyntax = useCallback<(code: string) => Promise<SyntaxStatus>>(
    async (code) => {
      const pyodide = pyodideRef.current;
      if (!pyodide || !isPyodideReady) return "invalid";

      // グローバルスコープにチェック対象のコードを渡す
      (window as any).__code_to_check = code;
      try {
        // Pythonのコードを実行して結果を受け取る
        const status = await pyodide.runPythonAsync(CHECK_SYNTAX_CODE);
        return status;
      } catch (e) {
        console.error("Syntax check error:", e);
        return "invalid";
      }
    },
    [isPyodideReady]
  );

  return (
    <PyodideContext.Provider
      value={{
        init,
        isPyodideReady,
        runPython,
        checkSyntax,
      }}
    >
      {children}
    </PyodideContext.Provider>
  );
}

export function usePyodide() {
  const context = useContext(PyodideContext);
  if (!context) {
    throw new Error("usePyodide must be used within a PyodideProvider");
  }
  useEffect(() => {
    // Pyodideの初期化を行う
    context.init();
  }, [context]);

  return context;
}
