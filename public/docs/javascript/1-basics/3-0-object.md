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

  * **Object**: キーと値のペアの集合（辞書、ハッシュマップに近い）。
  * **Array**: 順序付きリスト。
  * **Function**: JavaScriptでは関数もオブジェクトであり、変数に代入したり引数として渡すことができます（第一級関数）。

```js-repl
> const user = { name: "Alice", age: 25 };  // Object
undefined
> user.name
'Alice'
> user["age"]
25
> const colors = ["Red", "Green", "Blue"];  // Array
undefined
> colors[0]
'Red'
> colors.length
3
```

Object と Array の詳しい操作方法については、それぞれ **第5章（オブジェクトとプロトタイプ）** および **第7章（配列）** で解説します。
