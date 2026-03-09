"use server";

// import { z } from "zod";
import { generateContent } from "./gemini";
import { DynamicMarkdownSection } from "../[lang]/[pageId]/pageContent";
import { ReplCommand, ReplOutput } from "../terminal/repl";
import { addChat, ChatWithMessages } from "@/lib/chatHistory";
import { getPagesList, introSectionId, PagePath, SectionId } from "@/lib/docs";

type ChatResult =
  | {
      error: string;
    }
  | {
      error: null;
      // サーバー側でデータベースに新しく追加されたチャットデータ
      chat: ChatWithMessages;
    };

type ChatParams = {
  path: PagePath;
  userQuestion: string;
  sectionContent: DynamicMarkdownSection[];
  replOutputs: Record<string, ReplCommand[]>;
  files: Record<string, string>;
  execResults: Record<string, ReplOutput[]>;
};

export async function askAI(params: ChatParams): Promise<ChatResult> {
  // const parseResult = ChatSchema.safeParse(params);

  // if (!parseResult.success) {
  //   return {
  //     response: "",
  //     error: parseResult.error.issues.map((e) => e.message).join(", "),
  //   };
  // }

  const {
    path,
    userQuestion,
    sectionContent,
    replOutputs,
    files,
    execResults,
  } = params;

  const pagesList = await getPagesList();
  const langName = pagesList.find((lang) => lang.id === path.lang)?.name;

  const prompt: string[] = [];

  prompt.push(`あなたは${langName}言語のチュートリアルの講師をしています。`);
  prompt.push(
    `以下の${langName}チュートリアルのドキュメントの内容を正確に理解し、ユーザーからの質問に対して、初心者にも分かりやすく、丁寧な解説を提供してください。`
  );
  prompt.push(``);
  const sectionTitlesInView = sectionContent
    .filter((s) => s.inView)
    .map((s) => s.title)
    .join(", ");
  prompt.push(
    `ユーザーはドキュメント内の ${sectionTitlesInView} の付近のセクションを閲覧している際にこの質問を行っていると推測されます。`
  );
  prompt.push(
    `質問に答える際には、ユーザーが閲覧しているセクションの内容を特に考慮してください。`
  );
  prompt.push(``);
  prompt.push(`# ドキュメント`);
  prompt.push(``);
  for (const section of sectionContent) {
    prompt.push(`[セクションid: ${section.id}]`);
    prompt.push(section.rawContent.trim());
    prompt.push(``);
  }
  prompt.push(``);
  // TODO: 各セクションのドキュメントの直下にそのセクション内のターミナルの情報を加えるべきなのでは?
  if (Object.keys(replOutputs).length > 0) {
    prompt.push(
      `# ターミナルのログ（ユーザーが入力したコマンドとその実行結果）`
    );
    prompt.push(``);
    prompt.push(
      "以下はドキュメント内で実行例を示した各コードブロックの内容に加えてユーザーが追加で実行したコマンドです。"
    );
    prompt.push(
      "例えば ```python-repl:foo のコードブロックに対してユーザーが実行したログが ターミナル #foo です。"
    );
    prompt.push(``);
    for (const [replId, replCommands] of Object.entries(replOutputs)) {
      prompt.push(`## ターミナル #${replId}`);
      for (const replCmd of replCommands) {
        prompt.push(`\n- コマンド: ${replCmd.command}`);
        prompt.push("```");
        for (const output of replCmd.output) {
          prompt.push(output.message);
        }
        prompt.push("```");
      }
      prompt.push(``);
    }
  }

  if (Object.keys(files).length > 0) {
    prompt.push("# ファイルエディターの内容");
    prompt.push(``);
    prompt.push(
      "以下はドキュメント内でファイルの内容を示した各コードブロックの内容に加えてユーザーが編集を加えたものです。"
    );
    prompt.push(
      "例えば ```python:foo.py のコードブロックに対してユーザーが編集した後の内容が ファイル: foo.py です。"
    );
    prompt.push(``);
    for (const [filename, content] of Object.entries(files)) {
      prompt.push(`## ファイル: ${filename}`);
      prompt.push("```");
      prompt.push(content);
      prompt.push("```");
      prompt.push(``);
    }
  }

  if (Object.keys(execResults).length > 0) {
    prompt.push("# ファイルの実行結果");
    prompt.push(``);
    for (const [filename, outputs] of Object.entries(execResults)) {
      prompt.push(`## ファイル: ${filename}`);
      prompt.push("```");
      for (const output of outputs) {
        prompt.push(output.message);
      }
      prompt.push("```");
      prompt.push(``);
    }
  }

  prompt.push("# 指示");
  prompt.push("");
  prompt.push(
    `- 1行目に、ユーザーの質問ともっとも関連性の高いドキュメント内のセクションのidを回答してください。idのみを出力してください。`
  );
  prompt.push(
    "  - ユーザーの質問がドキュメントのどのセクションとも直接的に関連しない場合は空白でも良いです。"
  );
  prompt.push("- 2行目は水平線 --- を出力してください。");
  prompt.push(
    "- それ以降の行に、ドキュメントの内容に基づいて、ユーザーに伝える回答をMarkdown形式で記述してください。"
  );
  prompt.push(
    "  - ユーザーが入力したターミナルのコマンドやファイルの内容、実行結果を参考にして回答してください。"
  );
  prompt.push("  - 必要であれば、具体的なコード例を提示してください。");
  prompt.push(
    "  - 回答内でコードブロックを使用する際は ```言語名 としてください。" +
      "ドキュメント内では ```言語名-repl や ```言語名:ファイル名 、 ```言語名-exec:ファイル名 などが登場しますが、ユーザーへの回答ではこれらの記法は使用しないでください。"
  );
  prompt.push(
    "  - 水平線(---)はシステムが区切りとして認識するので、ユーザーへの回答中に水平線を使用することはできません。"
  );
  console.log(prompt);

  try {
    const result = await generateContent(userQuestion, prompt.join("\n"));
    const text = result.text;
    if (!text) {
      throw new Error("AIからの応答が空でした");
    }
    let targetSectionId = text.split(/-{3,}/)[0].trim() as SectionId;
    if (!targetSectionId) {
      targetSectionId = introSectionId(path);
    }
    const responseMessage = text.split(/-{3,}/)[1].trim();
    const newChat = await addChat(path, targetSectionId, [
      { role: "user", content: userQuestion },
      { role: "ai", content: responseMessage },
    ]);
    return {
      error: null,
      chat: newChat,
    };
  } catch (error: unknown) {
    console.error("Error calling Generative AI:", error);
    return {
      error: String(error),
    };
  }
}
