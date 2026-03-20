---
id: javascript-promise-callback-hell
title: コールバック地獄の問題点
level: 2
question:
  - コールバック地獄は、なぜ可読性が低いと言われるのですか？
  - エラーハンドリングが困難とは、具体的にどのような問題が発生するのでしょうか？
  - Promiseがコールバック地獄の問題をどのように解決するのか、簡潔に教えてください。
  - delay関数を3回入れ子にしていますが、このネストが深くなることのデメリットは何ですか？
---

## コールバック地獄の問題点

Promiseが登場する以前（ES5時代まで）は、非同期処理の順序制御を行うために、コールバック関数を入れ子にする手法が一般的でした。

例えば、「処理Aが終わったら処理B、その後に処理C...」というコードを書こうとすると、以下のようにネストが深くなります。

```js:callback_hell.js
function delay(ms, callback) {
    setTimeout(callback, ms);
}

console.log('Start');

delay(1000, () => {
    console.log('Step 1 finished');
    
    delay(1000, () => {
        console.log('Step 2 finished');
        
        delay(1000, () => {
            console.log('Step 3 finished');
            console.log('End');
        });
    });
});
```

```js-exec:callback_hell.js
Start
Step 1 finished
Step 2 finished
Step 3 finished
End
```

これはいわゆる **「コールバック地獄 (Callback Hell)」** と呼ばれる状態で、可読性が低く、エラーハンドリングも困難です。これを解決するために導入されたのが **Promise** です。
