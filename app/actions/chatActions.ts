'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

interface FormState {
  response: string;
  error: string | null;
}

const genAI = new GoogleGenerativeAI(process.env.API_KEY!);

export async function askAI(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const message = formData.get('message');

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return { response: '', error: 'メッセージを入力してください。' };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
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

