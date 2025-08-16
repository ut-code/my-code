'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

interface FormState {
  response: string;
  error: string | null;
}

const ChatSchema = z.object({
  userQuestion: z.string().min(1, { message: "メッセージを入力してください。" }),
  documentContent: z.string().min(1, { message: "コンテキストとなるドキュメントがありません。"}),
});

const genAI = new GoogleGenerativeAI(process.env.API_KEY!);

export async function askAI(params: unknown): Promise<FormState> {
  const parseResult = ChatSchema.safeParse(params);

  if (!parseResult.success) {
    return {
      response: "",
      error: parseResult.error.issues.map((e) => e.message).join(", "),
    };
  }
  
  const { userQuestion, documentContent } = parseResult.data;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const fullMessage = documentContent + "\n\n" + userQuestion;
    const result = await model.generateContent(fullMessage);
    const response = result.response;
    const text = response.text();
    return { response: text, error: null };
  } catch (error: unknown) {
    console.error("Error calling Generative AI:", error);
    if (error instanceof Error) {
      return { response: '', error: `AIへのリクエスト中にエラーが発生しました: ${error.message}` };
    }
    return { response: '', error: '予期せぬエラーが発生しました。' };
  }
}

