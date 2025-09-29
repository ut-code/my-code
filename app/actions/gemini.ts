"use server";

import { GoogleGenAI } from "@google/genai";

export async function generateContent(prompt: string) {
  const params = {
    model: "gemini-2.5-flash",
    contents: prompt,
  };

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  
  try {
    return await ai.models.generateContent(params);
  } catch (e: unknown) {
    if (String(e).includes("User location is not supported")) {
      // For the new API, we can use httpOptions to set a custom baseUrl
      const aiWithProxy = new GoogleGenAI({ 
        apiKey: process.env.API_KEY!,
        httpOptions: {
          baseUrl: "https://gemini-proxy.utcode.net",
        },
      });
      return await aiWithProxy.models.generateContent(params);
    } else {
      throw e;
    }
  }
}
