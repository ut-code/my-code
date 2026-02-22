---
id: javascript-arrays-1-repl
title: 基本操作 (REPL)
level: 3
---

### 基本操作 (REPL)

```js-repl:1
> const fruits = ['Apple', 'Banana'];
undefined
> // 末尾に追加 (push)
> fruits.push('Orange');
3
> fruits
[ 'Apple', 'Banana', 'Orange' ]

> // 末尾から削除 (pop)
> const last = fruits.pop();
undefined
> last
'Orange'

> // 先頭に追加 (unshift)
> fruits.unshift('Grape');
3
> fruits
[ 'Grape', 'Apple', 'Banana' ]

> // インデックスによるアクセス
> fruits[1]
'Apple'
```
