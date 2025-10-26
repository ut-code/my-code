import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const chat = pgTable("chat", {
  chatId: uuid("chatId").primaryKey().defaultRandom(),
  userId: text("userId").notNull(),
  docsId: text("docsId").notNull(),
  sectionId: text("sectionId").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const message = pgTable("message", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatId: uuid("chatId").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const chatRelations = relations(chat, ({ many }) => ({
  messages: many(message),
}));

export const messageRelations = relations(message, ({ one }) => ({
  chat: one(chat, {
    fields: [message.chatId],
    references: [chat.chatId],
  }),
}));
