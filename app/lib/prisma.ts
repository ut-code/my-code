import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "../generated/prisma/client";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cloudflareEnv: any;
try {
  cloudflareEnv = getCloudflareContext().env;
} catch {
  // @better-auth/cli generate を実行する際には initOpenNextCloudflareForDev がセットアップされていない環境になっている
  cloudflareEnv = {};
}

const prisma = new PrismaClient({ adapter: new PrismaD1(cloudflareEnv.my_code_db) });
export default prisma;
