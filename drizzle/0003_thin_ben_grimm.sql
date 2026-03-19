CREATE TABLE "section" (
	"sectionId" text PRIMARY KEY NOT NULL,
	"pagePath" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat" DROP COLUMN "docsId";