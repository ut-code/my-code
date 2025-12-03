import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
  async headers() {
    // pyodideをworkerで動作させるために必要
    return [
      {
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
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        child_process: false,
        "node:child_process": false,
        ...config.resolve.fallback,
      };
    }
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
