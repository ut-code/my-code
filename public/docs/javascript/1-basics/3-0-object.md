---
id: javascript-basics-object
title: 'データ型: オブジェクト型'
level: 2
question:
  - オブジェクト（参照型）とプリミティブ型は、メモリ上で具体的にどのように違うのですか？
  - JavaScriptでは関数もオブジェクトとありますが、これはどういうメリットがありますか？
  - キーと値のペアの集合、というのは具体的にどんなものですか？
---

## データ型: オブジェクト型

プリミティブ以外のすべての値は**オブジェクト（参照型）**です。これらはメモリ上のアドレス（参照）として扱われます。

主なオブジェクト型には以下があります。

  * **Object**: キーと値のペアの集合（辞書、ハッシュマップに近い）。詳しくは5章で解説します。
  * **Array**: 順序付きリスト。詳しくは7章で解説します。
  * **Function**: JavaScriptでは関数もオブジェクトであり、変数に代入したり引数として渡すことができます（第一級関数）。

```js-repl
> // Object: キーと値のペアの集合
> const user = { name: "Alice", age: 25 };
undefined
> user.name
'Alice'
> user["age"]
25
> // Array: 順序付きリスト（インデックスは 0 から始まる）
> const colors = ["Red", "Green", "Blue"];
undefined
> colors[0]
'Red'
> colors.length
3
```
