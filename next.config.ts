import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import { PyodidePlugin } from "@pyodide/webpack-plugin";
import { version as pyodideVersion } from "pyodide/package.json";
import { dirname } from "node:path";
import { withSentryConfig } from "@sentry/nextjs";
import { withLicense } from "next-license-list/config";

initOpenNextCloudflareForDev();

let nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  experimental: {
    useCache: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    SENTRY_DSN: process.env.SENTRY_DSN,
  },
  serverExternalPackages: [
    "@prisma/client",
    ".prisma/client",
    // 普通にimportするとこれが4回バンドルされてcloudflareの3MB制限を超えてしまう
    "@sentry/nextjs",
  ],
  outputFileTracingIncludes: {
    // sentryのバージョン違うけど、serverExternalPackagesに@sentry/nextjsを追加したら
    // https://github.com/getsentry/sentry-javascript/issues/14931#issuecomment-3641871022
    // と同じエラーが出たので、そこに書かれていたのと同じでっちあげをしてみる
    "*": ["node_modules/@sentry/nextjs/build/**/*"],
  },
  async headers() {
    return [
      {
        // pyodideをworkerで動作させるために必要
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
      {
        source: "/typescript/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.plugins.push(
      new PyodidePlugin({
        // public/ 以下に書き出すと404
        // ../public/ 以下に書き出すと Uncaught SyntaxError: Invalid or unexpected token (at layout.js:1073:29) エラーになる
        // _next/static/ 以下ならとりあえずうごく
        outDirectory: `static/pyodide/v${pyodideVersion}`,
      })
    );
    // import hoge from "./file?raw" でfileの中身を文字列としてインポート
    for (const rule of config.module.rules) {
      if (rule.resourceQuery instanceof RegExp) {
        // skip
      } else if (Array.isArray(rule.resourceQuery?.not)) {
        rule.resourceQuery.not.push(/raw/);
      } else {
        if (rule.resourceQuery) {
          console.warn("resourceQuery already exists:", rule.resourceQuery);
        }
        rule.resourceQuery = { not: /raw/ };
      }
    }
    config.module.rules.push({
      resourceQuery: /raw/,
      type: "asset/source",
    });
    return config;
  },
  async redirects() {
    return [
      ["/cpp-1", "/cpp/0-intro"],
      ["/cpp-2", "/cpp/1-types-control"],
      ["/cpp-3", "/cpp/2-data-containers"],
      ["/cpp-4", "/cpp/3-pointers"],
      ["/cpp-5", "/cpp/4-functions"],
      ["/cpp-6", "/cpp/5-project-build"],
      ["/cpp-7", "/cpp/6-classes-basics"],
      ["/cpp-8", "/cpp/7-classes-advanced"],
      ["/cpp-9", "/cpp/8-inheritance"],
      ["/cpp-10", "/cpp/9-templates"],
      ["/cpp-11", "/cpp/10-stl-containers"],
      ["/cpp-12", "/cpp/11-stl-algorithms"],
      ["/cpp-13", "/cpp/12-raii-smart-ptrs"],
      ["/javascript-1", "/javascript/0-intro"],
      ["/javascript-2", "/javascript/1-basics"],
      ["/javascript-3", "/javascript/2-control"],
      ["/javascript-4", "/javascript/3-functions-closures"],
      ["/javascript-5", "/javascript/4-this"],
      ["/javascript-6", "/javascript/5-objects-prototype"],
      ["/javascript-7", "/javascript/6-classes"],
      ["/javascript-8", "/javascript/7-arrays"],
      ["/javascript-9", "/javascript/8-promise"],
      ["/javascript-10", "/javascript/9-async-await"],
      ["/python-1", "/python/0-intro"],
      ["/python-2", "/python/1-basics"],
      ["/python-3", "/python/2-collections"],
      ["/python-4", "/python/3-control-functions"],
      ["/python-5", "/python/4-modules"],
      ["/python-6", "/python/5-oop"],
      ["/python-7", "/python/6-file-io"],
      ["/python-8", "/python/7-exceptions"],
      ["/python-9", "/python/8-generators-decorators"],
      ["/ruby-1", "/ruby/0-intro"],
      ["/ruby-2", "/ruby/1-basics"],
      ["/ruby-3", "/ruby/2-control-methods"],
      ["/ruby-4", "/ruby/3-everything-object"],
      ["/ruby-5", "/ruby/4-collections"],
      ["/ruby-6", "/ruby/5-blocks-iterators"],
      ["/ruby-7", "/ruby/6-classes"],
      ["/ruby-8", "/ruby/7-modules"],
      ["/ruby-9", "/ruby/8-proc-lambda"],
      ["/ruby-10", "/ruby/9-stdlib"],
      ["/ruby-11", "/ruby/10-testing"],
      ["/ruby-12", "/ruby/11-metaprogramming"],
      ["/rust-1", "/rust/0-intro"],
      ["/rust-2", "/rust/1-basics"],
      ["/rust-3", "/rust/2-functions-control"],
      ["/rust-4", "/rust/3-ownership"],
      ["/rust-5", "/rust/4-borrowing-slices"],
      ["/rust-6", "/rust/5-structs-methods"],
      ["/rust-7", "/rust/6-enums-pattern"],
      ["/rust-8", "/rust/7-modules"],
      ["/rust-9", "/rust/8-collections-strings"],
      ["/rust-10", "/rust/9-error-handling"],
      ["/rust-11", "/rust/10-generics-traits"],
      ["/rust-12", "/rust/11-lifetimes"],
      ["/typescript-1", "/typescript/0-intro"],
      ["/typescript-2", "/typescript/1-types"],
      ["/typescript-3", "/typescript/2-objects-interfaces"],
      ["/typescript-4", "/typescript/3-function-types"],
      ["/typescript-5", "/typescript/4-combining-types"],
      ["/typescript-6", "/typescript/5-generics"],
      ["/typescript-7", "/typescript/6-classes"],
      ["/typescript-8", "/typescript/7-async-utilities"],
    ].map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

nextConfig = withLicense(nextConfig, {
  includeNoticeText: true,
  excludedPackageTest: (packageName /*, version*/) => {
    return packageName.startsWith("@my-code") || packageName === "my-code";
  },
  licenseOverrides: {
    "@better-auth/core@1.4.20": "MIT",
    "@better-fetch/fetch@1.1.21": "MIT",
  },
  includePackages: () =>
    ["tailwindcss", "daisyui", "@fontsource/m-plus-rounded-1c"].map((pkg) =>
      dirname(import.meta.resolve(`${pkg}/package.json`))
    ),
});
nextConfig = withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  sentryUrl: process.env.SENTRY_URL,
  // debug: true, // important for debugging

  // coolifyではgitがコンテキストに与えられない代わりに環境変数SOURCE_COMMITがある
  ...(process.env.SOURCE_COMMIT
    ? { release: { name: process.env.SOURCE_COMMIT } }
    : {}),

  // Use a fixed route (recommended)
  tunnelRoute: "/monitoring",
  // Pass the auth token
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Only print logs for uploading source maps in CI
  // silent: !process.env.CI,

  widenClientFileUpload: true,

  // 以下の設定を追加してサイズを削減
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
    excludeTracing: true,
    excludeReplayIframe: true,
    excludeReplayShadowDom: true,
    excludeReplayWorker: true,
  },
});

export default nextConfig;
