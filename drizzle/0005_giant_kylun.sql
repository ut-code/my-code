ALTER TABLE "chat" ADD COLUMN "title" text DEFAULT 'new chat' NOT NULL;

-- ↓↓↓ ここからカスタム移行スクリプトを追記 ↓↓↓

-- createdAtが最も古いメッセージを取得し、そのcontentでchatのtitleを更新する
UPDATE "chat"
SET "title" = sub."content"
FROM (
  SELECT 
    "chatId", 
    "content",
    "role",
    ROW_NUMBER() OVER (PARTITION BY "chatId", "role" ORDER BY "createdAt" ASC) as rn
  FROM "message"
) sub
WHERE "chat"."chatId" = sub."chatId" AND sub."role" = 'user' AND sub."rn" = 1;

-- ↑↑↑ ここまで ↑↑↑
