"use client";

import type { ScriptTarget, CompilerOptions } from "typescript";
import type { VirtualTypeScriptEnvironment } from "@typescript/vfs";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Diagnostic,
  DiagnosticSeverity,
  ReplOutput,
  RuntimeContext,
  RuntimeErrorHandler,
  RuntimeInfo,
  UpdatedFile,
} from "../interface";

export const compilerOptions: CompilerOptions = {
  lib: ["ESNext", "WebWorker"],
  target: 10 satisfies ScriptTarget.ES2023,
  strict: true,
};

const TypeScriptContext = createContext<{
  init: (onError?: RuntimeErrorHandler) => void;
  tsEnv: VirtualTypeScriptEnvironment | null;
  tsVersion?: string;
}>({ init: () => undefined, tsEnv: null });
export function TypeScriptProvider({ children }: { children: ReactNode }) {
  const [tsEnv, setTSEnv] = useState<VirtualTypeScriptEnvironment | null>(null);
  const [tsVersion, setTSVersion] = useState<string | undefined>(undefined);
  const [doInit, setDoInit] = useState(false);
  const onErrorRef = useRef<RuntimeErrorHandler | undefined>(undefined);
  const init = useCallback((onError?: RuntimeErrorHandler) => {
    onErrorRef.current = onError;
    setDoInit(true);
  }, []);
  useEffect(() => {
    // useEffectはサーバーサイドでは実行されないが、
    // typeof window !== "undefined" でガードしないとなぜかesbuildが"typescript"を
    // サーバーサイドでのインポート対象とみなしてしまう。
    if (doInit && tsEnv === null && typeof window !== "undefined") {
      const abortController = new AbortController();
      void (async () => {
        const ts = await import("typescript");
        const vfs = await import("@typescript/vfs");
        const system = vfs.createSystem(new Map());
        const libFiles = vfs.knownLibFilesForCompilerOptions(
          compilerOptions,
          ts
        );
        const libFileContents = await Promise.all(
          libFiles.map(async (libFile) => {
            const response = await fetch(
              `/typescript/${ts.version}/${libFile}`,
              { signal: abortController.signal }
            );
            if (response.ok) {
              return response.text();
            } else {
              return undefined;
            }
          })
        );
        libFiles.forEach((libFile, index) => {
          const content = libFileContents[index];
          if (content !== undefined) {
            system.writeFile(`/${libFile}`, content);
          }
        });
        const env = vfs.createVirtualTypeScriptEnvironment(
          system,
          [],
          ts,
          compilerOptions
        );
        setTSEnv(env);
        setTSVersion(ts.version);
      })().catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        onErrorRef.current?.(error);
      });
      return () => {
        abortController.abort();
      };
    }
  }, [tsEnv, setTSEnv, doInit]);
  return (
    <TypeScriptContext.Provider value={{ init, tsEnv, tsVersion }}>
      {children}
    </TypeScriptContext.Provider>
  );
}

export function useTypeScript(jsEval: RuntimeContext): RuntimeContext {
  const { init: tsInit, tsEnv, tsVersion } = useContext(TypeScriptContext);
  const { init: jsInit } = jsEval;
  const onErrorRef = useRef<RuntimeErrorHandler | undefined>(undefined);
  const init = useCallback((onError?: RuntimeErrorHandler) => {
    onErrorRef.current = onError;
    tsInit(onError);
    jsInit?.(onError);
  }, [tsInit, jsInit]);

  const runFiles = useCallback(
    async (
      filenames: string[],
      files: Readonly<Record<string, string>>,
      onOutput: (output: ReplOutput | UpdatedFile) => void,
      onDiagnostic?: (diagnostic: Diagnostic) => void
    ) => {
      if (tsEnv === null || typeof window === "undefined") {
        onOutput({ type: "error", message: "TypeScript is not ready yet." });
        return;
      } else {
        try {
        for (const [filename, content] of Object.entries(files)) {
          tsEnv.createFile(filename, content);
        }

        const ts = await import("typescript");

        const convertDiagnostic = (diag: import("typescript").Diagnostic): Diagnostic => {
          let line = 0;
          let character = 0;
          let endLineNumber: number | undefined = undefined;
          let endColumn: number | undefined = undefined;

          if (diag.file && diag.start !== undefined) {
            const pos = diag.file.getLineAndCharacterOfPosition(diag.start);
            line = pos.line;
            character = pos.character;

            if (diag.length !== undefined) {
              const endPos = diag.file.getLineAndCharacterOfPosition(
                diag.start + diag.length
              );
              endLineNumber = endPos.line + 1;
              endColumn = endPos.character + 1;
            }
          }

          const message =
            typeof diag.messageText === "string"
              ? diag.messageText
              : ts.flattenDiagnosticMessageText(diag.messageText, "\n");

          let severity: DiagnosticSeverity = "error";
          if (diag.category === ts.DiagnosticCategory.Warning) {
            severity = "warning";
          } else if (
            diag.category === ts.DiagnosticCategory.Suggestion ||
            diag.category === ts.DiagnosticCategory.Message
          ) {
            severity = "info";
          }

          const filename = (diag.file ? diag.file.fileName : filenames[0]).replace(
            /^\//,
            ""
          );

          return {
            filename,
            startLineNumber: line + 1,
            startColumn: character + 1,
            endLineNumber,
            endColumn,
            message,
            severity,
          };
        };

        for (const diagnostic of tsEnv.languageService.getSyntacticDiagnostics(
          filenames[0]
        )) {
          onOutput({
            type: "error",
            message: ts.formatDiagnosticsWithColorAndContext([diagnostic], {
              getCurrentDirectory: () => "",
              getCanonicalFileName: (f) => f,
              getNewLine: () => "\n",
            }),
          });
          onDiagnostic?.(convertDiagnostic(diagnostic));
        }

        for (const diagnostic of tsEnv.languageService.getSemanticDiagnostics(
          filenames[0]
        )) {
          onOutput({
            type: "error",
            message: ts.formatDiagnosticsWithColorAndContext([diagnostic], {
              getCurrentDirectory: () => "",
              getCanonicalFileName: (f) => f,
              getNewLine: () => "\n",
            }),
          });
          onDiagnostic?.(convertDiagnostic(diagnostic));
        }

        const emitOutput = tsEnv.languageService.getEmitOutput(filenames[0]);
        const emittedFiles: Record<string, string> = Object.fromEntries(
          emitOutput.outputFiles.map((of) => [of.name, of.text])
        );
        for (const [filename, content] of Object.entries(emittedFiles)) {
          onOutput({ type: "file", filename, content });
        }

        for (const filename of Object.keys(emittedFiles)) {
          tsEnv.deleteFile(filename);
        }

        console.log(emitOutput);
        await jsEval.runFiles(
          [emitOutput.outputFiles[0].name],
          { ...files, ...emittedFiles },
          onOutput,
          onDiagnostic
        );
        } catch (error) {
          onErrorRef.current?.(error);
          onOutput({
            type: "fatalError",
            message: error instanceof Error ? error.message : String(error),
          });
        }
      }
    },
    [tsEnv, jsEval]
  );

  const runtimeInfo = useMemo<RuntimeInfo>(
    () => ({
      prettyLangName: "TypeScript",
      version: tsVersion,
    }),
    [tsVersion]
  );
  return {
    init,
    ready: tsEnv !== null && jsEval.ready,
    runFiles,
    getCommandlineStr,
    runtimeInfo,
    mutex: jsEval.mutex,
  };
}

function getCommandlineStr(filenames: string[]) {
  return `npx tsc ${filenames.join(" ")} && node ${filenames[0].replace(/\.ts$/, ".js")}`;
}
