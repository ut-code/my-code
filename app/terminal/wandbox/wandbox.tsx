"use client";

import { createContext, ReactNode, useCallback, useContext } from "react";
import { ReplOutput } from "../repl";
import { useFile } from "../file";
import useSWR from "swr";
import { compilerInfoFetcher } from "./api";
import { cppRunFiles, getCppCommandlineStr } from "./cpp";

type WandboxLang = "C++";

interface IWandboxContext {
  // filesの中から、filenamesで指定されたものをコードとして渡して実行する
  // ヘッダーとソースはまとめて渡す
  runFiles: (lang: WandboxLang, filenames: string[]) => Promise<ReplOutput[]>;
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
  const { files } = useFile();
  const { data: compilerList, error } = useSWR("list", compilerInfoFetcher);
  if (error) {
    console.error("Failed to fetch compiler list from Wandbox:", error);
  }

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
  const runFiles = useCallback(
    async (lang: WandboxLang, filenames: string[]) => {
      if (!compilerList) {
        return [
          { type: "error" as const, message: "Wandbox is not ready yet." },
        ];
      }
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

  return (
    <WandboxContext.Provider value={{ runFiles, getCommandlineStr }}>
      {children}
    </WandboxContext.Provider>
  );
}
