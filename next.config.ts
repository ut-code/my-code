import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import { PyodidePlugin } from "@pyodide/webpack-plugin";
import { version as pyodideVersion } from "pyodide/package.json";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  experimental: {
    useCache: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
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
  webpack: (config, { isServer }) => {
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
};

export default nextConfig;
