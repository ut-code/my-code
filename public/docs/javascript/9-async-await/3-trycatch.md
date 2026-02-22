---
id: javascript-async-await-3-trycatch
title: try...catch によるエラーハンドリング
level: 2
---

## try...catch によるエラーハンドリング

生の `Promise` では `.catch()` メソッドを使ってエラーを処理しましたが、Async/Await では、他の言語と同様に標準的な `try...catch` 構文を使用できます。これにより、同期エラーと非同期エラーを同じ構文で扱えるようになります。

```js:async_try_catch.js
// ランダムに成功・失敗する非同期関数
function randomRequest() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const success = Math.random() > 0.5;
            if (success) {
                resolve("Success: データ取得完了");
            } else {
                reject(new Error("Failure: サーバーエラー"));
            }
        }, 500);
    });
}

async function main() {
    console.log("処理開始...");
    try {
        // awaitしているPromiseがrejectされると、例外がスローされる
        const result = await randomRequest();
        console.log(result);
    } catch (error) {
        // ここでエラーを捕捉
        console.error("エラーが発生しました:", error.message);
    } finally {
        console.log("処理終了");
    }
}

main();
```

```js-exec:async_try_catch.js
処理開始...
エラーが発生しました: Failure: サーバーエラー
処理終了
```

*(※注: 実行結果はランダムで成功する場合もあります)*
