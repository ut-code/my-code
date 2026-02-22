---
id: typescript-combining-types-4-type-guards
title: 型ガード (Type Guards)
level: 2
---

## 型ガード (Type Guards)

Union型 (`string | number`) の変数があるとき、プログラムの中で「今は `string` なのか `number` なのか」を区別して処理を分けたい場合があります。これを**型の絞り込み（Narrowing）**と言います。

TypeScriptのコンパイラが「このブロック内ではこの変数はこの型だ」と認識できるようにするチェック処理を**型ガード**と呼びます。
