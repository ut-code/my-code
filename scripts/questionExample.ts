import {
  getMarkdownSections,
  getPagesList,
  SectionFrontMatter,
  SectionId,
} from "@/lib/docs";
import { generateContent } from "@/lib/gemini";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import yaml from "js-yaml";
import "dotenv/config";

const langEntries = await getPagesList();

if (process.argv.length < 3) {
  console.error(
    "Geminiへの最大リクエスト数をコマンドライン引数で指定してください。"
  );
  process.exit(1);
}
const geminiMaxRequest = Number(process.argv[2]);
let requestCount = 0;

for (const lang of langEntries) {
  for (const page of lang.pages) {
    const sections = await getMarkdownSections(lang.id, page.slug);
    if (sections.slice(1).some((s) => s.question === undefined)) {
      const prompt: string[] = [];
      prompt.push(
        `以下の${lang.name}チュートリアルのドキュメントに対して、想定される初心者のユーザーからの質問の例を箇条書きで複数挙げてください。`
      );
      prompt.push(
        `それぞれのセクションidに対していくつかの質問を出力してください。`
      );
      prompt.push(`1行ごとに1つずつ、`);
      prompt.push(`section-id: 質問文`);
      prompt.push(`の形式で出力してください。`);
      prompt.push(
        `質問文には強調やコードなどのmarkdownの書式は使用せず、テキストのみを出力してください。`
      );
      prompt.push(``);
      prompt.push(`# ドキュメント`);
      prompt.push(``);
      for (const section of sections.slice(1)) {
        // introを除く。
        prompt.push(`[セクションid: ${section.id}]`);
        prompt.push(section.rawContent.trim());
        prompt.push(``);
      }
      console.log(prompt);

      let text: string | undefined;
      while (true) {
        if (requestCount >= geminiMaxRequest) {
          console.log(
            `Geminiへのリクエスト数が${geminiMaxRequest}に達したため、処理を終了します。`
          );
          process.exit(1);
        }
        requestCount++;

        try {
          const result = await generateContent(prompt.join("\n"));
          text = result.text;
          if (text) {
            break;
          } else {
            console.error("AIからの応答が空でした");
            await new Promise((resolve) => setTimeout(resolve, 30000));
            continue;
          }
        } catch (e) {
          console.error(`Geminiへのリクエスト中にエラーが発生しました: ${e}`);
          await new Promise((resolve) => setTimeout(resolve, 30000));
          continue;
        }
      }
      console.log(text);

      for (const section of sections) {
        section.question = [];
      }
      for (const q of text.split("\n")) {
        if (q.trim() === "") continue;
        const match = q.trim().match(/^([\w-]+):\s*(.+)$/);
        if (match) {
          const id = match[1] as SectionId;
          const question = match[2];
          const section = sections.find((s) => s.id === id);
          if (section) {
            section.question!.push(question);
          } else {
            console.warn(
              `セクションid ${id} に対応するセクションが見つかりませんでした`
            );
          }
        } else {
          console.warn(`質問の形式が正しくありません: ${q}`);
        }
      }

      for (const section of sections.slice(1)) {
        // introを除く。frontmatterがないので
        const raw = await readFile(
          join(
            process.cwd(),
            "public",
            "docs",
            lang.id,
            page.slug,
            section.file
          ),
          "utf-8"
        );
        if (!raw.startsWith("---\n")) {
          throw new Error(`File ${section.file} is missing frontmatter`);
        }
        const endIdx = raw.indexOf("\n---\n", 4);
        if (endIdx === -1) {
          throw new Error(`File ${section.file} has invalid frontmatter`);
        }
        const body = raw.slice(endIdx + 5);
        const newRaw =
          `---\n` +
          yaml.dump({
            id: section.id,
            title: section.title,
            level: section.level,
            question: section.question,
          } satisfies SectionFrontMatter) +
          `---\n` +
          body;
        await writeFile(
          join(
            process.cwd(),
            "public",
            "docs",
            lang.id,
            page.slug,
            section.file
          ),
          newRaw,
          "utf-8"
        );
      }
    }
  }
}
