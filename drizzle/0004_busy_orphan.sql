CREATE TABLE "diff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chatId" uuid NOT NULL,
	"search" text NOT NULL,
	"replace" text NOT NULL,
	"sectionId" text NOT NULL,
	"targetMD5" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
