import { getCloudflareContext } from "@opennextjs/cloudflare";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

export async function getPrismaClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cloudflareEnv: any;
  try {
    cloudflareEnv = (await getCloudflareContext({ async: true })).env;
  } catch {
    // @better-auth/cli generate を実行する際には initOpenNextCloudflareForDev がセットアップされていない環境になっている
    cloudflareEnv = {};
  }

  return new PrismaClient({ adapter: new PrismaD1(cloudflareEnv.my_code_db) });
}
