# 第9章: 非同期処理（1）- Promise

JavaScriptは基本的にシングルスレッドで動作します。つまり、一度に一つの処理しか実行できません。しかし、ネットワークリクエストやタイマーなどの重い処理を行っている間、ブラウザがフリーズしたりサーバーが応答しなくなったりしては困ります。

そこでJavaScriptは、重い処理をバックグラウンド（Web APIsやNode.jsのC++レイヤー）に任せ、完了通知を受け取ることで並行処理のような動きを実現しています。

本章では、JavaScriptの非同期処理の基盤となるメカニズムと、それを現代的に扱うための標準APIである **Promise** について解説します。

## 同期処理 vs 非同期処理

まず、挙動の違いを確認しましょう。

  * **同期処理 (Synchronous):** コードが上から下へ順番に実行されます。前の処理が終わるまで次の処理は待たされます（ブロッキング）。
  * **非同期処理 (Asynchronous):** 処理の完了を待たずに、即座に次のコードへ進みます（ノンブロッキング）。処理結果は後でコールバックなどを通じて受け取ります。

以下のコードは、`setTimeout`（非同期API）を使用した例です。他言語の経験者であれば、「Start」→「1秒待機」→「Timer」→「End」と予想するかもしれませんが、JavaScriptでは異なります。

```js:async_demo.js
console.log('1. Start');

// 1000ミリ秒後にコールバックを実行する非同期関数
setTimeout(() => {
    console.log('2. Timer fired');
}, 1000);

console.log('3. End');
```

```js-exec:async_demo.js
1. Start
3. End
2. Timer fired
```

`setTimeout` は「タイマーをセットする」という命令だけを出し、即座に制御を返します。そのため、タイマーの発火を待たずに `3. End` が出力されます。

## イベントループとコールバックキューの仕組み

なぜシングルスレッドで非同期処理が可能なのか、その裏側にあるのが **イベントループ (Event Loop)** という仕組みです。

JavaScriptのランタイムは主に以下の要素で構成されています：

1.  **コールスタック (Call Stack):** 現在実行中の関数が積まれる場所。LIFO（後入れ先出し）。
2.  **Web APIs / Node APIs:** ブラウザやOSが提供する機能（タイマー、Fetch、DOMイベントなど）。非同期処理はここで実行されます。
3.  **コールバックキュー (Callback Queue):** 非同期処理が完了した後、実行待ちのコールバック関数が並ぶ列。
4.  **イベントループ (Event Loop):** コールスタックとキューを監視する仕組み。

**処理の流れ:**

1.  `setTimeout` がコールスタックで実行されると、ブラウザのタイマーAPIに処理を依頼し、スタックから消えます。
2.  指定時間が経過すると、タイマーAPIはコールバック関数を **コールバックキュー** に入れます。
3.  **イベントループ** は、「コールスタックが空（メインの処理が完了）」かつ「キューにタスクがある」場合、キューからタスクを取り出してコールスタックへ移動させます。

この仕組みにより、メインスレッドをブロックすることなく非同期処理を実現しています。

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

## Promiseの概念

**Promise** は、非同期処理の「最終的な完了（または失敗）」とその「結果の値」を表すオブジェクトです。未来のある時点で値が返ってくる「約束手形」のようなものと考えてください。

Promiseオブジェクトは以下の3つの状態のいずれかを持ちます。

1.  **Pending (待機中):** 初期状態。処理はまだ完了していない。
2.  **Fulfilled (履行):** 処理が成功し、値を持っている状態。(`resolve` された)
3.  **Rejected (拒否):** 処理が失敗し、エラー理由を持っている状態。(`reject` された)

Promiseの状態は一度 Pending から Fulfilled または Rejected に変化すると、二度と変化しません（Immutable）。

## Promiseの使い方

### Promiseの作成

`new Promise` コンストラクタを使用します。引数には `(resolve, reject)` を受け取る関数（Executor）を渡します。

```js-repl:1
> const myPromise = new Promise((resolve, reject) => {
...   // ここで非同期処理を行う
...   const success = true;
...   if (success) {
...     resolve("OK!"); // 成功時
...   } else {
...     reject(new Error("Failed")); // 失敗時
...   }
... });
undefined
> myPromise
Promise { 'OK!' }
```

### .then(), .catch(), .finally()

Promiseオブジェクトの結果を受け取るには、以下のメソッドを使用します。

  * **`.then(onFulfilled)`**: PromiseがFulfilledになった時に実行されます。
  * **`.catch(onRejected)`**: PromiseがRejectedになった時に実行されます。
  * **`.finally(onFinally)`**: 成功・失敗に関わらず、処理終了時に実行されます。

先ほどのコールバック地獄の例を、Promiseを使って書き直してみましょう。

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

1.  `.then()` の中で新しい Promise を返すと、次の `.then()` はその新しい Promise の完了を待ちます。これにより、非同期処理を **フラットな連鎖** として記述できます。
2.  エラー処理は最後の `.catch()` に集約できます。`try-catch` ブロックに近い感覚で扱えるようになります。

## この章のまとめ

  * JavaScriptはシングルスレッドで動作し、**イベントループ** という仕組みを使って非同期処理を管理しています。
  * 非同期処理の完了を待つために、昔はコールバック関数が多用されていましたが、ネストが深くなる問題がありました。
  * **Promise** は非同期処理の状態（Pending, Fulfilled, Rejected）を管理するオブジェクトです。
  * `.then()` をチェーンさせることで、非同期処理を直列に、読みやすく記述できます。
  * エラーハンドリングは `.catch()` で一括して行えます。

次章では、このPromiseをさらに同期処理のように書ける構文糖衣 **async/await** について学びます。

## 練習問題

### 問題1: ランダムな成功/失敗

`Math.random()` を使い、50%の確率で成功（Resolve）、50%の確率で失敗（Reject）するPromiseを返す関数 `coinToss` を作成してください。
それを使用し、成功時は "Win\!"、失敗時は "Lose..." とコンソールに表示するコードを書いてください。

```js:practice9_1.js
```

```js-exec:practice9_1.js
```

### 問題2: 擬似的なデータ取得フロー

以下の仕様を満たすコードを作成してください。

1.  関数 `fetchUser(userId)`: 1秒後に `{ id: userId, name: "User" + userId }` というオブジェクトでresolveする。
2.  関数 `fetchPosts(userName)`: 1秒後に `["Post 1 by " + userName, "Post 2 by " + userName]` という配列でresolveする。
3.  これらをPromiseチェーンで繋ぎ、ユーザーID `1` でユーザーを取得した後、その名前を使って投稿を取得し、最終的に投稿リストをコンソールに表示してください。

```js:practice9_2.js
```

```js-exec:practice9_2.js
```
