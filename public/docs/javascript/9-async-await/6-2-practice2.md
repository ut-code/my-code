---
id: javascript-async-await-practice2
title: '練習問題2: タイムアウト付きFetch'
level: 3
question:
  - タイムアウトのPromiseはどのように作成すればいいですか？
  - fetchのPromiseとタイムアウトのPromiseをPromise.race()で競走させる具体的なコードは？
  - タイムアウトとしてエラーにするには、Promiseをrejectする必要があるのですか？
  - fetchWithTimeout(url, ms)のmsは何ミリ秒を指定すればいいですか？
---

### 練習問題2: タイムアウト付きFetch

指定したURLからデータを取得するが、一定時間内にレスポンスが返ってこない場合は「タイムアウト」としてエラーにする関数 `fetchWithTimeout(url, ms)` を作成してください。
*ヒント: `fetch` のPromiseと、指定時間後に reject するPromiseを `Promise.race()` で競走させてください。*

```js:practice10_2.js
```

```js-exec:practice10_2.js
```
