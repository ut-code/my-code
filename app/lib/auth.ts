import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { anonymous } from "better-auth/plugins";
import { migrateChatUser } from "./chatHistory";
import { PrismaClient } from "@prisma/client";

export async function getAuthServer(prisma: PrismaClient) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cloudflareEnv: any;
  try {
    cloudflareEnv = getCloudflareContext().env;
  } catch {
    // @better-auth/cli generate を実行する際には initOpenNextCloudflareForDev がセットアップされていない環境になっている
    cloudflareEnv = {};
  }
  return betterAuth({
    database: prismaAdapter(prisma, {
      provider: "sqlite",
    }),
    plugins: [
      anonymous({
        onLinkAccount: ({ anonymousUser, newUser }) =>
          migrateChatUser(anonymousUser.user.id, newUser.user.id),
      }),
    ],
    socialProviders: {
      github: {
        clientId:
          process.env.GITHUB_CLIENT_ID ?? cloudflareEnv.GITHUB_CLIENT_ID,
        clientSecret:
          process.env.GITHUB_CLIENT_SECRET ??
          cloudflareEnv.GITHUB_CLIENT_SECRET,
      },
      google: {
        clientId:
          process.env.GOOGLE_CLIENT_ID ?? cloudflareEnv.GOOGLE_CLIENT_ID,
        clientSecret:
          process.env.GOOGLE_CLIENT_SECRET ??
          cloudflareEnv.GOOGLE_CLIENT_SECRET,
      },
    },
  });
}
