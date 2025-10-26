import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { anonymous } from "better-auth/plugins";
import { migrateChatUser } from "./chatHistory";
import { getDrizzle } from "./drizzle";

export async function getAuthServer(
  drizzle: Awaited<ReturnType<typeof getDrizzle>>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cloudflareEnv: any;
  try {
    cloudflareEnv = getCloudflareContext().env;
  } catch {
    // @better-auth/cli generate を実行する際には initOpenNextCloudflareForDev がセットアップされていない環境になっている
    cloudflareEnv = {};
  }
  return betterAuth({
    database: drizzleAdapter(drizzle, {
      provider: "pg",
    }),
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },
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

// @better-auth/cli を実行するときだけ以下のコメントアウトを解除
// export const auth = await getAuthServer(await getDrizzle());
