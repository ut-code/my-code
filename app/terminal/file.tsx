"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

/*
ファイルの内容を1箇所でまとめて管理する。
  const [code, setCode] = useState("")
の代わりに
  const {files, writeFile} = useFile();
  files["ファイル名"]
でどこからでも同じファイルの中身を取得でき、
writeFile() で書き込むこともできる。
*/
interface IFileContext {
  files: Record<string, string | undefined>;
  writeFile: (name: string, content: string) => void;
}
const FileContext = createContext<IFileContext>(null!);

export const useFile = () => useContext(FileContext);

export function FileProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<Record<string, string>>({});
  const writeFile = useCallback((name: string, content: string) => {
    setFiles((files) => {
      files[name] = content;
      return { ...files };
    });
  }, []);

  return (
    <FileContext.Provider value={{ files, writeFile }}>
      {children}
    </FileContext.Provider>
  );
}
