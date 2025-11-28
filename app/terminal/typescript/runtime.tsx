"use client";

import type { ScriptTarget, CompilerOptions } from "typescript";
import type { VirtualTypeScriptEnvironment } from "@typescript/vfs";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useEmbedContext } from "../embedContext";
import { ReplOutput } from "../repl";
import { RuntimeContext } from "../runtime";

export const compilerOptions: CompilerOptions = {
  lib: ["ESNext", "WebWorker"],
  target: 10 satisfies ScriptTarget.ES2023,
  strict: true,
};

const TypeScriptContext = createContext<{
  init: () => void;
  tsEnv: VirtualTypeScriptEnvironment | null;
}>({ init: () => undefined, tsEnv: null });
export function TypeScriptProvider({ children }: { children: ReactNode }) {
  const [tsEnv, setTSEnv] = useState<VirtualTypeScriptEnvironment | null>(null);
  const [doInit, setDoInit] = useState(false);
  const init = useCallback(() => setDoInit(true), []);
  useEffect(() => {
    // useEffectはサーバーサイドでは実行されないが、
    // typeof window !== "undefined" でガードしないとなぜかesbuildが"typescript"を
    // サーバーサイドでのインポート対象とみなしてしまう。
    if (doInit && tsEnv === null && typeof window !== "undefined") {
      const abortController = new AbortController();
      (async () => {
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
      })();
      return () => {
        abortController.abort();
      };
    }
  }, [tsEnv, setTSEnv, doInit]);
  return (
    <TypeScriptContext.Provider value={{ init, tsEnv }}>
      {children}
    </TypeScriptContext.Provider>
  );
}

export function useTypeScript(jsEval: RuntimeContext): RuntimeContext {
  const { init: tsInit, tsEnv } = useContext(TypeScriptContext);
  const { init: jsInit } = jsEval;
  const init = useCallback(() => {
    tsInit();
    jsInit?.();
  }, [tsInit, jsInit]);

  const { writeFile } = useEmbedContext();
  const runFiles = useCallback(
    async (filenames: string[], files: Readonly<Record<string, string>>) => {
      if (tsEnv === null || typeof window === "undefined") {
        return [
          { type: "error" as const, message: "TypeScript is not ready yet." },
        ];
      } else {
        for (const [filename, content] of Object.entries(files)) {
          tsEnv.createFile(filename, content);
        }

        const outputs: ReplOutput[] = [];

        const ts = await import("typescript");

        for (const diagnostic of tsEnv.languageService.getSyntacticDiagnostics(
          filenames[0]
        )) {
          outputs.push({
            type: "error",
            message: ts.formatDiagnosticsWithColorAndContext([diagnostic], {
              getCurrentDirectory: () => "",
              getCanonicalFileName: (f) => f,
              getNewLine: () => "\n",
            }),
          });
        }

        for (const diagnostic of tsEnv.languageService.getSemanticDiagnostics(
          filenames[0]
        )) {
          outputs.push({
            type: "error",
            message: ts.formatDiagnosticsWithColorAndContext([diagnostic], {
              getCurrentDirectory: () => "",
              getCanonicalFileName: (f) => f,
              getNewLine: () => "\n",
            }),
          });
        }

        const emitOutput = tsEnv.languageService.getEmitOutput(filenames[0]);
        files = await writeFile(
          Object.fromEntries(
            emitOutput.outputFiles.map((of) => [of.name, of.text])
          )
        );

        for (const filename of Object.keys(files)) {
          tsEnv.deleteFile(filename);
        }

        console.log(emitOutput);
        const jsOutputs = jsEval.runFiles(
          [emitOutput.outputFiles[0].name],
          files
        );

        return outputs.concat(await jsOutputs);
      }
    },
    [tsEnv, writeFile, jsEval]
  );
  return {
    init,
    ready: tsEnv !== null,
    runFiles,
    getCommandlineStr,
  };
}

function getCommandlineStr(filenames: string[]) {
  return `npx tsc ${filenames.join(" ")} && node ${filenames[0].replace(/\.ts$/, ".js")}`;
}
