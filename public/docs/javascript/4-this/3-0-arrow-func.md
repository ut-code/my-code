---
id: javascript-this-arrow-func
title: アロー関数と this
level: 2
question:
  - レキシカルスコープとは具体的に何ですか？
  - アロー関数の`this`は、なぜ従来の関数と異なる挙動をするのですか？
  - >-
    `setTimeout`の例で、`startLegacy`がエラーになるのはなぜですか？`this.seconds`が`undefined`になる理由を詳しく知りたいです。
  - アロー関数は`call`や`bind`を無視する、というのはどういうことですか？なぜ無視されるのですか？
  - アロー関数が「動的なコンテキスト」が必要な場合には向かない、とは具体的にどういうことですか？
---

## アロー関数と `this`

ES2015 (ES6) で導入されたアロー関数は、これまで説明したルールとは全く異なる挙動をします。

アロー関数には**独自の `this` が存在しません**。アロー関数内部の `this` は、**その関数が定義されたスコープ（レキシカルスコープ）の `this`** をそのまま参照します。

これは、「コールバック関数内で `this` が変わってしまう問題」を解決するのに最適です。


`setTimeout` などのコールバック内でメソッドを使いたい場面を比較してみましょう。

```js:arrow-vs-function.js
class Timer {
    constructor() {
        this.seconds = 0;
    }

    // 従来の方法: 失敗例
    startLegacy() {
        setTimeout(function() {
            // ここでの this はグローバルまたはundefined（setTimeoutの仕様）
            // そのため this.seconds にアクセスできずNaNなどになる
            try {
                this.seconds++; 
                console.log("Legacy:", this.seconds);
            } catch (e) {
                console.log("Legacy: Error -", e.message);
            }
        }, 100);
    }

    // アロー関数: 成功例
    startModern() {
        setTimeout(() => {
            // アロー関数は定義時のスコープ（startModern内のthis = インスタンス）を捕獲する
            this.seconds++;
            console.log("Modern:", this.seconds);
        }, 100);
    }
}

const timer = new Timer();
timer.startLegacy();
timer.startModern();
```

```js-exec:arrow-vs-function.js
Legacy: Error - Cannot read properties of undefined (reading 'seconds')
Modern: 1
```

> **注意:** アロー関数は便利な反面、`this` を動的に変更することができません（`call` や `bind` を使っても無視されます）。そのため、動的なコンテキストが必要な場合（例：オブジェクトのメソッド定義そのものや、ライブラリ等で `this` を注入される場合）には通常の関数式を使います。
