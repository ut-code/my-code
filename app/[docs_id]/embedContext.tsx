"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { ReplCommand, ReplOutput } from "../terminal/repl";

// セクション内に埋め込まれているターミナルとファイルエディターの内容をSection側から取得できるよう、
// Contextに保存する
// TODO: C++では複数ファイルを実行する場合がありうるが、ここではfilenameを1つしか受け付けない想定になっている
interface IEmbedContext {
  addReplOutput: (
    terminalId: string,
    command: string,
    output: ReplOutput[]
  ) => void;
  setExecResult: (filename: string, output: ReplOutput[]) => void;

  replOutputs: Record<string, ReplCommand[]>;
  execResults: Record<string, ReplOutput[]>;
}
const EmbedContext = createContext<IEmbedContext | null>(null);
export const useEmbed = () => useContext(EmbedContext);

export function EmbedContextProvider({ children }: { children: ReactNode }) {
  const [replOutputs, setReplOutputs] = useState<Record<string, ReplCommand[]>>(
    {}
  );
  const [execResults, setExecResults] = useState<Record<string, ReplOutput[]>>(
    {}
  );
  const addReplOutput = useCallback(
    (terminalId: string, command: string, output: ReplOutput[]) =>
      setReplOutputs((outs) => ({
        ...outs,
        terminalId: [...(outs[terminalId] ?? []), { command, output }],
      })),
    []
  );
  const setExecResult = useCallback(
    (filename: string, output: ReplOutput[]) =>
      setExecResults((results) => {
        results[filename] = output;
        return results;
      }),
    []
  );

  // replOutputs: section内にあるターミナルにユーザーが入力したコマンドとその実行結果
  // fileContents: section内にあるファイルエディターの内容
  // execResults: section内にあるファイルの実行結果
  // console.log(section.title, replOutputs, fileContents, execResults);

  return (
    <EmbedContext.Provider
      value={{
        addReplOutput,
        setExecResult,
        replOutputs,
        execResults,
      }}
    >
      {children}
    </EmbedContext.Provider>
  );
}
