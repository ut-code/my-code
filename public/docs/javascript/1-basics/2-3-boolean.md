---
id: javascript-basics-boolean
title: 真偽値（Boolean）
level: 3
question:
  - Boolean型はどんな場面で使いますか？
  - 論理演算子 `&&` と `||` と `!` の基本を教えてください。
  - '`true` / `false` は文字列の `"true"` / `"false"` と何が違いますか？'
---

### 真偽値（Boolean）

真偽値は `true` と `false` の2つの値を持ちます。条件分岐や判定処理で使う基本的な型です。

論理演算子には、AND（`&&`）、OR（`||`）、NOT（`!`）があります。

```js-repl
> const isActive = true;
undefined
> const hasPermission = false;
undefined
> typeof isActive
'boolean'
> // AND: 両方 true なら true
> isActive && hasPermission
false
> // OR: どちらかが true なら true
> isActive || hasPermission
true
> // NOT: true/false を反転
> !isActive
false
```
