---
id: javascript-basics-2-var
title: var の危険性 (関数スコープと巻き上げ)
level: 3
---

### var の危険性 (関数スコープと巻き上げ)

なぜ `var` を使うべきではないのでしょうか。それは `var` が**関数スコープ**であり、意図しない変数の共有や「巻き上げ（Hoisting）」によるバグを引き起こしやすいからです。

以下のコードで、スコープの違いを確認してみましょう。

```js:scope_demo.js
function checkScope() {
    if (true) {
        var functionScoped = "I am visible outside this block";
        let blockScoped = "I am NOT visible outside this block";
        const constantValue = "I am also block scoped";
    }

    console.log("var output:", functionScoped); // 参照可能（関数スコープのため）

    try {
        console.log("let output:", blockScoped); // ReferenceError
    } catch (e) {
        console.error("let error:", e.message);
    }
}

checkScope();
```

```js-exec:scope_demo.js
var output: I am visible outside this block
let error: blockScoped is not defined
```
