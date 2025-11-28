# 第1章: TypeScriptへようこそ

JavaScriptの経験がある皆さん、TypeScriptの世界へようこそ。
この章では、TypeScriptがどのような言語であるか、なぜ現代のWeb開発のスタンダードとなっているのかを理解し、実際に開発環境を整えて最初のコードを実行するところまでを学びます。

## TypeScriptとは？

TypeScriptは、Microsoftによって開発されているオープンソースのプログラミング言語です。一言で言えば、**「型（Type）を持ったJavaScript」**です。

重要な特徴は以下の通りです：

  * **JavaScriptのスーパーセット（上位互換）:** すべての有効なJavaScriptコードは、有効なTypeScriptコードでもあります。つまり、今日から既存のJS知識をそのまま活かせます。
  * **静的型付け:** JavaScriptは実行時に変数の型が決まる「動的型付け言語」ですが、TypeScriptはコンパイル時（コードを書いている途中やビルド時）に型をチェックする「静的型付け言語」としての性質を持ちます。
  * **コンパイル（トランスパイル）:** ブラウザやNode.jsはTypeScriptを直接理解できません。TypeScriptコンパイラ（`tsc`）を使って、標準的なJavaScriptファイルに変換してから実行します。

## なぜTypeScriptか？

「わざわざ型を書くのは面倒だ」と感じるかもしれません。しかし、中〜大規模な開発においてTypeScriptは以下の強力なメリットを提供します。

1.  **型安全性（バグの早期発見）:**
    `undefined` のプロパティを読み取ろうとしたり、数値を期待する関数に文字列を渡したりするミスを、コードを実行する前にエディタ上で警告してくれます。
2.  **強力なエディタサポート:**
    VS Codeなどのエディタでは、型情報に基づいた正確なコード補完（IntelliSense）が効きます。APIの仕様をドキュメントで調べなくても、ドット`.`を打つだけで利用可能なメソッドが表示されます。
3.  **リファクタリングの容易さ:**
    変数名や関数名を変更する際、型情報があるおかげで、影響範囲を自動的に特定し、安全に一括置換できます。

## 環境構築

それでは、実際にTypeScriptを動かす環境を作りましょう。

### プロジェクトの作成とTypeScriptのインストール

今回はローカル環境にTypeScriptをインストールする方法を採用します。適当なディレクトリを作成し、ターミナルで以下のコマンドを実行してください。

※あらかじめ [Node.js](https://nodejs.org/) がインストールされていることを前提とします。

```bash
# プロジェクトフォルダの作成と移動
mkdir ts-tutorial
cd ts-tutorial

# package.jsonの初期化
npm init -y

# TypeScriptのインストール（開発用依存関係として）
npm install --save-dev typescript
```

インストールが完了したら、バージョンを確認してみましょう。

```bash
npx tsc --version
# Output: Version 5.x.x (バージョンは時期によります)
```

## 最初のTypeScript

いよいよ最初のTypeScriptコードを書いてみましょう。

### コードの記述

エディタで `hello.ts` というファイルを作成し、以下のコードを記述します。
JavaScriptと似ていますが、変数宣言の後ろに `: string` という「型注釈（Type Annotation）」が付いている点に注目してください。

```ts:hello.ts
// 変数messageにstring型（文字列）を指定
const message: string = "Hello, TypeScript World!";

// 数値を渡そうとするとエディタ上でエラーになります（後ほど解説）
console.log(message);
```

### コンパイルと実行

このままではNode.jsで実行できないため、JavaScriptにコンパイルします。

```bash
npx tsc hello.ts
```

エラーが出なければ、同じフォルダに `hello.js` というファイルが生成されています。中身を確認すると、型注釈が取り除かれた普通のJavaScriptになっているはずです。

生成されたJSファイルをNode.jsで実行します。

```ts-exec:hello.ts
Hello, TypeScript World!
```

これがTypeScript開発の基本的なサイクル（記述 → コンパイル → 実行）です。

このウェブサイトでは上のようにコードを編集して実行ボタンを押すとコンパイルと実行を行うことができる環境を埋め込んでいます。

またコンパイル後のjsファイルの内容も以下のように確認できます。

```js-readonly:hello.js
"use strict";
// 変数messageにstring型（文字列）を指定
const message = "Hello, TypeScript World!";
// 数値を渡そうとするとエディタ上でエラーになります（後ほど解説）
console.log(message);
```

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

### 設定ファイルを使ったコンパイル

`tsconfig.json` があるディレクトリでは、ファイル名を指定せずに以下のコマンドだけで、ディレクトリ内のすべてのTypeScriptファイルが設定に基づいてコンパイルされます。

```bash
npx tsc
```

> **Note:** `strict: true` はTypeScriptの恩恵を最大限に受けるために非常に重要です。このチュートリアルでは常にこの設定が有効であることを前提に進めます。
