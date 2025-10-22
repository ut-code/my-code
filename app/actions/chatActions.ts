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
  documentContent: z.string(),
  splitMdContent: z.array(
    z.object({
      level: z.number(),
      title: z.string(),
      content: z.string(),
    })
  ),
  sectionInView: z.array(z.boolean()),
  replOutputs: z.record(
    z.string(),
    z.array(
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
  ),
  files: z.record(z.string(), z.string().optional()),
  execResults: z.record(
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
  ),
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
    splitMdContent,
    sectionInView,
    replOutputs,
    files,
    execResults,
  } = parseResult.data;

  try {
    // ターミナルログの文字列を構築
    let terminalLogsSection = "";
    terminalLogsSection =
      "\n# ターミナルのログ（ユーザーが入力したコマンドとその実行結果）\n";
    terminalLogsSection +=
      "\n以下はドキュメント内で実行例を示した各コードブロックの内容に加えてユーザーが追加で実行したコマンドです。\n";
    terminalLogsSection +=
      "例えば ```python-repl:1 のコードブロックに対してユーザーが実行したログが ターミナル #1 です。\n";
    for (const [replId, replInstance] of Object.entries(replOutputs)) {
      terminalLogsSection += `\n## ターミナル #${replId}\n`;
      for (const replCmd of replInstance) {
        terminalLogsSection += `\n- コマンド: ${replCmd.command}\n`;
        terminalLogsSection += "```\n";
        for (const output of replCmd.output) {
          terminalLogsSection += `${output.message}\n`;
        }
        terminalLogsSection += "```\n";
      }
    }

    // ファイルエディターの内容を構築
    let fileContentsSection = "";
    fileContentsSection = "\n# ファイルエディターの内容\n";
    fileContentsSection +=
      "\n以下はドキュメント内でファイルの内容を示した各コードブロックの内容に加えてユーザーが編集を加えたものです。\n";
    fileContentsSection +=
      "例えば ```python:foo.py のコードブロックに対してユーザーが編集した後の内容が ファイル: foo.py です。\n";
    for (const [filename, content] of Object.entries(files)) {
      fileContentsSection += `\n## ファイル: ${filename}\n`;
      fileContentsSection += "```\n";
      fileContentsSection += content;
      fileContentsSection += "\n```\n";
    }

    // ファイル実行結果を構築
    let execResultsSection = "";
    if (execResults) {
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

    const sectionTitlesInView = splitMdContent.filter((_, index) => sectionInView[index]).map(section => section.title).join(", ");

    const prompt = `
以下のPythonチュートリアルのドキュメントの内容を正確に理解し、ユーザーからの質問に対して、初心者にも分かりやすく、丁寧な解説を提供してください。

ユーザーはドキュメント内の ${sectionTitlesInView} の付近のセクションを閲覧している際にこの質問を行っていると推測されます。
質問に答える際には、ユーザーが閲覧しているセクションの内容を特に考慮してください。

# ドキュメント
${documentContent}

${terminalLogsSection}
${fileContentsSection}
${execResultsSection}

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
console.log(prompt)
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
