ALTER TABLE "chat" ADD COLUMN "replOutputs" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "chat" ADD COLUMN "files" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "chat" ADD COLUMN "execResults" jsonb DEFAULT '{}'::jsonb NOT NULL;