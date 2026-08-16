"use client";

import { useState, FormEvent, useEffect, useMemo, useRef } from "react";
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
  SectionId,
} from "@/lib/docs";
import { ChatWithMessages } from "@/lib/chatHistory";
import { ChatForm } from "../[pageId]/chatForm";
import { ChatListForSection } from "../[pageId]/pageContent";
import { usePagesListForLang } from "@/pagesListContext";
import { useEmbedContext } from "@/terminal/embedContext";
import { useSidebarMdContext } from "@/sidebar";
import clsx from "clsx";

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

  // サイドバーの目次用セクション定義
  const baseSections = useMemo(() => {
    const list: Array<{ id: SectionId; title: string; level: number }> = [];
    if (config?.repl) {
      list.push({ id: "sandbox-repl" as SectionId, title: "REPL", level: 2 });
    }
    if (config?.editor || userFiles.length > 0) {
      list.push({ id: "sandbox-editor" as SectionId, title: "コード", level: 2 });
    }
    if (config?.exec) {
      list.push({ id: "sandbox-exec" as SectionId, title: "実行", level: 2 });
    }
    if (config?.readonlyFiles && config.readonlyFiles.length > 0) {
      list.push({
        id: "sandbox-readonly" as SectionId,
        title: "出力ファイル",
        level: 2,
      });
    }
    return list;
  }, [config, userFiles.length]);

  const [sectionInView, setSectionInView] = useState<boolean[]>([]);
  const sectionRefs = useRef<Map<string, HTMLElement | null>>(new Map());

  useEffect(() => {
    const handleScroll = () => {
      setSectionInView(
        baseSections.map((sec) => {
          const el = sectionRefs.current.get(sec.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            return (
              rect.top < window.innerHeight * 0.9 &&
              rect.bottom >= window.innerHeight * 0.1
            );
          }
          return false;
        })
      );
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [baseSections]);

  const dynamicSections: DynamicMarkdownSection[] = useMemo(() => {
    return baseSections.map((sec, i) => ({
      id: sec.id,
      title: sec.title,
      level: sec.level,
      file: "sandbox.md",
      rawContent: "",
      md5: "",
      replacedContent: "",
      replacedRange: [],
      inView: sectionInView[i] ?? false,
    }));
  }, [baseSections, sectionInView]);

  useEffect(() => {
    setSidebarMdContent(path, dynamicSections);
  }, [dynamicSections, path, setSidebarMdContent]);

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
      <Heading level={1}>{langEntry?.name ?? langId} Sandbox</Heading>
      <p className="mx-1">
        ブラウザ上で動作する {langEntry?.name} の実行環境です。
        このページでは自由にコードを書いて試したり、コードについてAIに質問することもできます。
      </p>

      <ul className="my-2 ml-2 text-sm">
        <li className={clsx("my-1", !config.repl && "line-through text-base-content/50 decoration-current")}>
          <span className={clsx("mr-1 status", config?.repl && "status-accent")} />
          REPLでの実行
        </li>
        <li className={clsx("my-1", !config.exec && "line-through text-base-content/50 decoration-current")}>
          <span className={clsx("mr-1 status", config?.exec && "status-accent")} />
          ファイル実行
        </li>
        <li className={clsx("my-1", !config.supportsMultiFile && "line-through text-base-content/50 decoration-current")}>
          <span className={clsx("mr-1 status", config?.supportsMultiFile && "status-accent")} />
          複数ファイル対応
        </li>
      </ul>

          <ChatListForSection
            sectionId={"sandbox" as SectionId}
            dynamicMdContent={dynamicSections}
            chatHistories={chatHistories}
            fullWidth
          />


        {/* 1. REPL */}
        {config?.repl && (
          <section
            id="sandbox-repl"
            ref={(el) => {
              sectionRefs.current.set("sandbox-repl", el);
            }}
          >
            <Heading level={2}>REPL</Heading>
            <ReplTerminal
              terminalId={`sandbox-${langId}`}
              language={langConstants(runtimeLang)}
              initContent={config.replInitContent}
            />
          </section>
        )}

        {/* 2. エディター (既存ファイル + 追加ファイル + 追加ボタン) */}
        {(config?.editor || userFiles.length > 0 || config?.supportsMultiFile) && (
          <section
            id="sandbox-editor"
            ref={(el) => {
              sectionRefs.current.set("sandbox-editor", el);
            }}
          >
            <Heading level={2}>コード</Heading>
            {config?.editor &&
              Object.entries(config.editor).map(([filename, initContent]) => (
                <EditorComponent
                  key={filename}
                  language={langConstants(runtimeLang)}
                  filename={filename}
                  initContent={initContent}
                />
              ))}

            {userFiles.map((filename) => (
              <EditorComponent
                key={filename}
                language={langConstants(runtimeLang)}
                filename={filename}
                initContent=""
                onDelete={() => handleRemoveFile(filename)}
              />
            ))}

            {config?.supportsMultiFile && (
              <div className="mx-2 my-2 mt-4">
                <form onSubmit={handleAddFile} className="flex items-center gap-2">
                  ファイルを追加:
                  <input
                    type="text"
                    className="input input-bordered input-sm flex-1 font-mono"
                    placeholder="追加するファイル名を入力"
                    value={newFilename}
                    onChange={(e) => {
                      setNewFilename(e.target.value);
                      setFilenameError(null);
                    }}
                  />
                  <button type="submit" className="btn btn-sm btn-accent">
                    ファイルを追加
                  </button>
                </form>
                {filenameError && (
                  <p className="text-error text-sm mt-1">{filenameError}</p>
                )}
              </div>
            )}
          </section>
        )}

        {/* 3. 実行 */}
        {config?.exec && (
          <section
            id="sandbox-exec"
            ref={(el) => {
              sectionRefs.current.set("sandbox-exec", el);
            }}
          >
            <Heading level={2}>実行</Heading>
            <ExecFile
              filenames={config.exec}
              language={langConstants(runtimeLang)}
              content=""
            />
          </section>
        )}

        {/* 4. 出力ファイル */}
        {config?.readonlyFiles && config.readonlyFiles.length > 0 && (
          <section
            id="sandbox-readonly"
            ref={(el) => {
              sectionRefs.current.set("sandbox-readonly", el);
            }}
          >
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
          </section>
        )}

      {isFormVisible ? (
        <div className="fixed bottom-4 right-4 left-4 has-sidebar:left-[calc(var(--container-sidebar)+1rem)] z-40">
          <ChatForm
            path={path}
            langName={langEntry?.name ?? langId}
            sectionContent={dynamicSections}
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
