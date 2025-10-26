import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { anonymous } from "better-auth/plugins";
import db from "./db";
import { migrateChatUser } from "./chatHistory";
import * as schema from "../../db/schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cloudflareEnv: any;
try {
  cloudflareEnv = getCloudflareContext().env;
} catch {
  // @better-auth/cli generate を実行する際には initOpenNextCloudflareForDev がセットアップされていない環境になっている
  cloudflareEnv = {};
}
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [
    anonymous({
      onLinkAccount: ({ anonymousUser, newUser }) =>
        migrateChatUser(anonymousUser.user.id, newUser.user.id),
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
