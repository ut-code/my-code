"use server";

import { GoogleGenAI } from "@google/genai";

export async function generateContent(
  prompt: string,
  systemInstruction?: string
): Promise<{ text: string }> {
  const openRouterApiKey = process.env.OPENROUTER_API_KEY;
  const openRouterModel = process.env.OPENROUTER_MODEL;

  if (openRouterApiKey && openRouterModel) {
    // Support semicolon-separated list of models for automatic fallback via
    // OpenRouter's `models` array parameter.
    const models = openRouterModel.split(";").map((m) => m.trim()).filter(Boolean);

    const messages: { role: string; content: string }[] = [];
    if (systemInstruction) {
      messages.push({ role: "system", content: systemInstruction });
    }
    messages.push({ role: "user", content: prompt });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openRouterApiKey}`,
      },
      body: JSON.stringify({ models, messages }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `OpenRouter APIエラー: ${response.status} ${response.statusText} - ${body}`
      );
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string | null } }[];
    };
    const text = data.choices?.[0]?.message?.content;
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
