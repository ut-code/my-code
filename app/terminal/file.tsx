"use client";

import { usePathname } from "next/navigation";
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

ファイルはページのURLごとに独立して管理している。
*/
interface IFileContext {
  files: Record<string, string | undefined>;
  writeFile: (name: string, content: string) => void;
}
const FileContext = createContext<IFileContext>(null!);

export const useFile = () => useContext(FileContext);

export function FileProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<Record<string, Record<string, string>>>(
    {}
  );
  const pathname = usePathname();
  if (!(pathname in files)) {
    files[pathname] = {};
  }
  const writeFile = useCallback(
    (name: string, content: string) => {
      setFiles((files) => {
        if (files[pathname][name] !== content) {
          files[pathname][name] = content;
          return { ...files };
        } else {
          return files;
        }
      });
    },
    [pathname]
  );

  return (
    <FileContext.Provider value={{ files: files[pathname], writeFile }}>
      {children}
    </FileContext.Provider>
  );
}
