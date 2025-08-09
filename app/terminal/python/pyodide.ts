// Nextjsではドキュメント通りにpyodideをimportすると動かない? typeのインポートだけはできる
import { type PyodideAPI } from "pyodide";
import { useState, useEffect, useRef, useCallback } from "react";
import { TerminalOutput } from "../terminal";

declare global {
  interface Window {
    loadPyodide: (options: { indexURL: string }) => Promise<PyodideAPI>;
  }
}

export function usePyodide() {
  const pyodideRef = useRef<PyodideAPI>(null);
  const [isPyodideReady, setIsPyodideReady] = useState<boolean>(false);
  const pyodideOutput = useRef<TerminalOutput[]>([]);

  useEffect(() => {
    // next.config.ts 内でpyodideをimportし、バージョンを取得している
    const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${process.env.PYODIDE_VERSION}/full/`;

    const initPyodide = () => {
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
      if (!pyodide) {
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
          pyodideOutput.current.push({ type: "error", message: e.message });
        } else {
          pyodideOutput.current.push({ type: "error", message: String(e) });
        }
      }
      const output = [...pyodideOutput.current];
      pyodideOutput.current = []; // 出力をクリア
      return output;
    },
    []
  );

  // 外部に公開する値と関数
  return { isPyodideReady, runPython };
}
