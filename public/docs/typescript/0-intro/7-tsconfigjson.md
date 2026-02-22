---
id: typescript-intro-7-tsconfigjson
title: 'tsconfig.json: コンパイラの設定'
level: 2
---

## tsconfig.json: コンパイラの設定

毎回 `npx tsc hello.ts` のようにファイル名を指定するのは手間ですし、プロジェクト全体の設定も管理しづらくなります。そこで、`tsconfig.json` という設定ファイルを使用します。

以下のコマンドで初期設定ファイルを生成します。

```bash
npx tsc --init
```

生成された `tsconfig.json` には多くの設定項目がありますが、基本として以下の設定が有効（コメントアウトされていない状態）になっているか確認してください。

```json
{
  "compilerOptions": {
    "target": "es2016",                                  /* コンパイル後のJSのバージョン */
    "module": "commonjs",                                /* モジュールシステム */
    "strict": true,                                      /* 厳格な型チェックを有効にする（重要） */
    "esModuleInterop": true,                             /* CommonJSモジュールとの互換性 */
    "forceConsistentCasingInFileNames": true,            /* ファイル名の大文字小文字を区別 */
    "skipLibCheck": true                                 /* 定義ファイルのチェックをスキップ */
  }
}
```
