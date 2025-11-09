"use client";

import type { CompilerOptions } from "typescript";
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
import dynamic from "next/dynamic";

export const compilerOptions: CompilerOptions = {};

type TSModules = {
  ts: typeof import("typescript");
  vfs: typeof import("@typescript/vfs");
};
interface ITypeScriptContext {
  modules: TSModules | null;
  setModules: (modules: TSModules) => void;
  tsEnv: VirtualTypeScriptEnvironment | null;
}
const TypeScriptContext = createContext<ITypeScriptContext>({
  modules: null,
  setModules: () => {},
  tsEnv: null,
});
const LazyInitTypeScript = dynamic(
  async () => {
    const ts = await import("typescript");
    const vfs = await import("@typescript/vfs");
    return function LazyInitTypeScript() {
      const { setModules } = useContext(TypeScriptContext);
      useEffect(() => {
        setModules({ ts, vfs });
      }, [setModules]);
      return null;
    };
  },
  { ssr: false }
);
export function TypeScriptProvider({ children }: { children: ReactNode }) {
  const [tsEnv, setTSEnv] = useState<VirtualTypeScriptEnvironment | null>(null);
  const [modules, setModules] = useState<TSModules | null>(null);

  useEffect(() => {
    if (modules !== null && tsEnv === null) {
      const { ts, vfs } = modules;
      const abortController = new AbortController();
      (async () => {
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
  }, [tsEnv, setTSEnv, modules]);
  return (
    <TypeScriptContext.Provider value={{ tsEnv, modules, setModules }}>
      <LazyInitTypeScript />
      {children}
    </TypeScriptContext.Provider>
  );
}

export function useTypeScript(jsEval: RuntimeContext): RuntimeContext {
  const { modules, tsEnv } = useContext(TypeScriptContext);

  const { writeFile } = useEmbedContext();
  const runFiles = useCallback(
    async (filenames: string[], files: Record<string, string>) => {
      if (tsEnv === null || modules === null) {
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
          message: modules.ts.formatDiagnosticsWithColorAndContext(
            [diagnostic],
            {
              getCurrentDirectory: () => "",
              getCanonicalFileName: (f) => f,
              getNewLine: () => "\n",
            }
          ),
        });
      }

      for (const diagnostic of tsEnv.languageService.getSemanticDiagnostics(
        filenames[0]
      )) {
        outputs.push({
          type: "error",
          message: modules.ts.formatDiagnosticsWithColorAndContext(
            [diagnostic],
            {
              getCurrentDirectory: () => "",
              getCanonicalFileName: (f) => f,
              getNewLine: () => "\n",
            }
          ),
        });
      }

      const emitOutput = tsEnv.languageService.getEmitOutput(filenames[0]);
      files = await writeFile(
        Object.fromEntries(
          emitOutput.outputFiles.map((of) => [of.name, of.text])
        )
      );

      console.log(emitOutput);
      const jsOutputs = jsEval.runFiles(
        [emitOutput.outputFiles[0].name],
        files
      );

      return outputs.concat(await jsOutputs);
    },
    [modules, tsEnv, writeFile, jsEval]
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
