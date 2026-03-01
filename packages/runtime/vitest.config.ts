import { defineConfig } from "vitest/config";
import path from "path";
import react from "@vitejs/plugin-react";
import { webdriverio } from "@vitest/browser-webdriverio";

export default defineConfig({
  resolve: {
    alias: {
      "@my-code/js-eval": path.resolve(__dirname, "../jsEval/src"),
    },
  },
  plugins: [
    react({
      // Allow JSX in .ts files
      include: /\.(ts|tsx)$/,
    }),
  ],
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  test: {
    globals: true,
    include: ["tests/vitest-all.tsx"],
    browser: {
      enabled: true,
      provider: webdriverio(),
      instances: [{ browser: "chrome" }],
    },
  },
  optimizeDeps: {
    include: [
      "typescript",
      "@typescript/vfs",
      "pyodide",
      "@ruby/wasm-wasi",
      "object-inspect",
    ],
  },
});
