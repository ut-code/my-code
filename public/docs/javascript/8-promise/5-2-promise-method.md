---
id: javascript-promise-method
title: .then(), .catch(), .finally()
level: 3
question:
  - '`.then()`, `.catch()`, `.finally()`は、それぞれどのような状況で使うのが適切ですか？'
  - '`.then()`の中で新しいPromiseを返すと、なぜ「フラットな連鎖」になるのですか？具体例で説明してほしいです。'
  - チェーンの途中で発生したエラーが、最後の`.catch()`で捕捉されるのはなぜですか？
  - Promiseのエラー処理は`try-catch`とどのように違うのですか？
term:
  - then
  - .then()
  - .then
  - catch
  - .catch()
  - .catch
  - finally
  - .finally()
  - .finally
  - Promiseチェーン
---

### `.then()`, `.catch()`, `.finally()`

[[Promise]][[オブジェクト]]の結果を受け取るには、以下の[[メソッド]]を使用します。

  * **`[[then|.then]](onFulfilled)`**: [[Promise]]が[[Fulfilled]]になった時に実行されます。
  * **`[[catch|.catch]](onRejected)`**: [[Promise]]が[[Rejected]]になった時に実行されます。
  * **`[[finally|.finally]](onFinally)`**: 成功・失敗に関わらず、処理終了時に実行されます。

先ほどの[[コールバック地獄]]の例を、[[Promise]]を使って書き直してみましょう。

```js:promise_chain.js
// Promiseを返す関数を作成
function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Waited ${ms}ms`);
        }, ms);
    });
}

console.log('Start');

delay(1000)
    .then((message) => {
        console.log('Step 1:', message);
        // 次のPromiseを返すことでチェーンをつなぐ
        return delay(1000);
    })
    .then((message) => {
        console.log('Step 2:', message);
        return delay(1000);
    })
    .then((message) => {
        console.log('Step 3:', message);
        console.log('End');
    })
    .catch((error) => {
        // チェーンのどこかでエラーが起きればここに飛ぶ
        console.error('Error:', error);
    });
```

```js-exec:promise_chain.js
Start
Step 1: Waited 1000ms
Step 2: Waited 1000ms
Step 3: Waited 1000ms
End
```

**重要なポイント:**

1.  `[[.then]]()` の中で新しい [[Promise]] を返すと、次の `[[.then]]()` はその新しい [[Promise]] の完了を待ちます。これにより、[[非同期処理]]を **フラットな連鎖**（[[Promiseチェーン]]）として記述できます。
2.  エラー処理は最後の `[[.catch]]()` に集約できます。`[[try]]...[[catch]]` ブロックに近い感覚で扱えるようになります。
