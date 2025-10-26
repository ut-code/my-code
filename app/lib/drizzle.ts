import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as authSchema from "../schema/auth";
import * as chatSchema from "../schema/chat";

export async function getDrizzle() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cloudflareEnv: any;
  try {
    cloudflareEnv = (await getCloudflareContext({ async: true })).env;
  } catch {
    // @better-auth/cli generate を実行する際には initOpenNextCloudflareForDev がセットアップされていない環境になっている
    cloudflareEnv = {};
  }
  const DATABASE_URL =
    process.env.DATABASE_URL ?? cloudflareEnv.DATABASE_URL ?? "";

  const pool = new Pool({
    connectionString: DATABASE_URL,
    // You don't want to reuse the same connection for multiple requests
    maxUses: 1,
  });
  return drizzle({
    client: pool,
    schema: {
      ...authSchema,
      ...chatSchema,
    },
  });
}
