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
import { RuntimeContext, RuntimeLang } from "../runtime";
import { ReplOutput } from "../repl";

type WandboxLang = "cpp";

interface IWandboxContext {
  ready: boolean;
  getCommandlineStrWithLang: (
    lang: WandboxLang
  ) => (filenames: string[]) => string;
  runFilesWithLang: (
    lang: WandboxLang
  ) => (
    filenames: string[],
    files: Readonly<Record<string, string>>
  ) => Promise<ReplOutput[]>;
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
    };
  }, [compilerList]);

  const getCommandlineStrWithLang = useCallback(
    (lang: WandboxLang) => {
      if (selectedCompiler) {
        lang satisfies RuntimeLang;
        switch (lang) {
          case "cpp":
            return selectedCompiler.cpp.getCommandlineStr;
          default:
            lang satisfies never;
            throw new Error(`unsupported language: ${lang}`);
        }
      } else {
        return () => "";
      }
    },
    [selectedCompiler]
  );

  // Curried function for language-specific file execution
  const runFilesWithLang = useCallback(
    (lang: WandboxLang) =>
      async (filenames: string[], files: Readonly<Record<string, string>>) => {
        if (!selectedCompiler) {
          return [
            { type: "error" as const, message: "Wandbox is not ready yet." },
          ];
        }
        switch (lang) {
          case "cpp":
            return cppRunFiles(selectedCompiler.cpp, files, filenames);
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
      }}
    >
      {children}
    </WandboxContext.Provider>
  );
}

export function useWandbox(lang: WandboxLang): RuntimeContext {
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
  };
}
