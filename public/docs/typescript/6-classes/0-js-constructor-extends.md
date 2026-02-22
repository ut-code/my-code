---
id: typescript-classes-0-js-constructor-exten
title: 'JSのクラス構文の復習: constructor, extends'
level: 2
---

## JSのクラス構文の復習: constructor, extends

まずは、基本的なJavaScriptのクラス構文をTypeScriptのファイルとして書いてみましょう。TypeScriptはJavaScriptのスーパーセット（上位互換）であるため、標準的なJSの書き方もほぼそのまま動作しますが、少しだけ「型」の意識が必要です。

```ts:basic-animal.ts
class Animal {
  // TypeScriptでは、ここでプロパティ（フィールド）を宣言するのが一般的ですが、
  // JSのようにconstructor内でthis.name = nameするだけだとエラーになることがあります。
  // (詳しくは次のセクションで解説します)
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}

class Snake extends Animal {
  constructor(name: string) {
    // 派生クラスのコンストラクタでは super() の呼び出しが必須
    super(name);
  }

  move(distanceInMeters: number = 5) {
    console.log("Slithering...");
    super.move(distanceInMeters);
  }
}

const sam = new Snake("Sammy the Python");
sam.move();
```

```ts-exec:basic-animal.ts
Slithering...
Sammy the Python moved 5m.
```
```js-readonly:basic-animal.js
```

基本構造はJSと同じですが、引数に型注釈（`: string`, `: number`）が付いている点が異なります。
