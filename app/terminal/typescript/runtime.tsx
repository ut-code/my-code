"use client";

import ts, { CompilerOptions } from "typescript";
import {
  createSystem,
  createVirtualTypeScriptEnvironment,
  knownLibFilesForCompilerOptions,
  VirtualTypeScriptEnvironment,
} from "@typescript/vfs";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useEmbedContext } from "../embedContext";
import { ReplOutput } from "../repl";
import { RuntimeContext } from "../runtime";

export const compilerOptions: CompilerOptions = {};

const TypeScriptContext = createContext<VirtualTypeScriptEnvironment | null>(
  null
);
export function TypeScriptProvider({ children }: { children: ReactNode }) {
  const [tsEnv, setTSEnv] = useState<VirtualTypeScriptEnvironment | null>(null);
  useEffect(() => {
    if (tsEnv === null) {
      const abortController = new AbortController();
      (async () => {
        const system = createSystem(new Map());
        const libFiles = knownLibFilesForCompilerOptions(compilerOptions, ts);
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
        const env = createVirtualTypeScriptEnvironment(
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
  }, [tsEnv]);
  return (
    <TypeScriptContext.Provider value={tsEnv}>
      {children}
    </TypeScriptContext.Provider>
  );
}

export function useTypeScript(jsEval: RuntimeContext): RuntimeContext {
  const tsEnv = useContext(TypeScriptContext);

  const { writeFile } = useEmbedContext();
  const runFiles = useCallback(
    async (filenames: string[], files: Record<string, string>) => {
      if (tsEnv === null) {
        return [
          { type: "error" as const, message: "TypeScript is not ready yet." },
        ];
      }

      for (const [filename, content] of Object.entries(files)) {
        tsEnv.createFile(filename, content);
      }

      const outputs: ReplOutput[] = [];

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
      files = await writeFile(Object.fromEntries(emitOutput.outputFiles.map((of) => [of.name, of.text])));

      console.log(emitOutput)
      const jsOutputs = jsEval.runFiles([emitOutput.outputFiles[0].name], files);

      return outputs.concat(await jsOutputs);
    },
    [tsEnv, writeFile, jsEval]
  );
  return {
    ready: tsEnv !== null,
    runFiles,
    getCommandlineStr,
  };
}

function getCommandlineStr(filenames: string[]) {
  return `tsc ${filenames.join(" ")}`;
}
