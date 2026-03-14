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

export const diff = pgTable("diff", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatId: uuid("chatId").notNull(),
  search: text("search").notNull(),
  replace: text("replace").notNull(),
  sectionId: text("sectionId").notNull(),
  targetMD5: text("targetMD5").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const chatRelations = relations(chat, ({ many, one }) => ({
  messages: many(message),
  section: one(section, {
    fields: [chat.sectionId],
    references: [section.sectionId],
  }),
  diff: many(diff),
}));

export const sectionRelations = relations(chat, ({ many }) => ({
  chat: many(chat),
  // diff: many(diff),
}));

export const messageRelations = relations(message, ({ one }) => ({
  chat: one(chat, {
    fields: [message.chatId],
    references: [chat.chatId],
  }),
}));

export const diffRelations = relations(diff, ({ one }) => ({
  // section: one(section, {
  //   fields: [diff.sectionId],
  //   references: [section.sectionId],
  // }),
  chat: one(chat, {
    fields: [diff.chatId],
    references: [chat.chatId],
  }),
}));
