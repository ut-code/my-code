"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ReplCommand, ReplOutput } from "./repl";

/*
ファイルの内容や埋め込みターミナルのログを1箇所でまとめて管理し、書き込み・読み込みできるようにする

ファイルはページのURLごとに独立して管理し、常にすべて保持している。
ターミナルのログもページごとに独立だが、ページが切り替わるたびに消す。
*/

// 全部stringだけどわかりやすくするために名前をつけている
type PagePathname = string;
type Filename = string;
type TerminalId = string;

interface IEmbedContext {
  files: Record<Filename, string>;
  writeFile: (name: Filename, content: string) => void;

  replOutputs: Record<TerminalId, ReplCommand[]>;
  addReplOutput: (
    terminalId: TerminalId,
    command: string,
    output: ReplOutput[]
  ) => void;

  execResults: Record<Filename, ReplOutput[]>;
  setExecResult: (filename: Filename, output: ReplOutput[]) => void;
}
const EmbedContext = createContext<IEmbedContext>(null!);

export function useEmbedContext() {
  const context = useContext(EmbedContext);
  if (!context) {
    throw new Error(
      "useEmbedContext must be used within a EmbedContextProvider"
    );
  }
  return context;
}

export function EmbedContextProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const [currentPathname, setCurrentPathname] = useState<PagePathname>("");
  const [files, setFiles] = useState<
    Record<PagePathname, Record<Filename, string>>
  >({});
  const [replOutputs, setReplOutputs] = useState<
    Record<TerminalId, ReplCommand[]>
  >({});
  const [execResults, setExecResults] = useState<
    Record<Filename, ReplOutput[]>
  >({});
  // pathnameが変わったらデータを初期化
  useEffect(() => {
    if (pathname && pathname !== currentPathname) {
      setCurrentPathname(pathname);
      setReplOutputs({});
      setExecResults({});
    }
  }, [pathname, currentPathname]);

  const writeFile = useCallback(
    (name: Filename, content: string) => {
      setFiles((files) => {
        if (files[pathname]?.[name] !== content) {
          files = { ...files };
          files[pathname] = { ...(files[pathname] ?? {}) };
          files[pathname][name] = content;
          return files;
        } else {
          return files;
        }
      });
    },
    [pathname]
  );
  const addReplOutput = useCallback(
    (terminalId: TerminalId, command: string, output: ReplOutput[]) =>
      setReplOutputs((outs) => {
        outs = { ...outs };
        if (!(terminalId in outs)) {
          outs[terminalId] = [];
        }
        outs[terminalId] = [
          ...outs[terminalId],
          { command: command, output: output },
        ];
        return outs;
      }),
    []
  );
  const setExecResult = useCallback(
    (filename: Filename, output: ReplOutput[]) =>
      setExecResults((results) => {
        results = { ...results };
        results[filename] = output;
        return results;
      }),
    []
  );

  return (
    <EmbedContext.Provider
      value={{
        files: files[pathname] || {},
        writeFile,
        replOutputs,
        addReplOutput,
        execResults,
        setExecResult,
      }}
    >
      {children}
    </EmbedContext.Provider>
  );
}
