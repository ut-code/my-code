---
id: javascript-basics-number
title: 数値（Number）
level: 3
question:
  - JavaScriptで整数と小数を区別しないのは、どういう意味ですか？
  - 除算や剰余など、基本的な計算はどのように書けば良いですか？
  - 小数計算で誤差が出ることがあるのはなぜですか？
---

### 数値（Number）

JavaScriptの数値は `Number` 型で表され、**整数と小数を区別しません**。どちらも同じ `number` として扱われます。

四則演算は直感的に行えます。べき乗は `**`、剰余は `%` を使います。

```js-repl
> const a = 10;     // 整数
undefined
> const b = 3.14;   // 小数
undefined
> typeof a
'number'
> typeof b
'number'
> 10 + 3
13
> 10 / 3
3.3333333333333335
> 10 % 3
1
> 2 ** 4
16
> 0.1 + 0.2
0.30000000000000004
```

`0.1 + 0.2` のような小数計算で誤差が出るのは、JavaScriptが数値を内部的に2進数の浮動小数点として扱うためです。
