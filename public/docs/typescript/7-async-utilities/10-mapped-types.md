---
id: typescript-async-utilities-10-mapped-types
title: Mapped Types (マップ型)
level: 3
---

### Mapped Types (マップ型)

既存の型のプロパティをループ処理して、新しい型を作る機能です。配列の `.map()` の型バージョンと考えると分かりやすいでしょう。

```ts
type Item = { a: string; b: number };

// 既存のItemのキー(P)をすべて boolean 型に変換する
type BooleanItem = {
  [P in keyof Item]: boolean;
};
// 結果: { a: boolean; b: boolean; } と等価
```
