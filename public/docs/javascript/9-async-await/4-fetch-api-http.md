---
id: javascript-async-await-4-fetch-api-http
title: Fetch API によるHTTPリクエスト
level: 2
---

## Fetch API によるHTTPリクエスト

JavaScript（特にブラウザ環境や最近のNode.js）でHTTPリクエストを行うための標準APIが `fetch` です。以前は `XMLHttpRequest` という扱いづらいAPIが使われていましたが、現在は `fetch` が主流です。

`fetch` 関数は `Promise` を返します。

基本的な流れは以下の通りです：

1.  `fetch(url)` を実行し、レスポンスヘッダーが届くのを待つ。
2.  Responseオブジェクトを受け取る。
3.  Responseオブジェクトからメソッド（`.json()`, `.text()`など）を使ってボディを読み込む（これも非同期）。

```js:fetch_basic.js
// 外部APIからJSONデータを取得する例
// (Node.js 18以上ではfetchが標準で使用可能です)

async function getUserData(userId) {
    const url = `https://jsonplaceholder.typicode.com/users/${userId}`;

    try {
        // 1. リクエスト送信 (ネットワークエラー以外はrejectされない)
        const response = await fetch(url);

        // 2. HTTPステータスコードの確認
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        // 3. レスポンスボディをJSONとしてパース (これもPromiseを返す)
        const data = await response.json();
        
        console.log(`Name: ${data.name}`);
        console.log(`Email: ${data.email}`);

    } catch (error) {
        console.error("Fetch failed:", error.message);
    }
}

getUserData(1);
```

```js-exec:fetch_basic.js
Name: Leanne Graham
Email: Sincere@april.biz
```
