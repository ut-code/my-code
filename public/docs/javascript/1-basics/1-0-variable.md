---
id: javascript-basics-variable
title: '変数宣言: let, const, var'
level: 2
question:
  - letとconstは、具体的にどう使い分ければ良いですか？
  - ブロックスコープとは、どの範囲まで変数を使えるということですか？
  - varを使うべきではないとありますが、varを使うとどのような悪いことが起こるのですか？
  - 巻き上げ（Hoisting）とは、具体的にどのような現象ですか？
  - '`console.log("let output:", blockScoped);` がReferenceErrorになるのはなぜですか？'
---

## 変数宣言: let, const, var

現代のJavaScript開発において、変数宣言のルールは非常にシンプルです。
**「基本は `const`、再代入が必要な場合のみ `let` を使い、`var` は決して使わない」** これが鉄則です。

ES6（2015年）で導入された `const` と `let` は、C++やJava、C\#などと同様に**ブロックスコープ**を持ちます。

  * **const**: 再代入不可能な変数を宣言します。定数だけでなく、再代入しない変数はすべてこれで宣言します。
  * **let**: 再代入可能な変数を宣言します。ループカウンタや、状態が変わる値に使用します。


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
