"use client";

import { createContext, ReactNode, useCallback, useContext } from "react";
import useSWR from "swr";
import { compilerInfoFetcher } from "./api";
import { cppRunFiles, getCppCommandlineStr } from "./cpp";
import { useEmbedContext } from "../embedContext";
import { RuntimeContext } from "../runtime";
import { MutexInterface } from "async-mutex";

type WandboxLang = "C++";

interface IWandboxContext {
  init: () => Promise<void>;
  initializing: boolean;
  ready: boolean;
  mutex: MutexInterface;
  runFilesWithLang: (lang: WandboxLang) => (filenames: string[]) => Promise<ReturnType<typeof cppRunFiles>>;
  getCommandlineStrWithLang: (lang: WandboxLang) => (filenames: string[]) => string;
}

const WandboxContext = createContext<IWandboxContext>(null!);

export function useWandbox(lang: WandboxLang = "C++"): RuntimeContext {
  const context = useContext(WandboxContext);
  if (!context) {
    throw new Error("useWandbox must be used within a WandboxProvider");
  }
  
  return {
    init: context.init,
    initializing: context.initializing,
    ready: context.ready,
    mutex: context.mutex,
    runFiles: context.runFilesWithLang(lang),
    runCommand: async () => {
      // Wandbox doesn't support REPL, so return error
      return [{ type: "error" as const, message: "REPL not supported for this language" }];
    },
    getCommandlineStr: context.getCommandlineStrWithLang(lang),
  };
}

export function WandboxProvider({ children }: { children: ReactNode }) {
  const { files } = useEmbedContext();
  const { data: compilerList, error } = useSWR("list", compilerInfoFetcher);
  if (error) {
    console.error("Failed to fetch compiler list from Wandbox:", error);
  }

  const ready = !!compilerList;

  // Curried function for language-specific commandline string generation
  const getCommandlineStrWithLang = useCallback(
    (lang: WandboxLang) => (filenames: string[]) => {
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

  // Curried function for language-specific file execution
  const runFilesWithLang = useCallback(
    (lang: WandboxLang) => async (filenames: string[]) => {
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

  const init = useCallback(async () => {
    // Wandbox doesn't need initialization
  }, []);

  // Create a simple mutex that just executes the function immediately
  // Wandbox doesn't need mutex locking as it makes synchronous API calls
  const mutex: MutexInterface = {
    runExclusive: async <T,>(fn: () => Promise<T> | T) => {
      const result = fn();
      return result instanceof Promise ? result : Promise.resolve(result);
    },
    acquire: async () => {
      return () => {}; // Release function (no-op)
    },
    waitForUnlock: async () => {},
    isLocked: () => false,
    cancel: () => {},
    release: () => {},
  };

  return (
    <WandboxContext.Provider
      value={{
        init,
        initializing: false,
        ready,
        mutex,
        runFilesWithLang,
        getCommandlineStrWithLang,
      }}
    >
      {children}
    </WandboxContext.Provider>
  );
}
