import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql", // 'mysql' | 'sqlite' | 'turso'
  schema: "./app/schema",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});
