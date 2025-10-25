import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaNeon } from "@prisma/adapter-neon";
import { getCloudflareContext } from "@opennextjs/cloudflare";

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

let adapter;
if (DATABASE_URL.includes("neon")) {
  adapter = new PrismaNeon({ connectionString: DATABASE_URL });
} else {
  adapter = new PrismaPg({ connectionString: DATABASE_URL });
}
const prisma = new PrismaClient({ adapter });
export default prisma;
