"use server";

import OpenAI from "openai";

export async function generateContent(
  prompt: string,
  systemInstruction?: string
): Promise<{ text: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL;

  if (!apiKey || !model) {
    throw new Error(
      "OPENROUTER_API_KEY and OPENROUTER_MODEL environment variables must be set"
    );
  }

  const client = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
  if (systemInstruction) {
    messages.push({ role: "system", content: systemInstruction });
  }
  messages.push({ role: "user", content: prompt });

  const completion = await client.chat.completions.create({ model, messages });

  const text = completion.choices[0]?.message?.content;
  if (!text) {
    throw new Error("OpenRouterからの応答が空でした");
  }
  return { text };
}
