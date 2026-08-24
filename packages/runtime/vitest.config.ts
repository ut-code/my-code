import { defineConfig } from "vitest/config";
import path from "path";
import react from "@vitejs/plugin-react";
import { webdriverio } from "@vitest/browser-webdriverio";

// webdriverioは自動でchromeをダウンロードして起動するはずだが、もし何らかの理由でchromeが動作しない場合は、 @puppeteer/browsers を使用してchromeをダウンロードし、環境変数でバイナリのパスを指定してみる
const localChrome = process.env.CHROME_BIN;
const localChromeDriver = process.env.CHROMEDRIVER_PATH;

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
      provider: webdriverio({
        capabilities: {
          browserName: "chrome",
          "goog:chromeOptions": {
            ...(localChrome ? { binary: localChrome } : {}),
            args: [
              "--headless",
              "--no-sandbox",
              "--disable-dev-shm-usage",
              "--disable-gpu",
            ],
          },
          ...(localChromeDriver
            ? { "wdio:chromedriverOptions": { binary: localChromeDriver } }
            : {}),
        },
      }),
      instances: [{ browser: "chrome" }],
      screenshotFailures: false,
    },
  },
  optimizeDeps: {
    include: [
      "typescript",
      "@typescript/vfs",
      "pyodide",
      "@ruby/wasm-wasi",
      "@ruby/wasm-wasi/dist/browser",
      "@ruby/wasm-wasi/dist/vm",
      "object-inspect",
    ],
  },
});
