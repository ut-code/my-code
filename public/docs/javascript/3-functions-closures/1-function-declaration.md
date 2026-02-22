---
id: javascript-functions-closures-1-function-declaration
title: 1. 関数宣言 (Function Declaration)
level: 3
---

### 1\. 関数宣言 (Function Declaration)

古くからある定義方法です。スクリプトの実行前に読み込まれるため、定義する前の行から呼び出すことができます。

```js:function_declaration.js
console.log(greet("Alice")); // 定義前でも呼び出せる

function greet(name) {
   return `Hello, ${name}!`;
}
```

```js-exec:function_declaration.js
Hello, Alice!
```
