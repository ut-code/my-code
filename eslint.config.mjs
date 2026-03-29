import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import reactHooks from "eslint-plugin-react-hooks";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
      "cloudflare-env.d.ts",
      "packages/runtime/node_modules/**",
      "packages/runtime/dist/**",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    plugins: { "react-hooks": reactHooks },
    rules: {
      // Next.jsのデフォルト設定を上書き
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
        },
      ],
      // react-hooks/refs と react-hooks/set-state-in-effect は Next.js 16 で追加された新しいルールで、
      // 既存のコードパターンと相性が悪いため無効化する
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
