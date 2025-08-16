'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

interface FormState {
  response: string;
  error: string | null;
}

interface ChatParams {
  userQuestion: string;
  documentContent: string;
}

const genAI = new GoogleGenerativeAI(process.env.API_KEY!);

export async function askAI(params: ChatParams): Promise<FormState> {
  const { userQuestion, documentContent } = params;

  if (!userQuestion || userQuestion.trim() === '') {
    return { response: '', error: 'メッセージを入力してください。' };
  }

  if (!documentContent) {
    return { response: '', error: 'コンテキストとなるドキュメントがありません。' };
  }
  
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

