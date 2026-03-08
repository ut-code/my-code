import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const chat = pgTable("chat", {
  chatId: uuid("chatId").primaryKey().defaultRandom(),
  userId: text("userId").notNull(),
  sectionId: text("sectionId").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const section = pgTable("section", {
  sectionId: text("sectionId").primaryKey().notNull(),
  pagePath: text("pagePath").notNull(),
});

export const message = pgTable("message", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatId: uuid("chatId").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const chatRelations = relations(chat, ({ many, one }) => ({
  messages: many(message),
  section: one(section, {
    fields: [chat.sectionId],
    references: [section.sectionId],
  }),
}));

export const sectionRelations = relations(chat, ({ many }) => ({
  chat: many(chat),
}));

export const messageRelations = relations(message, ({ one }) => ({
  chat: one(chat, {
    fields: [message.chatId],
    references: [chat.chatId],
  }),
}));
