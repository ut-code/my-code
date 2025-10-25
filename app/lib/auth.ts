import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../generated/prisma/client";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { anonymous } from "better-auth/plugins";

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cloudflareEnv: any;
try {
  cloudflareEnv = getCloudflareContext().env;
} catch {
  // @better-auth/cli generate を実行する際には initOpenNextCloudflareForDev がセットアップされていない環境になっている
  cloudflareEnv = {};
}
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    anonymous({
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        // TODO
      },
    }),
  ],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? cloudflareEnv.GITHUB_CLIENT_ID,
      clientSecret:
        process.env.GITHUB_CLIENT_SECRET ?? cloudflareEnv.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? cloudflareEnv.GOOGLE_CLIENT_ID,
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ?? cloudflareEnv.GOOGLE_CLIENT_SECRET,
    },
  },
});
