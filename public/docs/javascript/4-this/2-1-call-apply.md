---
id: javascript-this-call-apply
title: call と apply
level: 3
question:
  - '`call`と`apply`の第一引数に渡す`thisArg`には、どのような値を指定するのですか？'
  - '`call`と`apply`は、どちらを優先して使うべきですか？'
---

### call と apply

これらは関数を**即座に実行**します。第一引数に `this` としたいオブジェクトを渡します。

  * `call(thisArg, arg1, arg2, ...)`: 引数をカンマ区切りで渡す。
  * `apply(thisArg, [argsArray])`: 引数を配列として渡す。

```js-repl
> function greet(greeting, punctuation) { return `${greeting}, ${this.name}${punctuation}`; }
undefined
> const user = { name: "Bob" };
undefined
> // callの使用例
> greet.call(user, "Hello", "!");
'Hello, Bob!'
> // applyの使用例
> greet.apply(user, ["Hi", "?"]);
'Hi, Bob?'
```
