import { describe, it, mock } from "node:test";
import assert from "node:assert";
import {
  applyChatDiff,
  applySingleDiffToSection,
  cacheKeyForChat,
  cacheKeyForPage,
  ChatWithMessages,
} from "../app/lib/chatHistory";
import { MarkdownSection, SectionWithDiff } from "../app/lib/docs";

describe("chatHistory lib (non-DB functions)", () => {
  describe("cacheKeyForPage", () => {
    it("should generate correct cache key for page and userId", () => {
      const key = cacheKeyForPage(
        { lang: "javascript" as never, page: "0-intro" as never },
        "user-123"
      );
      assert.strictEqual(
        key,
        "https://my-code.utcode.net/chatHistory/getChat?path=javascript/0-intro&userId=user-123"
      );
    });
  });

  describe("cacheKeyForChat", () => {
    it("should generate correct cache key for chatId", () => {
      const key = cacheKeyForChat("chat-uuid-456");
      assert.strictEqual(
        key,
        "https://my-code.utcode.net/chatHistory/getChatOne?chatId=chat-uuid-456"
      );
    });
  });

  describe("applySingleDiffToSection", () => {
    it("should replace content and add replacedRange when search string is found", () => {
      const section: SectionWithDiff = {
        file: "javascript/0-intro/1-test.md",
        id: "sec-1" as never,
        title: "Test Section",
        level: 1,
        question: [],
        term: [],
        rawContent: "Hello World!",
        replacedContent: "Hello World!",
        replacedRange: [],
        md5: "hash-1",
      };

      const result = applySingleDiffToSection(section, {
        search: "World",
        replace: "TypeScript",
        chatId: "chat-1",
      });

      assert.strictEqual(result, true);
      assert.strictEqual(section.replacedContent, "Hello TypeScript!");
      assert.deepStrictEqual(section.replacedRange, [
        {
          start: 6,
          end: 16,
          id: "chat-1",
        },
      ]);
    });

    it("should return false and keep content unchanged when search string is not found", () => {
      const section: SectionWithDiff = {
        file: "javascript/0-intro/1-test.md",
        id: "sec-1" as never,
        title: "Test Section",
        level: 1,
        question: [],
        term: [],
        rawContent: "Hello World!",
        replacedContent: "Hello World!",
        replacedRange: [],
        md5: "hash-1",
      };

      const result = applySingleDiffToSection(section, {
        search: "Python",
        replace: "Ruby",
        chatId: "chat-2",
      });

      assert.strictEqual(result, false);
      assert.strictEqual(section.replacedContent, "Hello World!");
      assert.deepStrictEqual(section.replacedRange, []);
    });

    it("should shift existing ranges when a replacement occurs before them", () => {
      const section: SectionWithDiff = {
        file: "test.md",
        id: "sec-1" as never,
        title: "Test",
        level: 1,
        question: [],
        term: [],
        rawContent: "Hello World!",
        replacedContent: "Hello World!",
        replacedRange: [
          { start: 6, end: 11, id: "chat-1" }, // "World"
        ],
        md5: "hash-1",
      };

      // Replace "Hello" (len 5) with "Greetings," (len 10) -> diffLen = +5
      const result = applySingleDiffToSection(section, {
        search: "Hello",
        replace: "Greetings,",
        chatId: "chat-2",
      });

      assert.strictEqual(result, true);
      assert.strictEqual(section.replacedContent, "Greetings, World!");
      // The original range (start: 6, end: 11) should be shifted by +5 to (start: 11, end: 16)
      assert.deepStrictEqual(section.replacedRange, [
        { start: 11, end: 16, id: "chat-1" },
        { start: 0, end: 10, id: "chat-2" },
      ]);
    });
  });

  describe("applyChatDiff", () => {
    it("should apply diffs when section.md5 matches diff.targetMD5", async () => {
      const sections: MarkdownSection[] = [
        {
          file: "test.md",
          id: "sec-1" as never,
          title: "Section 1",
          level: 1,
          question: [],
          term: [],
          rawContent: "Original content for section 1",
          md5: "md5-v1",
        },
      ];

      const chatHistories: ChatWithMessages[] = [
        {
          chatId: "chat-1",
          userId: "user-1",
          sectionId: "sec-1" as never,
          createdAt: new Date("2026-01-01T00:00:00Z"),
          title: "chat 1",
          section: { sectionId: "sec-1" as never, pagePath: "js/page1" },
          messages: [],
          replOutputs: {},
          files: {},
          execResults: {},
          diff: [
            {
              id: "diff-1",
              chatId: "chat-1",
              sectionId: "sec-1" as never,
              search: "Original",
              replace: "Updated",
              targetMD5: "md5-v1",
              createdAt: new Date("2026-01-01T00:00:00Z"),
            },
          ],
        },
      ];

      const result = await applyChatDiff(sections, chatHistories);
      assert.strictEqual(result[0].replacedContent, "Updated content for section 1");
      assert.strictEqual(result[0].isOutdated, false);
      assert.deepStrictEqual(result[0].outdatedDiffsToUpdate, []);
    });

    it("should sort diffs by createdAt and apply them chronologically", async () => {
      const sections: MarkdownSection[] = [
        {
          file: "test.md",
          id: "sec-1" as never,
          title: "Section 1",
          level: 1,
          question: [],
          term: [],
          rawContent: "Step 0",
          md5: "md5-v1",
        },
      ];

      // Pass chatHistories in reverse order to ensure sorting works
      const chatHistories: ChatWithMessages[] = [
        {
          chatId: "chat-2",
          userId: "user-1",
          sectionId: "sec-1" as never,
          createdAt: new Date("2026-01-02T00:00:00Z"),
          title: "chat 2",
          section: { sectionId: "sec-1" as never, pagePath: "js/page1" },
          messages: [],
          replOutputs: {},
          files: {},
          execResults: {},
          diff: [
            {
              id: "diff-2",
              chatId: "chat-2",
              sectionId: "sec-1" as never,
              search: "Step 1",
              replace: "Step 2",
              targetMD5: "md5-v1",
              createdAt: new Date("2026-01-02T00:00:00Z"),
            },
          ],
        },
        {
          chatId: "chat-1",
          userId: "user-1",
          sectionId: "sec-1" as never,
          createdAt: new Date("2026-01-01T00:00:00Z"),
          title: "chat 1",
          section: { sectionId: "sec-1" as never, pagePath: "js/page1" },
          messages: [],
          replOutputs: {},
          files: {},
          execResults: {},
          diff: [
            {
              id: "diff-1",
              chatId: "chat-1",
              sectionId: "sec-1" as never,
              search: "Step 0",
              replace: "Step 1",
              targetMD5: "md5-v1",
              createdAt: new Date("2026-01-01T00:00:00Z"),
            },
          ],
        },
      ];

      const result = await applyChatDiff(sections, chatHistories);
      assert.strictEqual(result[0].replacedContent, "Step 2");
    });

    it("should queue outdatedDiffsToUpdate when diff succeeds on current version but targetMD5 differs", async () => {
      const sections: MarkdownSection[] = [
        {
          file: "test.md",
          id: "sec-1" as never,
          title: "Section 1",
          level: 1,
          question: [],
          term: [],
          rawContent: "Searchable Content",
          md5: "md5-v2", // Current section MD5 is v2
        },
      ];

      const chatHistories: ChatWithMessages[] = [
        {
          chatId: "chat-1",
          userId: "user-1",
          sectionId: "sec-1" as never,
          createdAt: new Date("2026-01-01T00:00:00Z"),
          title: "chat 1",
          section: { sectionId: "sec-1" as never, pagePath: "js/page1" },
          messages: [],
          replOutputs: {},
          files: {},
          execResults: {},
          diff: [
            {
              id: "diff-1",
              chatId: "chat-1",
              sectionId: "sec-1" as never,
              search: "Searchable",
              replace: "Modified",
              targetMD5: "md5-v1", // Diff targetMD5 was v1
              createdAt: new Date("2026-01-01T00:00:00Z"),
            },
          ],
        },
      ];

      const result = await applyChatDiff(sections, chatHistories);
      assert.strictEqual(result[0].replacedContent, "Modified Content");
      assert.strictEqual(result[0].isOutdated, false);
      assert.deepStrictEqual(result[0].outdatedDiffsToUpdate, [
        {
          chatId: "chat-1",
          diffId: "diff-1",
          targetMD5: "md5-v2",
        },
      ]);
    });

    it("should not perform fallback when section.md5 === targetMD5 and diff fails", async () => {
      const sections: MarkdownSection[] = [
        {
          file: "test.md",
          id: "sec-1" as never,
          title: "Section 1",
          level: 1,
          question: [],
          term: [],
          rawContent: "Actual Content",
          md5: "md5-v1",
        },
      ];

      const chatHistories: ChatWithMessages[] = [
        {
          chatId: "chat-1",
          userId: "user-1",
          sectionId: "sec-1" as never,
          createdAt: new Date("2026-01-01T00:00:00Z"),
          title: "chat 1",
          section: { sectionId: "sec-1" as never, pagePath: "js/page1" },
          messages: [],
          replOutputs: {},
          files: {},
          execResults: {},
          diff: [
            {
              id: "diff-1",
              chatId: "chat-1",
              sectionId: "sec-1" as never,
              search: "NonexistentString",
              replace: "Replacement",
              targetMD5: "md5-v1", // targetMD5 is same as section.md5
              createdAt: new Date("2026-01-01T00:00:00Z"),
            },
          ],
        },
      ];

      const result = await applyChatDiff(sections, chatHistories);
      assert.strictEqual(result[0].replacedContent, "Actual Content");
      assert.strictEqual(result[0].isOutdated, false);
      assert.deepStrictEqual(result[0].outdatedDiffsToUpdate, []);
    });

    it("should not perform fallback when fallbackToPastVersion is set to false", async () => {
      const sections: MarkdownSection[] = [
        {
          file: "test.md",
          id: "sec-1" as never,
          title: "Section 1",
          level: 1,
          question: [],
          term: [],
          rawContent: "New Content Version 2",
          md5: "md5-v2",
        },
      ];

      const chatHistories: ChatWithMessages[] = [
        {
          chatId: "chat-1",
          userId: "user-1",
          sectionId: "sec-1" as never,
          createdAt: new Date("2026-01-01T00:00:00Z"),
          title: "chat 1",
          section: { sectionId: "sec-1" as never, pagePath: "js/page1" },
          messages: [],
          replOutputs: {},
          files: {},
          execResults: {},
          diff: [
            {
              id: "diff-1",
              chatId: "chat-1",
              sectionId: "sec-1" as never,
              search: "Old Content Version 1",
              replace: "Diff Applied",
              targetMD5: "md5-v1", // targetMD5 differs
              createdAt: new Date("2026-01-01T00:00:00Z"),
            },
          ],
        },
      ];

      const result = await applyChatDiff(sections, chatHistories, {
        fallbackToPastVersion: false,
      });

      assert.strictEqual(result[0].replacedContent, "New Content Version 2");
      assert.strictEqual(result[0].isOutdated, false);
    });

    it("should fallback to past version when diff fails and targetMD5 differs", async () => {
      const sectionId = "cpp-0-intro-intro" as never;
      const pastMD5 = "/mArytsD75On3j08VnPJ6g==";

      const sections: MarkdownSection[] = [
        {
          file: "public/docs/cpp/0-intro/-intro.md",
          id: sectionId,
          title: "C++ Intro",
          level: 1,
          question: [],
          term: [],
          rawContent: "New Content Version 2",
          md5: "md5-v2-different",
        },
      ];

      const chatHistories: ChatWithMessages[] = [
        {
          chatId: "chat-1",
          userId: "user-1",
          sectionId,
          createdAt: new Date("2026-01-01T00:00:00Z"),
          title: "chat 1",
          section: { sectionId, pagePath: "cpp/0-intro" },
          messages: [],
          replOutputs: {},
          files: {},
          execResults: {},
          diff: [
            {
              id: "diff-1",
              chatId: "chat-1",
              sectionId,
              search: "Old Content Version 1",
              replace: "Past Version Applied",
              targetMD5: pastMD5,
              createdAt: new Date("2026-01-01T00:00:00Z"),
            },
          ],
        },
      ];

      // Mock fetch for getRevisionOfMarkdownSection
      const originalFetch = globalThis.fetch;
      mock.method(globalThis, "fetch", async (url: string | URL | Request) => {
        const urlStr = url.toString();
        if (urlStr.includes("raw.githubusercontent.com")) {
          const rawPastContent = `---
id: cpp-0-intro-intro
title: C++ Intro
---
Old Content Version 1`;
          return new Response(rawPastContent, { status: 200 });
        }
        return originalFetch(url);
      });

      try {
        const result = await applyChatDiff(sections, chatHistories, {
          fallbackToPastVersion: true,
        });

        assert.strictEqual(result[0].isOutdated, true);
        assert.strictEqual(result[0].replacedContent, "Past Version Applied");
        assert.deepStrictEqual(result[0].replacedRange, [
          { start: 0, end: 20, id: "chat-1" },
        ]);
      } finally {
        mock.restoreAll();
      }
    });
  });
});
