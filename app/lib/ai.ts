import { GoogleGenAI } from "@google/genai";

/**
 * AI APIからコンテンツをストリーミング生成する非同期ジェネレーター。
 * OpenRouter (環境変数が設定されている場合) または Google Gemini を使用する。
 */
export async function* generateContentStream(
  prompt: string,
  systemInstruction?: string
): AsyncGenerator<string> {
  const openRouterApiKey = process.env.OPENROUTER_API_KEY;
  const openRouterModel = process.env.OPENROUTER_MODEL;

  if (openRouterApiKey && openRouterModel) {
    const models = openRouterModel
      .split(";")
      .map((m) => m.trim())
      .filter(Boolean);

    const messages: { role: string; content: string }[] = [];
    if (systemInstruction) {
      messages.push({ role: "system", content: systemInstruction });
    }
    messages.push({ role: "user", content: prompt });

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openRouterApiKey}`,
        },
        body: JSON.stringify({ models, messages, stream: true }),
      }
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `OpenRouter APIエラー: ${response.status} ${response.statusText} - ${body}`
      );
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6);
        if (data === "[DONE]") return;
        try {
          const parsed = JSON.parse(data) as {
            choices?: { delta?: { content?: string | null } }[];
          };
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch {
          // ignore parse errors for malformed SSE lines
        }
      }
    }
    return;
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
    const stream = await ai.models.generateContentStream(params);
    for await (const chunk of stream) {
      if (chunk.text) yield chunk.text;
    }
  } catch (e: unknown) {
    if (String(e).includes("User location is not supported")) {
      const aiWithProxy = new GoogleGenAI({
        apiKey: process.env.API_KEY!,
        httpOptions: {
          baseUrl: "https://gemini-proxy.utcode.net",
        },
      });
      const stream = await aiWithProxy.models.generateContentStream(params);
      for await (const chunk of stream) {
        if (chunk.text) yield chunk.text;
      }
    } else {
      throw e;
    }
  }
}
