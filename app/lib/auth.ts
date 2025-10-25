import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma/client";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId:
        process.env.GITHUB_CLIENT_ID ??
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (getCloudflareContext().env as any).GITHUB_CLIENT_ID,
      clientSecret:
        process.env.GITHUB_CLIENT_SECRET ??
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (getCloudflareContext().env as any).GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId:
        process.env.GOOGLE_CLIENT_ID ??
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (getCloudflareContext().env as any).GOOGLE_CLIENT_ID,
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ??
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (getCloudflareContext().env as any).GOOGLE_CLIENT_SECRET,
    },
  },
});
