---
id: javascript-this-5-call-apply
title: call と apply
level: 3
---

### call と apply

これらは関数を**即座に実行**します。第一引数に `this` としたいオブジェクトを渡します。

  * `call(thisArg, arg1, arg2, ...)`: 引数をカンマ区切りで渡す。
  * `apply(thisArg, [argsArray])`: 引数を配列として渡す。

```js-repl:1
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
