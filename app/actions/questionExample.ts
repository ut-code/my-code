"use server";

import { z } from "zod";
import { generateContent } from "./gemini";

const QuestionExampleSchema = z.object({
  lang: z.string().min(1),
  documentContent: z.string().min(1),
});

export type QuestionExampleParams = z.input<typeof QuestionExampleSchema>;

export async function getQuestionExample(
  params: QuestionExampleParams
): Promise<string[]> {
  // 質問の例を複数AIに考えさせる。
  // stringで複数返して、ChatForm側でその中から1つランダムに選ぶ
  // 呼び出し側がSWRで、エラー処理してくれるので、全部throwでいい
  // TODO: 同じドキュメントに対して2回以上生成する意味がないので、キャッシュしたいですね

  const parseResult = QuestionExampleSchema.safeParse(params);

  if (!parseResult.success) {
    throw new Error(parseResult.error.issues.map((e) => e.message).join(", "));
  }

  const { lang, documentContent } = parseResult.data;

  const prompt = `
以下の${lang}チュートリアルのドキュメントに対して、想定される初心者のユーザーからの質問の例を箇条書きで複数挙げてください。
強調などはせずテキストだけで1行ごとに1つ出力してください。

# ドキュメント
${documentContent}
`;
  const result = await generateContent(prompt);
  const text = result.text;
  if (!text) {
    throw new Error("AIからの応答が空でした");
  }
  return text.trim().split("\n");
}
