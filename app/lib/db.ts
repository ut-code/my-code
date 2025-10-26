import { drizzle as drizzleNeon, NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { neon } from "@neondatabase/serverless";
import postgres from "postgres";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "../../db/schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cloudflareEnv: any;
try {
  cloudflareEnv = getCloudflareContext().env;
} catch {
  // @better-auth/cli generate を実行する際には initOpenNextCloudflareForDev がセットアップされていない環境になっている
  cloudflareEnv = {};
}
const DATABASE_URL =
  process.env.DATABASE_URL ?? cloudflareEnv.DATABASE_URL ?? "";

let db: NeonHttpDatabase<typeof schema> | PostgresJsDatabase<typeof schema>;
if (DATABASE_URL.includes("neon")) {
  const sql = neon(DATABASE_URL);
  db = drizzleNeon(sql, { schema });
} else {
  const client = postgres(DATABASE_URL);
  db = drizzlePg(client, { schema });
}

export default db;
