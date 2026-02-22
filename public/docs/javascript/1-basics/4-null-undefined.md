---
id: javascript-basics-4-null-undefined
title: null と undefined の違い
level: 3
---

### null と undefined の違い

他言語経験者にとって混乱しやすいのがこの2つです。

  * **undefined**: システム（JavaScriptエンジン）が「値がまだない」ことを示すために使うことが多い。
  * **null**: プログラマが「ここには値がない」ことを明示するために使うことが多い。

```js-repl:1
> let unassigned;
undefined
> unassigned
undefined
> let empty = null;
undefined
> typeof unassigned
'undefined'
> typeof empty // JSの有名なバグ（仕様）で 'object' が返りますが、実際はプリミティブです
'object'
```
