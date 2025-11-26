# 第10章: 非同期処理（2）- Async/Await と Fetch API

前回（第9章）では、JavaScriptの非同期処理の要である `Promise` について学びました。しかし、`.then()` チェーンが長く続くと、コードの可読性が下がる（いわゆる「コールバック地獄」に近い状態になる）ことがあります。

第10章では、この課題を解決するために導入された **Async/Await** 構文と、現代的なHTTP通信の標準である **Fetch API** について解説します。他の言語で同期的なコード（ブロッキング処理）に慣れ親しんだ方にとって、Async/Await は非常に直感的で扱いやすい機能です。

## Async/Await 構文

`async` と `await` は、ES2017で導入された `Promise` の**シンタックスシュガー（糖衣構文）**です。これを使うことで、非同期処理をあたかも「同期処理」のように上から下へと流れるコードとして記述できます。

### `async` 関数

関数宣言の前に `async` キーワードを付けると、その関数は自動的に **Promiseを返す** ようになります。値を `return` した場合、それは `Promise.resolve(値)` と同じ意味になります。

```js-repl:1
> async function getMessage() { return "Hello, Async!"; }
undefined
> // async関数は常にPromiseを返す
> getMessage()
Promise { 'Hello, Async!' }

> // 通常のPromiseと同じくthenで値を取り出せる
> getMessage().then(v => console.log(v))
Promise { <pending> }
Hello, Async!
```

### `await` 式

`async` 関数の内部（またはモジュールのトップレベル）でのみ使用できるキーワードです。
`await` は、右側の Promise が **Settled（解決または拒否）されるまで関数の実行を一時停止** します。Promiseが解決されると、その結果の値を返して実行を再開します。

これは、C\# の `async/await` や Python の `asyncio` に慣れている方にはおなじみの挙動でしょう。

```js-repl:2
> function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
undefined
> async function run() {
...   console.log("Start");
...   await delay(1000); // 1秒待機（ここで実行が一時停止）
...   console.log("End");
... }
undefined
> run()
Promise { <pending> }
// (1秒後に表示)
Start
End
```

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

### JSONデータの送信 (POST)

データを送信する場合は、第2引数にオプションオブジェクトを渡します。

```js-repl:3
> const postData = { title: 'foo', body: 'bar', userId: 1 };
> await fetch('https://jsonplaceholder.typicode.com/posts', {
...   method: 'POST',
...   headers: { 'Content-Type': 'application/json' },
...   body: JSON.stringify(postData)
... }).then(res => res.json())
{ title: 'foo', body: 'bar', userId: 1, id: 101 }
```

## Promise.all() と Promise.race()

Async/Await は便利ですが、単純に `await` を連発すると、処理が**直列（シーケンシャル）**になってしまい、パフォーマンスが落ちる場合があります。複数の独立した非同期処理を行う場合は、並列実行を検討します。

### 直列実行（遅いパターン）

```javascript
// Aが終わってからBを開始する
const user = await fetchUser(); 
const posts = await fetchPosts(); 
```

### Promise.all() による並列実行

複数のPromiseを配列として受け取り、**全て完了するのを待って**から結果の配列を返します。一つでも失敗すると全体が失敗（reject）します。

```js:promise_all.js
const wait = (ms, value) => new Promise(r => setTimeout(() => r(value), ms));

async function parallelDemo() {
    console.time("Total Time");

    // 2つの処理を同時に開始
    const p1 = wait(1000, "User Data");
    const p2 = wait(1000, "Post Data");

    try {
        // 両方の完了を待つ
        const [user, post] = await Promise.all([p1, p2]);
        console.log("Result:", user, "&", post);
    } catch (e) {
        console.error(e);
    }

    // 本来なら直列だと2秒かかるが、並列なので約1秒で終わる
    console.timeEnd("Total Time");
}

parallelDemo();
```

```js-exec:promise_all.js
Result: User Data & Post Data
Total Time: 1.008s
```

### Promise.race()

複数のPromiseのうち、**最も早く完了（または失敗）したもの**の結果だけを返します。タイムアウト処理の実装などによく使われます。

```js-repl:4
> const fast = new Promise(r => setTimeout(() => r("Fast"), 100));
> const slow = new Promise(r => setTimeout(() => r("Slow"), 500));
> await Promise.race([fast, slow])
'Fast'
```

## この章のまとめ

  * **Async/Await**: `Promise` をベースにした糖衣構文。非同期処理を同期処理のように記述でき、可読性が高い。
  * **Error Handling**: 同期コードと同じく `try...catch` が使用可能。
  * **Fetch API**: モダンなHTTP通信API。`response.ok` でステータスを確認し、`response.json()` でボディをパースする2段構えが必要。
  * **並列処理**: 独立した複数の非同期処理は `await` を連続させるのではなく、`Promise.all()` を使用して並列化することでパフォーマンスを向上させる。

## 練習問題

### 問題1: ユーザー情報の取得と表示

以下の要件を満たす関数 `displayUserSummary(userId)` を作成してください。

1.  `https://jsonplaceholder.typicode.com/users/{userId}` からユーザー情報を取得する。
2.  `https://jsonplaceholder.typicode.com/users/{userId}/todos` からそのユーザーのTODOリストを取得する。
3.  上記2つのリクエストは、**パフォーマンスを考慮して並列に実行**すること。
4.  取得したデータから、「ユーザー名」と「完了済み(completed: true)のTODOの数」を出力する。
5.  通信エラー時は適切にエラーメッセージを表示する。

```js:practice10_1.js
```

```js-exec:practice10_1.js
```

### 問題2: タイムアウト付きFetch

指定したURLからデータを取得するが、一定時間内にレスポンスが返ってこない場合は「タイムアウト」としてエラーにする関数 `fetchWithTimeout(url, ms)` を作成してください。
*ヒント: `fetch` のPromiseと、指定時間後に reject するPromiseを `Promise.race()` で競走させてください。*

```js:practice10_2.js
```

```js-exec:practice10_2.js
```
