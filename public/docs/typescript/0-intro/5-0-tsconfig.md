---
id: typescript-intro-tsconfig
title: "tsconfig.json: コンパイラの設定"
level: 2
question: []
---

## tsconfig.json: コンパイラの設定

毎回 `npx tsc hello.ts` のようにファイル名を指定するのは手間ですし、プロジェクト全体の設定も管理しづらくなります。そこで、`tsconfig.json` という設定ファイルを使用します。

`tsconfig.json` ファイルがない場合は以下のコマンドで初期設定ファイルを生成します。

```bash
npx tsc --init
```

生成された `tsconfig.json` には、TypeScriptコンパイラの動作を制御する様々な設定が含まれています。

特に重要なのは `strict` オプションです。
`strict: true` を有効にすると、TypeScriptの厳密な型チェックが有効になります。これにより、コードの品質が向上し、潜在的なバグを早期に発見できます。逆に、`strict` を無効にすると、型安全性が低下し、型関連のエラーが見逃される可能性があります。

それ以外のオプションはプロジェクトの要件に応じて適宜設定してください。

> **Note:** my.code();のサイト上の実行環境で使用されている設定は、以下の通りです。
>
> ```json
> {
>   "compilerOptions": {
>     "target": "ES2023",
>     "lib": ["ESNext", "WebWorker"],
>     "strict": true
>   }
> }
> ```
