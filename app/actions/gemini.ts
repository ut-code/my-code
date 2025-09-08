"use server";

import { GoogleGenerativeAI, ModelParams } from "@google/generative-ai";

export async function generateContent(prompt: string) {
  const params: ModelParams = {
    model: "gemini-1.5-flash",
  };

  const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
  try {
    const model = genAI.getGenerativeModel(params);
    return await model.generateContent(prompt);
  } catch (e: unknown) {
    if (String(e).includes("User location is not supported")) {
      const model = genAI.getGenerativeModel(params, {
        baseUrl: "https://gemini-proxy.utcode.net",
      });
      return await model.generateContent(prompt);
    } else {
      throw e;
    }
  }
}
