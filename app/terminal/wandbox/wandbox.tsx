"use client";

import { createContext, ReactNode, useCallback, useContext } from "react";
import useSWR from "swr";
import { compilerInfoFetcher } from "./api";
import { cppRunFiles, getCppCommandlineStr } from "./cpp";
import { useEmbedContext } from "../embedContext";
import { RuntimeContext } from "../runtime";
import { MutexInterface } from "async-mutex";

type WandboxLang = "C++";

interface IWandboxContext extends RuntimeContext {
  // 表示用のコマンドライン文字列を取得
  getCommandlineStr: (lang: WandboxLang, filenames: string[]) => string;
}

const WandboxContext = createContext<IWandboxContext>(null!);
export function useWandbox() {
  const context = useContext(WandboxContext);
  if (!context) {
    throw new Error("useWandbox must be used within a WandboxProvider");
  }
  return context;
}

export function WandboxProvider({ children }: { children: ReactNode }) {
  const { files } = useEmbedContext();
  const { data: compilerList, error } = useSWR("list", compilerInfoFetcher);
  if (error) {
    console.error("Failed to fetch compiler list from Wandbox:", error);
  }

  const ready = !!compilerList;

  const getCommandlineStr = useCallback(
    (lang: WandboxLang, filenames: string[]) => {
      if (compilerList) {
        switch (lang) {
          case "C++":
            return getCppCommandlineStr(compilerList, filenames);
          default:
            lang satisfies never;
            throw new Error(`unsupported language: ${lang}`);
        }
      } else {
        return "";
      }
    },
    [compilerList]
  );

  const runFilesWithLang = useCallback(
    async (lang: WandboxLang, filenames: string[]) => {
      if (!compilerList) {
        return [
          { type: "error" as const, message: "Wandbox is not ready yet." },
        ];
      }
      console.log(files);
      switch (lang) {
        case "C++":
          return cppRunFiles(compilerList, files, filenames);
        default:
          lang satisfies never;
          return [
            {
              type: "error" as const,
              message: `Unsupported language: ${lang}`,
            },
          ];
      }
    },
    [compilerList, files]
  );

  const runFiles = useCallback(
    async (filenames: string[]) => {
      return runFilesWithLang("C++", filenames);
    },
    [runFilesWithLang]
  );

  const init = useCallback(async () => {
    // Wandbox doesn't need initialization
  }, []);

  // Create a simple mutex that just executes the function
  const mutex: MutexInterface = {
    runExclusive: async <T,>(fn: () => Promise<T>) => fn(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  return (
    <WandboxContext.Provider
      value={{
        init,
        initializing: false,
        ready,
        mutex,
        runFiles,
        getCommandlineStr,
      }}
    >
      {children}
    </WandboxContext.Provider>
  );
}
