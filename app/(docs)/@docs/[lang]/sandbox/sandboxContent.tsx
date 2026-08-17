"use client";

import { useState, FormEvent, useEffect, useMemo, useRef } from "react";
import { Heading } from "@/markdown/heading";
import { langConstants, RuntimeLang } from "@my-code/runtime/languages";
import { ReplTerminal } from "@/terminal/repl";
import { EditorComponent } from "@/terminal/editor";
import { ExecFile } from "@/terminal/exec";
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
  const language = useMemo(() => langConstants(runtimeLang), [runtimeLang]);

  const [userFiles, setUserFiles] = useState<string[]>([]);
  const [newFilename, setNewFilename] = useState("");
  const [filenameError, setFilenameError] = useState<string | null>(null);

  const [userOutputFiles, setUserOutputFiles] = useState<string[]>([]);
  const [newOutputFilename, setNewOutputFilename] = useState("");
  const [outputFilenameError, setOutputFilenameError] = useState<string | null>(
    null
  );

  const [isFormVisible, setIsFormVisible] = useState(false);

  // サイドバーの目次用セクション定義
  const hasRepl = language.repl;
  const hasEditor = true;
  const hasAddFile = language.supportsMultiFile;
  const hasExec = true;
  const hasOutputFile =
    (language.readonlyFiles && language.readonlyFiles.length > 0) ||
    language.supportsFileOutput;
  const hasAddOutputFile = language.supportsFileOutput;
  const baseSections = useMemo(() => {
    const list: Array<{ id: SectionId; title: string; level: number }> = [];
    if (hasRepl) {
      list.push({ id: "sandbox-repl" as SectionId, title: "REPL", level: 2 });
    }
    if (hasEditor) {
      list.push({
        id: "sandbox-editor" as SectionId,
        title: "コード",
        level: 2,
      });
    }
    if (hasExec) {
      list.push({ id: "sandbox-exec" as SectionId, title: "実行", level: 2 });
    }
    if (hasOutputFile) {
      list.push({
        id: "sandbox-readonly" as SectionId,
        title: "出力ファイル",
        level: 2,
      });
    }
    return list;
  }, [hasRepl, hasEditor, hasExec, hasOutputFile]);

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
    const defaultFiles = language.sampleFiles
      ? Object.keys(language.sampleFiles)
      : [];
    const readonlyFiles = language.readonlyFiles ?? [];
    if (
      defaultFiles.includes(name) ||
      readonlyFiles.includes(name) ||
      userFiles.includes(name) ||
      userOutputFiles.includes(name)
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

  const handleAddOutputFile = (e: FormEvent) => {
    e.preventDefault();
    const name = newOutputFilename.trim();
    if (!name) return;

    // 既存ファイルチェック
    const defaultFiles = language.sampleFiles
      ? Object.keys(language.sampleFiles)
      : [];
    const readonlyFiles = language.readonlyFiles ?? [];
    if (
      defaultFiles.includes(name) ||
      readonlyFiles.includes(name) ||
      userFiles.includes(name) ||
      userOutputFiles.includes(name)
    ) {
      setOutputFilenameError("同名のファイルがすでに存在します。");
      return;
    }

    setOutputFilenameError(null);
    setUserOutputFiles((prev) => [...prev, name]);
    writeFile({ [name]: "" });
    setNewOutputFilename("");
  };

  const handleRemoveOutputFile = (filename: string) => {
    setUserOutputFiles((prev) => prev.filter((f) => f !== filename));
  };

  return (
    <div className="flex-1 p-4 pb-16 flex flex-col max-w-docs mx-auto w-full">
      <Heading level={1}>{langEntry?.name ?? langId} Sandbox</Heading>
      <p className="mx-1">
        ブラウザ上で動作する {langEntry?.name} の実行環境です。
        このページでは自由にコードを書いて試したり、コードについてAIに質問することもできます。
      </p>

      <div className="flex flex-col sm:flex-row justify-between p-2 gap-2 w-full">
        <ul className="text-sm flex-none">
          {(
            [
              [hasRepl, "REPLでの実行"],
              [hasExec, "ファイル実行"],
              [hasAddFile, "複数ファイル対応"],
              [hasAddOutputFile, "ファイル出力対応"],
            ] as const
          ).map(([enabled, name]) => (
            <li
              key={name}
              className={clsx(
                "my-1",
                !enabled &&
                  "line-through text-base-content/50 decoration-current"
              )}
            >
              <span
                className={clsx("mr-1 status", enabled && "status-accent")}
              />
              {name}
            </li>
          ))}
        </ul>

        <ChatListForSection
          sectionId={"sandbox" as SectionId}
          dynamicMdContent={dynamicSections}
          chatHistories={chatHistories}
          fullWidth
          className="w-full sm:w-[unset]"
        />
      </div>

      {/* 1. REPL */}
      {hasRepl && (
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
            initContent={language.sampleReplInit}
          />
        </section>
      )}

      {/* 2. エディター (既存ファイル + 追加ファイル + 追加ボタン) */}
      <section
        id="sandbox-editor"
        ref={(el) => {
          sectionRefs.current.set("sandbox-editor", el);
        }}
      >
        <Heading level={2}>コード</Heading>
        {language.sampleFiles &&
          Object.entries(language.sampleFiles).map(
            ([filename, initContent]) => (
              <EditorComponent
                key={filename}
                language={langConstants(runtimeLang)}
                filename={filename}
                initContent={initContent}
              />
            )
          )}

        {userFiles.map((filename) => (
          <EditorComponent
            key={filename}
            language={langConstants(runtimeLang)}
            filename={filename}
            initContent=""
            onDelete={() => handleRemoveFile(filename)}
          />
        ))}

        {hasAddFile && (
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

      {/* 3. 実行 */}
      <section
        id="sandbox-exec"
        ref={(el) => {
          sectionRefs.current.set("sandbox-exec", el);
        }}
      >
        <Heading level={2}>実行</Heading>
        <ExecFile
          filenames={language.sampleExec!([
            ...Object.keys(language.sampleFiles ?? {}),
            ...userFiles,
          ])}
          language={langConstants(runtimeLang)}
          content=""
        />
      </section>

      {/* 4. 出力ファイル */}
      {hasOutputFile && (
        <section
          id="sandbox-readonly"
          ref={(el) => {
            sectionRefs.current.set("sandbox-readonly", el);
          }}
        >
          <Heading level={2}>出力ファイル</Heading>
          {language.readonlyFiles &&
            language.readonlyFiles.map((filename) => (
              <EditorComponent
                key={filename}
                language={langConstants(runtimeLang)}
                filename={filename}
                initContent=""
                readonly
              />
            ))}
          {userOutputFiles.map((filename) => (
            <EditorComponent
              key={filename}
              language={langConstants(runtimeLang)}
              filename={filename}
              initContent=""
              readonly
              onDelete={() => handleRemoveOutputFile(filename)}
            />
          ))}

          {hasAddOutputFile && (
            <div className="mx-2 my-2 mt-4">
              <form
                onSubmit={handleAddOutputFile}
                className="flex items-center gap-2"
              >
                出力を表示するファイルを追加:
                <input
                  type="text"
                  className="input input-bordered input-sm flex-1 font-mono"
                  placeholder="追加するファイル名を入力"
                  value={newOutputFilename}
                  onChange={(e) => {
                    setNewOutputFilename(e.target.value);
                    setOutputFilenameError(null);
                  }}
                />
                <button type="submit" className="btn btn-sm btn-accent">
                  出力ファイルを追加
                </button>
              </form>
              {outputFilenameError && (
                <p className="text-error text-sm mt-1">{outputFilenameError}</p>
              )}
            </div>
          )}
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
