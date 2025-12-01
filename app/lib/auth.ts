import { betterAuth } from "better-auth/minimal";
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
    experimental: {
      joins: true,
    },
    onAPIError: {
      customizeDefaultErrorPage: {
        colors: {
          background: "oklch(98% 0.01 61.15)", // base-100
          foreground: "oklch(21% 0.006 61.15)", // base-content
          primary: "oklch(60% 0.139 61.15)",
          primaryForeground: "oklch(98% 0.02 61.15)",
          mutedForeground: "oklch(21% 0.006 61.15 / 70%)", // base-content/70
          border: "oklch(21% 0.006 61.15 / 20%)", // base-content/20
          destructive: "oklch(64% 0.246 16.439)", // error (どこで使われているのだろう?)
          titleBorder: "oklch(60% 0.139 61.15)", // primary
          titleColor: "oklch(21% 0.006 61.15)", // base-content
          gridColor: "", // unused
          cardBackground: "oklch(95% 0.013 61.15)", // base-200
          cornerBorder: "oklch(60% 0.139 61.15)", // primary
        },
        font: {
          defaultFamily:
            "'Rounded M+ 1c', 'Rounded M+ 1p', 'M PLUS Rounded 1c', 'M+ 1c', 'MigMix 1c', 'Migu 1c', 'Hiragino Maru Gothic ProN', 'Noto Sans', 'Arial', 'Liberation Sans', sans-serif",
          monoFamily: "Inconsolata, monospace",
        },
        disableTitleBorder: true,
        disableCornerDecorations: true,
        disableBackgroundGrid: true,
      },
    },
  });
}

// @better-auth/cli を実行するときだけ以下のコメントアウトを解除
// export const auth = await getAuthServer(await getDrizzle());
