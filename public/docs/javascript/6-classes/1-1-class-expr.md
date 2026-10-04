---
id: javascript-classes-class-expr
title: クラス式
level: 3
question:
  - クラスを式として定義するメリットは何ですか？
  - 「あまり頻繁には使われませんが」とありますが、どのような場合に使うべきなのでしょうか？
term:
  - クラス式
---

### クラス式

[[関数]]と同様に、[[クラス]]も式（[[クラス式]]）として[[変数]]に代入できます（あまり頻繁には使われませんが、知識として持っておくと良いでしょう）。

```js-repl
> const Item = class {
...   constructor(price) {
...     this.price = price;
...   }
... };
undefined
> new Item(100).price
100
```
