import { generateContentStream } from "@/lib/ai";
import {
  addChat,
  addMessagesAndDiffs,
  Context,
  CreateChatDiff,
} from "@/lib/chatHistory";
import {
  DynamicMarkdownSection,
  getPagesListForLang,
  introSectionId,
  PagePath,
  SectionId,
} from "@/lib/docs";
import {
  ReplCommand,
  ReplOutput,
} from "@my-code/runtime/interface";

export interface GenerateSingleChatParams {
  path: PagePath;
  userQuestion: string;
  sectionContent: DynamicMarkdownSection[];
  replOutputs: Record<string, ReplCommand[]>;
  files: Record<string, string>;
  execResults: Record<string, ReplOutput[]>;
  context: Context;
  onChunk?: (text: string) => void;
  onChatCreated?: (chatId: string, sectionId: SectionId) => void;
}

export interface GenerateSingleChatResult {
  chatId: string;
  sectionId: SectionId;
  title: string;
  diffRaw: CreateChatDiff[];
  cleanMessage: string;
}

export async function generateSingleChat(
  params: GenerateSingleChatParams
): Promise<GenerateSingleChatResult> {
  const {
    path,
    userQuestion,
    sectionContent,
    replOutputs,
    files,
    execResults,
    context,
    onChunk,
    onChatCreated,
  } = params;

  const langEntry = await getPagesListForLang(path.lang);
  const langName = langEntry?.name ?? path.lang;
  const targetPath = path;
  const targetSectionContent = sectionContent;

  const prompt: string[] = [];
  prompt.push(`あなたは${langName}言語のチュートリアルの講師をしています。`);
  prompt.push(
    `以下の${langName}チュートリアルのドキュメントの内容を正確に理解し、ユーザーからの質問に対して、初心者にも分かりやすく、丁寧な解説を提供してください。`
  );
  prompt.push(``);
  const sectionTitlesInView = targetSectionContent
    .filter((s) => s.inView)
    .map((s) => s.title);
  if (sectionTitlesInView.length > 0) {
    prompt.push(
      `ユーザーはドキュメント内の ${sectionTitlesInView.join(", ")} の付近のセクションを閲覧している際にこの質問を行っていると推測されます。`
    );
    prompt.push(
      `質問に答える際には、ユーザーが閲覧しているセクションの内容を特に考慮してください。`
    );
  }
  prompt.push(``);
  prompt.push(
    `質問への回答はユーザー向けのメッセージに加えて、ドキュメント自体を改訂するという形でも可能です。`
  );
  prompt.push(
    `質問内容とドキュメントの内容の関連性が深く、比較的長めの解説をしたい場合、またはドキュメントへの補足がしたい場合は、そちらの形式での回答を検討してください。`
  );
  prompt.push(``);
  prompt.push(`# ドキュメント`);
  prompt.push(``);
  for (const section of targetSectionContent) {
    prompt.push(`[セクションid: ${section.id}]`);
    prompt.push(section.replacedContent.trim());
    prompt.push(``);
  }
  prompt.push(``);
  if (Object.keys(replOutputs).length > 0) {
    prompt.push(
      `# ターミナルのログ（ユーザーが入力したコマンドとその実行結果）`
    );
    prompt.push(``);
    prompt.push(
      "以下はドキュメント内で実行例を示した各コードブロックの内容に加えてユーザーが追加で実行したコマンドです。"
    );
    prompt.push(
      "例えば ```python-repl:foo のコードブロックに対してユーザーが実行したログが ターミナル #foo です。"
    );
    prompt.push(``);
    for (const [replId, replCommands] of Object.entries(replOutputs)) {
      prompt.push(`## ターミナル #${replId}`);
      for (const replCmd of replCommands) {
        prompt.push(`\n- コマンド: ${replCmd.command}`);
        prompt.push("```");
        for (const output of replCmd.output) {
          prompt.push(output.message);
        }
        prompt.push("```");
      }
      prompt.push(``);
    }
  }

  if (Object.keys(files).length > 0) {
    prompt.push("# ファイルエディターの内容");
    prompt.push(``);
    prompt.push(
      "以下はドキュメント内でファイルの内容を示した各コードブロックの内容に加えてユーザーが編集を加えたものです。"
    );
    prompt.push(
      "例えば ```python:foo.py のコードブロックに対してユーザーが編集した後の内容が ファイル: foo.py です。"
    );
    prompt.push(``);
    for (const [filename, content] of Object.entries(files)) {
      prompt.push(`## ファイル: ${filename}`);
      prompt.push("```");
      prompt.push(content);
      prompt.push("```");
      prompt.push(``);
    }
  }

  if (Object.keys(execResults).length > 0) {
    prompt.push("# ファイルの実行結果");
    prompt.push(``);
    for (const [filename, outputs] of Object.entries(execResults)) {
      prompt.push(`## ファイル: ${filename}`);
      prompt.push("```");
      for (const output of outputs) {
        prompt.push(output.message);
      }
      prompt.push("```");
      prompt.push(``);
    }
  }

  prompt.push("# 指示");
  prompt.push("");
  prompt.push(
    `- 1行目に、ユーザーの質問ともっとも関連性の高いドキュメント内のセクションのidを回答してください。`
  );
  prompt.push(
    "  - idのみを出力してください。 セクションid: や括弧や引用符などは不要です。"
  );
  prompt.push(
    "  - ユーザーの質問がドキュメントのどのセクションとも直接的に関連しない場合は null と出力してください。"
  );
  prompt.push(
    "- 2行目に、この質問と回答を後から参照するためのわかりやすいタイトルをつけて記述してください。"
  );
  prompt.push(
    "  - 太字やコードブロックなどのMarkdownの記法は使わずテキストのみで出力してください。"
  );
  prompt.push(
    "- 3行目以降に、ドキュメントの内容に基づいて、ユーザーに伝える回答をMarkdown形式で記述してください。"
  );
  prompt.push(
    "  - ユーザーが入力したターミナルのコマンドやファイルの内容、実行結果を参考にして回答してください。"
  );
  prompt.push("  - 必要であれば、具体的なコード例を提示してください。");
  prompt.push(
    "  - 回答内でコードブロックを使用する際は ```言語名 としてください。" +
      "ドキュメント内では ```言語名-repl や ```言語名:ファイル名 、 ```言語名-exec:ファイル名 などの特殊なコードブロックが登場しますが、ユーザーへの回答ではこれらの記法は使用しないでください。"
  );
  prompt.push("- ドキュメントの一部を改訂したい場合はその差分を");
  prompt.push("<<<<<<< SEARCH");
  prompt.push("修正したい元の文章の塊（一字一句違わずに）");
  prompt.push("=======");
  prompt.push("修正後の新しい文章の塊");
  prompt.push(">>>>>>> REPLACE");
  prompt.push("の形式で出力してください。");
  prompt.push(
    "  - 複数箇所改訂したい場合は上の形式の出力を複数回繰り返してください。"
  );
  prompt.push(
    "  - ドキュメントにテキストを追加したい場合は追加したい箇所の前後のテキストを含めて出力してください。"
  );
  prompt.push(
    "  - セクションid、セクション見出しを編集、追加、削除することはできません。"
  );
  prompt.push(
    "  - ドキュメント内の特殊なコードブロック(```言語名-repl , ```言語名:ファイル名 , ```言語名-exec:ファイル名 )は編集、追加、削除することはできません。それ以外の文章のみを編集してください。" +
      "ただし通常のコードブロック(```言語名 )の追加は可能です。"
  );
  prompt.push(
    "  - 改訂後のドキュメントと同じ内容はユーザーに伝える回答としては省略できます。(「修正後のドキュメントを参照してください。」など)"
  );

  let fullText = "";
  let headerParsed = false;
  let chatId: string | undefined;
  let targetSectionId: SectionId | undefined;
  let title: string | undefined;
  let contentAfterHeader = "";

  for await (const chunk of generateContentStream(
    userQuestion,
    prompt.join("\n")
  )) {
    fullText += chunk;

    if (!headerParsed) {
      const headerMatch = fullText.match(/^([^\n]+?)\n+([^\n]+?)\n+/);
      if (headerMatch) {
        headerParsed = true;
        let secId = headerMatch[1].trim() as SectionId;
        title = headerMatch[2].trim();

        if (
          !secId ||
          !targetSectionContent.some((s) => s.id === secId)
        ) {
          secId = introSectionId(targetPath);
        }
        targetSectionId = secId;

        if (!title) {
          throw new Error("AIからの応答にタイトルが含まれていませんでした");
        }

        const newChat = await addChat(
          targetPath,
          targetSectionId,
          title,
          [{ role: "user", content: userQuestion }],
          [],
          context
        );
        chatId = newChat.chatId;

        onChatCreated?.(chatId, targetSectionId);

        contentAfterHeader = fullText.slice(headerMatch[0].length);
        if (contentAfterHeader && onChunk) {
          onChunk(contentAfterHeader);
        }
      }
    } else {
      contentAfterHeader += chunk;
      if (onChunk) {
        onChunk(chunk);
      }
    }
  }

  if (!chatId || !targetSectionId || !title) {
    throw new Error("AIからの応答の形式が正しくありませんでした");
  }

  const diffRegex =
    /<{3,}\s*SEARCH\n*([\s\S]*?)\n*={3,}\n*([\s\S]*?)\n*>{3,}\s*REPLACE/g;
  const diffRaw: CreateChatDiff[] = [];
  for (const m of contentAfterHeader.matchAll(diffRegex)) {
    const search = m[1];
    const replace = m[2];
    const targetSection = targetSectionContent.find((s) =>
      s.replacedContent.includes(search)
    );
    diffRaw.push({
      search,
      replace,
      sectionId: targetSection?.id ?? ("" as SectionId),
      targetMD5: targetSection?.md5 ?? "",
    });
  }
  const cleanMessage = contentAfterHeader.replace(diffRegex, "").trim();

  await addMessagesAndDiffs(
    chatId,
    targetPath,
    [{ role: "ai", content: cleanMessage }],
    diffRaw,
    context
  );

  return {
    chatId,
    sectionId: targetSectionId,
    title,
    diffRaw,
    cleanMessage,
  };
}
