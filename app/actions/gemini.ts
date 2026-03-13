"use server";

import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

export async function generateContent(
  prompt: string,
  systemInstruction?: string
): Promise<{ text: string }> {
  const openRouterApiKey = process.env.OPENROUTER_API_KEY;
  const openRouterModel = process.env.OPENROUTER_MODEL;

  if (openRouterApiKey && openRouterModel) {
    const client = new OpenAI({
      apiKey: openRouterApiKey,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    if (systemInstruction) {
      messages.push({ role: "system", content: systemInstruction });
    }
    messages.push({ role: "user", content: prompt });

    const completion = await client.chat.completions.create({
      model: openRouterModel,
      messages,
    });

    const text = completion.choices[0]?.message?.content;
    if (!text) {
      throw new Error("OpenRouterからの応答が空でした");
    }
    return { text };
  }

  const params = {
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction,
    },
  };

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

  try {
    const result = await ai.models.generateContent(params);
    const text = result.text;
    if (!text) {
      throw new Error("Geminiからの応答が空でした");
    }
    return { text };
  } catch (e: unknown) {
    if (String(e).includes("User location is not supported")) {
      // For the new API, we can use httpOptions to set a custom baseUrl
      const aiWithProxy = new GoogleGenAI({
        apiKey: process.env.API_KEY!,
        httpOptions: {
          baseUrl: "https://gemini-proxy.utcode.net",
        },
      });
      const result = await aiWithProxy.models.generateContent(params);
      const text = result.text;
      if (!text) {
        throw new Error("Geminiからの応答が空でした");
      }
      return { text };
    } else {
      throw e;
    }
  }
}
