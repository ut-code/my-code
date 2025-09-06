"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { type MarkdownSection } from "./splitMarkdown";
import { StyledMarkdown } from "./markdown";
import { ChatForm } from "./chatForm";
import { ReplCommand, ReplOutput } from "../terminal/repl";
import { useFile } from "../terminal/file";

// セクション内に埋め込まれているターミナルとファイルエディターの内容をSection側から取得できるよう、
// Contextに保存する
// TODO: C++では複数ファイルを実行する場合がありうるが、ここではfilenameを1つしか受け付けない想定になっている
interface ISectionCodeContext {
  addReplOutput: (command: string, output: ReplOutput[]) => void;
  addFile: (filename: string) => void;
  setExecResult: (filename: string, output: ReplOutput[]) => void;
}
const SectionCodeContext = createContext<ISectionCodeContext | null>(null);
export const useSectionCode = () => useContext(SectionCodeContext);

interface SectionProps {
  section: MarkdownSection;
  sectionId: string;
}

// 1つのセクションのタイトルと内容を表示する。内容はMarkdownとしてレンダリングする
export function Section({ section, sectionId }: SectionProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [replOutputs, setReplOutputs] = useState<ReplCommand[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [execResults, setExecResults] = useState<Record<string, ReplOutput[]>>(
    {}
  );
  const [filenames, setFilenames] = useState<string[]>([]);
  const { files } = useFile();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fileContents: { name: string; content: string }[] = filenames.map(
    (name) => ({ name, content: files[name] || "" })
  );
  const addReplOutput = useCallback(
    (command: string, output: ReplOutput[]) =>
      setReplOutputs((outs) => [...outs, { command, output }]),
    []
  );
  const addFile = useCallback(
    (filename: string) =>
      setFilenames((filenames) =>
        filenames.includes(filename) ? filenames : [...filenames, filename]
      ),
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
    <SectionCodeContext.Provider
      value={{ addReplOutput, addFile, setExecResult }}
    >
      <div>
        <Heading level={section.level}>{section.title}</Heading>
        <StyledMarkdown content={section.content} />
        <ChatForm key={sectionId} documentContent={section.content} sectionId={sectionId} />
      </div>
    </SectionCodeContext.Provider>
  );
}

export function Heading({
  level,
  children,
}: {
  level: number;
  children: ReactNode;
}) {
  switch (level) {
    case 1:
      return <h1 className="text-2xl font-bold my-4">{children}</h1>;
    case 2:
      return <h2 className="text-xl font-bold mt-4 mb-3 ">{children}</h2>;
    case 3:
      return <h3 className="text-lg font-bold mt-4 mb-2">{children}</h3>;
    case 4:
      return <h4 className="text-base font-bold mt-3 mb-2">{children}</h4>;
    case 5:
      // TODO: これ以下は4との差がない (全体的に大きくする必要がある？)
      return <h5 className="text-base font-bold mt-3 mb-2">{children}</h5>;
    case 6:
      return <h6 className="text-base font-bold mt-3 mb-2">{children}</h6>;
  }
}
