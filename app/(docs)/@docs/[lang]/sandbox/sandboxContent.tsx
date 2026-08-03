"use client";

import { useMemo, useState } from "react";
import { Heading } from "@/markdown/heading";
import { langConstants, RuntimeLang } from "@my-code/runtime/languages";
import { ReplTerminal } from "@/terminal/repl";
import { EditorComponent } from "@/terminal/editor";
import { ExecFile } from "@/terminal/exec";
import { DynamicMarkdownSection, PagePath } from "@/lib/docs";
import { ChatWithMessages } from "@/lib/chatHistory";
import { ChatForm } from "../[pageId]/chatForm";
import { ChatListForSection } from "../[pageId]/pageContent";

import main_py from "@/terminal/samples/main.py?raw";
import main_rb from "@/terminal/samples/main.rb?raw";
import main_js from "@/terminal/samples/main.js?raw";
import main2_ts from "@/terminal/samples/main2.ts?raw";
import main_cpp from "@/terminal/samples/main.cpp?raw";
import sub_h from "@/terminal/samples/sub.h?raw";
import sub_cpp from "@/terminal/samples/sub.cpp?raw";
import main2_rs from "@/terminal/samples/main2.rs?raw";
import sub_rs from "@/terminal/samples/sub.rs?raw";

interface SampleConfig {
  repl: boolean;
  replInitContent?: string;
  editor: Record<string, string> | false;
  exec: string[] | false;
  readonlyFiles?: string[];
}
const sampleConfig: Record<RuntimeLang, SampleConfig> = {
  python: {
    repl: true,
    replInitContent: '>>> print("Hello, World!")\nHello, World!',
    editor: { "main.py": main_py },
    exec: ["main.py"],
  },
  ruby: {
    repl: true,
    replInitContent: 'irb(main):001:0> puts "Hello, World!"\nHello, World!',
    editor: { "main.rb": main_rb },
    exec: ["main.rb"],
  },
  javascript: {
    repl: true,
    replInitContent: '> console.log("Hello, World!");\nHello, World!',
    editor: { "main.js": main_js },
    exec: ["main.js"],
  },
  typescript: {
    repl: false,
    editor: { "main2.ts": main2_ts },
    exec: ["main2.ts"],
    readonlyFiles: ["main2.js"],
  },
  cpp: {
    repl: false,
    editor: {
      "main.cpp": main_cpp,
      "sub.h": sub_h,
      "sub.cpp": sub_cpp,
    },
    exec: ["main.cpp", "sub.cpp"],
  },
  rust: {
    repl: false,
    editor: {
      "main2.rs": main2_rs,
      "sub.rs": sub_rs,
    },
    exec: ["main2.rs"],
  },
};

export function SandboxContent(props: {
  lang: RuntimeLang;
  langName: string;
  path: PagePath;
  sectionContent: DynamicMarkdownSection[];
  chatHistories: ChatWithMessages[];
}) {
  const { lang, langName, path, sectionContent, chatHistories } = props;
  const config = sampleConfig[lang];

  const [extraEditors, setExtraEditors] = useState<string[]>([]);
  const [newFilename, setNewFilename] = useState("");
  const [filenameError, setFilenameError] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  const baseFilenames = useMemo(
    () => new Set(Object.keys(config.editor || {})),
    [config.editor]
  );
  const sectionId = sectionContent[0]?.id;

  return (
    <div className="flex-1 p-4 pb-16 flex flex-col">
      <div
        className="max-w-full mx-auto grid"
        style={{ gridTemplateColumns: "1fr auto" }}
      >
        <section className="min-w-1/2 max-w-docs text-justify">
          <Heading level={1}>{langName} Sandbox</Heading>
          <p className="mb-4">
            REPLとファイル実行のサンプルを試しながら、AIに質問できます。
          </p>
          <div className="flex flex-col">
            {config.repl && (
              <ReplTerminal
                terminalId={`${lang}-sandbox`}
                language={langConstants(lang)}
                initContent={config.replInitContent}
              />
            )}
            {config.editor &&
              Object.entries(config.editor).map(([filename, initContent]) => (
                <EditorComponent
                  key={filename}
                  language={langConstants(lang)}
                  filename={filename}
                  initContent={initContent}
                />
              ))}
            {extraEditors.map((filename) => (
              <EditorComponent
                key={filename}
                language={langConstants(lang)}
                filename={filename}
                initContent=""
              />
            ))}
            <div className="my-2 p-3 rounded-box bg-base-200 flex flex-wrap items-center gap-2">
              <input
                className="input input-sm input-bordered w-56"
                placeholder="追加するファイル名"
                value={newFilename}
                onChange={(e) => {
                  setNewFilename(e.target.value);
                  setFilenameError("");
                }}
              />
              <button
                className="btn btn-sm btn-soft btn-secondary"
                onClick={() => {
                  const filename = newFilename.trim();
                  if (!filename) {
                    setFilenameError("ファイル名を入力してください");
                    return;
                  }
                  if (baseFilenames.has(filename) || extraEditors.includes(filename)) {
                    setFilenameError("そのファイル名は既に追加されています");
                    return;
                  }
                  setExtraEditors((prev) => [...prev, filename]);
                  setNewFilename("");
                }}
              >
                ファイルを追加
              </button>
              {filenameError && <span className="text-sm text-error">{filenameError}</span>}
            </div>
            {config.exec && (
              <ExecFile
                filenames={config.exec}
                language={langConstants(lang)}
                content=""
              />
            )}
            {config.readonlyFiles?.map((filename) => (
              <EditorComponent
                key={filename}
                language={langConstants(lang)}
                filename={filename}
                initContent=""
                readonly
              />
            ))}
          </div>
        </section>
        <div>
          {sectionId && (
            <ChatListForSection
              sectionId={sectionId}
              dynamicMdContent={sectionContent}
              chatHistories={chatHistories}
            />
          )}
        </div>
      </div>
      {isFormVisible ? (
        <div className="fixed bottom-4 right-4 left-4 has-sidebar:left-[calc(var(--container-sidebar)+1rem)] z-40">
          <ChatForm
            path={path}
            langName={langName}
            sectionContent={sectionContent}
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
