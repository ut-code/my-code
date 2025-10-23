"use server";

import { z } from "zod";
import { generateContent } from "./gemini";
import { DynamicMarkdownSection } from "../[docs_id]/pageContent";
import { ReplCommand, ReplOutput } from "../terminal/repl";

interface FormState {
  response: string;
  error: string | null;
}

type ChatParams = {
  userQuestion: string;
  documentContent: string;
  sectionContent: DynamicMarkdownSection[];
  replOutputs: Record<string, ReplCommand[]>;
  files: Record<string, string>;
  execResults: Record<string, ReplOutput[]>;
};

export async function askAI(params: ChatParams): Promise<FormState> {
  // const parseResult = ChatSchema.safeParse(params);

  // if (!parseResult.success) {
  //   return {
  //     response: "",
  //     error: parseResult.error.issues.map((e) => e.message).join(", "),
  //   };
  // }

  const {
    userQuestion,
    documentContent,
    sectionContent,
    replOutputs,
    files,
    execResults,
  } = params;

  const prompt: string[] = [];

  prompt.push(
    `以下のPythonチュートリアルのドキュメントの内容を正確に理解し、ユーザーからの質問に対して、初心者にも分かりやすく、丁寧な解説を提供してください。`
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
  prompt.push(documentContent);
  prompt.push(``);
  if (Object.keys(replOutputs).length > 0) {
    prompt.push(
      `# ターミナルのログ（ユーザーが入力したコマンドとその実行結果）`
    );
    prompt.push(``);
    prompt.push(
      "以下はドキュメント内で実行例を示した各コードブロックの内容に加えてユーザーが追加で実行したコマンドです。"
    );
    prompt.push(
      "例えば ```python-repl:1 のコードブロックに対してユーザーが実行したログが ターミナル #1 です。"
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

  prompt.push("# ユーザーからの質問");
  prompt.push(userQuestion);
  prompt.push(``);

  prompt.push("# 指示");
  prompt.push(
    "- 回答はMarkdown形式で記述し、コードブロックを適切に使用してください。"
  );
  prompt.push("- ドキュメントの内容に基づいて回答してください。");
  prompt.push(
    "- ユーザーが入力したターミナルのコマンドやファイルの内容、実行結果を参考にして回答してください。"
  );
  prompt.push("- ユーザーへの回答のみを出力してください。");
  prompt.push("- 必要であれば、具体的なコード例を提示してください。");
  console.log(prompt);

  try {
    const result = await generateContent(prompt.join("\n"));
    const text = result.text;
    if (!text) {
      throw new Error("AIからの応答が空でした");
    }
    return { response: text, error: null };
  } catch (error: unknown) {
    console.error("Error calling Generative AI:", error);
    if (error instanceof Error) {
      return {
        response: "",
        error: `AIへのリクエスト中にエラーが発生しました: ${error.message}`,
      };
    }
    return { response: "", error: "予期せぬエラーが発生しました。" };
  }
}
