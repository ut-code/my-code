"use server";

import { z } from "zod";
import { generateContent } from "./gemini";

interface FormState {
  response: string;
  error: string | null;
}

const ChatSchema = z.object({
  userQuestion: z
    .string()
    .min(1, { message: "メッセージを入力してください。" }),
  splitMdContent: z
    .string()
    .min(1, { message: "コンテキストとなるドキュメントがありません。" }),
  replOutputs: z
    .array(
      z.object({
        command: z.string(),
        output: z.array(
          z.object({
            type: z.enum([
              "stdout",
              "stderr",
              "error",
              "return",
              "trace",
              "system",
            ]),
            message: z.string(),
          })
        ),
      })
    )
    .optional(),
  fileContents: z
    .array(
      z.object({
        name: z.string(),
        content: z.string(),
      })
    )
    .optional(),
  execResults: z
    .record(
      z.string(),
      z.array(
        z.object({
          type: z.enum([
            "stdout",
            "stderr",
            "error",
            "return",
            "trace",
            "system",
          ]),
          message: z.string(),
        })
      )
    )
    .optional(),
});

type ChatParams = z.input<typeof ChatSchema>;

export async function askAI(params: ChatParams): Promise<FormState> {
  const parseResult = ChatSchema.safeParse(params);

  if (!parseResult.success) {
    return {
      response: "",
      error: parseResult.error.issues.map((e) => e.message).join(", "),
    };
  }

  const {
    userQuestion,
    documentContent,
    replOutputs,
    fileContents,
    execResults,
  } = parseResult.data;

  try {
    // ターミナルログの文字列を構築
    let terminalLogsSection = "";
    if (replOutputs && replOutputs.length > 0) {
      terminalLogsSection =
        "\n# ターミナルのログ（ユーザーが入力したコマンドとその実行結果）\n";
      for (const replCmd of replOutputs) {
        terminalLogsSection += `\n## コマンド: ${replCmd.command}\n`;
        terminalLogsSection += "```\n";
        for (const output of replCmd.output) {
          terminalLogsSection += `${output.message}\n`;
        }
        terminalLogsSection += "```\n";
      }
    }

    // ファイルエディターの内容を構築
    let fileContentsSection = "";
    if (fileContents && fileContents.length > 0) {
      fileContentsSection = "\n# ファイルエディターの内容\n";
      for (const file of fileContents) {
        fileContentsSection += `\n## ファイル: ${file.name}\n`;
        fileContentsSection += "```\n";
        fileContentsSection += file.content;
        fileContentsSection += "\n```\n";
      }
    }

    // ファイル実行結果を構築
    let execResultsSection = "";
    if (execResults && Object.keys(execResults).length > 0) {
      execResultsSection = "\n# ファイルの実行結果\n";
      for (const [filename, outputs] of Object.entries(execResults)) {
        execResultsSection += `\n## ファイル: ${filename}\n`;
        execResultsSection += "```\n";
        for (const output of outputs) {
          execResultsSection += `${output.message}\n`;
        }
        execResultsSection += "```\n";
      }
    }

    const prompt = `
以下のPythonチュートリアルのドキュメントの内容を正確に理解し、ユーザーからの質問に対して、初心者にも分かりやすく、丁寧な解説を提供してください。

# ドキュメント
${documentContent}
${terminalLogsSection}${fileContentsSection}${execResultsSection}
# ユーザーからの質問
${userQuestion}

# 指示
- 回答はMarkdown形式で記述し、コードブロックを適切に使用してください。
- ドキュメントの内容に基づいて回答してください。
- ユーザーが入力したターミナルのコマンドやファイルの内容、実行結果を参考にして回答してください。
- ユーザーへの回答のみを出力してください。
- 必要であれば、具体的なコード例を提示してください。
- 

`;
    const result = await generateContent(prompt);
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
