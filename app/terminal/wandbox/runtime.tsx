"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";
import useSWR from "swr";
import { compilerInfoFetcher, SelectedCompiler } from "./api";
import { cppRunFiles, selectCppCompiler } from "./cpp";
import { RuntimeContext, RuntimeInfo, RuntimeLang } from "../runtime";
import { ReplOutput } from "../repl";
import { rustRunFiles, selectRustCompiler } from "./rust";

type WandboxLang = "cpp" | "rust";

interface IWandboxContext {
  ready: boolean;
  getCommandlineStrWithLang: (
    lang: WandboxLang
  ) => (filenames: string[]) => string;
  runFilesWithLang: (
    lang: WandboxLang
  ) => (
    filenames: string[],
    files: Readonly<Record<string, string>>,
    onOutput: (output: ReplOutput) => void
  ) => Promise<void>;
  runtimeInfo: Record<WandboxLang, RuntimeInfo> | undefined,
}

const WandboxContext = createContext<IWandboxContext>(null!);

export function WandboxProvider({ children }: { children: ReactNode }) {
  const { data: compilerList, error } = useSWR("list", compilerInfoFetcher);
  if (error) {
    console.error("Failed to fetch compiler list from Wandbox:", error);
  }

  const ready = !!compilerList;

  const selectedCompiler = useMemo<
    Record<WandboxLang, SelectedCompiler> | undefined
  >(() => {
    if (!compilerList) {
      return undefined;
    }
    return {
      cpp: selectCppCompiler(compilerList),
      rust: selectRustCompiler(compilerList),
    };
  }, [compilerList]);

  const getCommandlineStrWithLang = useCallback(
    (lang: WandboxLang) => {
      if (selectedCompiler) {
        return selectedCompiler[lang].getCommandlineStr;
      } else {
        return () => "";
      }
    },
    [selectedCompiler]
  );

  // Curried function for language-specific file execution
  const runFilesWithLang = useCallback(
    (lang: WandboxLang) =>
      async (
        filenames: string[],
        files: Readonly<Record<string, string>>,
        onOutput: (output: ReplOutput) => void
      ) => {
        if (!selectedCompiler) {
          onOutput({ type: "error", message: "Wandbox is not ready yet." });
          return;
        }
        switch (lang) {
          case "cpp":
            await cppRunFiles(selectedCompiler.cpp, files, filenames, onOutput);
            break;
          case "rust":
            await rustRunFiles(selectedCompiler.rust, files, filenames, onOutput);
            break;
          default:
            lang satisfies never;
            throw new Error(`unsupported language: ${lang}`);
        }
      },
    [selectedCompiler]
  );

  return (
    <WandboxContext.Provider
      value={{
        ready,
        getCommandlineStrWithLang,
        runFilesWithLang,
        runtimeInfo: selectedCompiler,
      }}
    >
      {children}
    </WandboxContext.Provider>
  );
}

export function useWandbox(lang: WandboxLang): RuntimeContext {
  lang satisfies RuntimeLang;

  const context = useContext(WandboxContext);
  if (!context) {
    throw new Error("useWandbox must be used within a WandboxProvider");
  }
  const { runFilesWithLang, getCommandlineStrWithLang } = context;
  const runFiles = useMemo(
    () => runFilesWithLang(lang),
    [lang, runFilesWithLang]
  );
  const getCommandlineStr = useMemo(
    () => getCommandlineStrWithLang(lang),
    [lang, getCommandlineStrWithLang]
  );

  return {
    ready: context.ready,
    runFiles,
    getCommandlineStr,
    runtimeInfo: context.runtimeInfo?.[lang],
  };
}
