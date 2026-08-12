"use client";

import { useState, FormEvent, useEffect } from "react";
import { Heading } from "@/markdown/heading";
import { langConstants, RuntimeLang } from "@my-code/runtime/languages";
import { ReplTerminal } from "@/terminal/repl";
import { EditorComponent } from "@/terminal/editor";
import { ExecFile } from "@/terminal/exec";
import { sampleConfig } from "@/terminal/sampleConfig";
import {
  DynamicMarkdownSection,
  LangId,
  PagePath,
  PageSlug,
  SectionId,
} from "@/lib/docs";
import { ChatWithMessages } from "@/lib/chatHistory";
import { ChatForm } from "../[pageId]/chatForm";
import { ChatListForSection } from "../[pageId]/pageContent";
import { usePagesListForLang } from "@/pagesListContext";
import { useEmbedContext } from "@/terminal/embedContext";
import { useSidebarMdContext } from "@/sidebar";

interface SandboxContentProps {
  langId: LangId;
  path: PagePath;
  chatHistories: ChatWithMessages[];
}

export function SandboxContent(props: SandboxContentProps) {
  const { langId, path, chatHistories } = props;
  const langEntry = usePagesListForLang(langId);
  const { setSidebarMdContent } = useSidebarMdContext();
  const { writeFile } = useEmbedContext();

  const runtimeLang = langId as RuntimeLang;
  const config = sampleConfig[runtimeLang];

  const [userFiles, setUserFiles] = useState<string[]>([]);
  const [newFilename, setNewFilename] = useState("");
  const [filenameError, setFilenameError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const dummySection: DynamicMarkdownSection[] = [
    {
      id: "sandbox" as SectionId,
      level: 1,
      title: "sandbox",
      file: "sandbox.md",
      rawContent: "",
      md5: "",
      replacedContent: "",
      replacedRange: [],
      inView: true,
    },
  ];

  useEffect(() => {
    setSidebarMdContent(path, dummySection);
  }, [path, setSidebarMdContent]);

  const handleAddFile = (e: FormEvent) => {
    e.preventDefault();
    const name = newFilename.trim();
    if (!name) return;

    // 既存ファイルチェック
    const defaultFiles = config?.editor ? Object.keys(config.editor) : [];
    const readonlyFiles = config?.readonlyFiles ?? [];
    if (
      defaultFiles.includes(name) ||
      readonlyFiles.includes(name) ||
      userFiles.includes(name)
    ) {
      setFilenameError("同名のファイルがすでに存在します。");
      return;
    }

    setFilenameError(null);
    setUserFiles((prev) => [...prev, name]);
    writeFile({ [name]: "" });
    setNewFilename("");
  };

  const handleRemoveFile = (filename: string) => {
    setUserFiles((prev) => prev.filter((f) => f !== filename));
  };

  return (
    <div className="flex-1 p-4 pb-16 flex flex-col max-w-docs mx-auto w-full">
      <div className="flex flex-row items-center justify-between mb-4">
        <Heading level={1}>{langEntry?.name ?? langId} Sandbox</Heading>
      </div>

      <div className="flex flex-col gap-6">
        {config?.repl && (
          <div>
            <Heading level={2}>REPL</Heading>
            <ReplTerminal
              terminalId={`sandbox-${langId}`}
              language={langConstants(runtimeLang)}
              initContent={config.replInitContent}
            />
          </div>
        )}

        {config?.editor && (
          <div>
            <Heading level={2}>サンプルコード</Heading>
            {Object.entries(config.editor).map(([filename, initContent]) => (
              <EditorComponent
                key={filename}
                language={langConstants(runtimeLang)}
                filename={filename}
                initContent={initContent}
              />
            ))}
          </div>
        )}

        {config?.exec && (
          <div>
            <Heading level={2}>実行</Heading>
            <ExecFile
              filenames={config.exec}
              language={langConstants(runtimeLang)}
              content=""
            />
          </div>
        )}

        {config?.readonlyFiles && config.readonlyFiles.length > 0 && (
          <div>
            <Heading level={2}>出力ファイル</Heading>
            {config.readonlyFiles.map((filename) => (
              <EditorComponent
                key={filename}
                language={langConstants(runtimeLang)}
                filename={filename}
                initContent=""
                readonly
              />
            ))}
          </div>
        )}

        <div>
          <Heading level={2}>追加ファイル</Heading>
          <form onSubmit={handleAddFile} className="flex gap-2 mb-4">
            <input
              type="text"
              className="input input-bordered input-sm flex-1 font-mono"
              placeholder="ファイル名を入力 (例: helper.py)"
              value={newFilename}
              onChange={(e) => {
                setNewFilename(e.target.value);
                setFilenameError(null);
              }}
            />
            <button type="submit" className="btn btn-sm btn-secondary">
              ファイルを追加
            </button>
          </form>
          {filenameError && (
            <p className="text-error text-sm mb-2">{filenameError}</p>
          )}

          {userFiles.map((filename) => (
            <div key={filename} className="relative my-2">
              <div className="flex justify-between items-center bg-base-200 px-3 py-1 rounded-t-box border-b border-base-300">
                <span className="font-mono text-sm">{filename}</span>
                <button
                  className="btn btn-xs btn-error btn-soft"
                  onClick={() => handleRemoveFile(filename)}
                >
                  削除
                </button>
              </div>
              <EditorComponent
                language={langConstants(runtimeLang)}
                filename={filename}
                initContent=""
              />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <ChatListForSection
            sectionId={"sandbox" as SectionId}
            dynamicMdContent={dummySection}
            chatHistories={chatHistories}
          />
        </div>
      </div>

      {isFormVisible ? (
        <div className="fixed bottom-4 right-4 left-4 has-sidebar:left-[calc(var(--container-sidebar)+1rem)] z-40">
          <ChatForm
            path={path}
            langName={langEntry?.name ?? langId}
            sectionContent={dummySection}
            close={() => setIsFormVisible(false)}
          />
        </div>
      ) : (
        <button
          className="fixed bottom-4 right-4 btn btn-soft btn-secondary rounded-full shadow-md z-50"
          onClick={() => setIsFormVisible(true)}
        >
          AIに質問
        </button>
      )}
    </div>
  );
}
