'use server';

import { z } from "zod";
import { generateContent } from "./gemini";

interface FormState {
  response: string;
  error: string | null;
}

const ChatSchema = z.object({
  userQuestion: z.string().min(1, { message: "メッセージを入力してください。" }),
  documentContent: z.string().min(1, { message: "コンテキストとなるドキュメントがありません。"}),
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
  
  const { userQuestion, documentContent } = parseResult.data;

  try {
    
    const prompt = `
以下のPythonチュートリアルのドキュメントの内容を正確に理解し、ユーザーからの質問に対して、初心者にも分かりやすく、丁寧な解説を提供してください。

# ドキュメント
${documentContent}

# ユーザーからの質問
${userQuestion}

# 指示
- 回答はMarkdown形式で記述し、コードブロックを適切に使用してください。
- ドキュメントの内容に基づいて回答してください。
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
      return { response: '', error: `AIへのリクエスト中にエラーが発生しました: ${error.message}` };
    }
    return { response: '', error: '予期せぬエラーが発生しました。' };
  }
}