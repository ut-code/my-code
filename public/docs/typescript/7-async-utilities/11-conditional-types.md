---
id: typescript-async-utilities-11-conditional-types
title: Conditional Types (条件付き型)
level: 3
---

### Conditional Types (条件付き型)

型の三項演算子のようなものです。「もし型Tが型Uを継承しているならX型、そうでなければY型」という条件分岐を定義できます。

```ts
// Tがstringなら number[] を、それ以外なら T[] を返す型
type StringArrayOrGeneric<T> = T extends string ? number[] : T[];

type A = StringArrayOrGeneric<string>; // number[] になる
type B = StringArrayOrGeneric<boolean>; // boolean[] になる
```
