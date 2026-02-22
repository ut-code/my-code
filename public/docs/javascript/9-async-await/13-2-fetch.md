---
id: javascript-async-await-13-2-fetch
title: '問題2: タイムアウト付きFetch'
level: 3
---

### 問題2: タイムアウト付きFetch

指定したURLからデータを取得するが、一定時間内にレスポンスが返ってこない場合は「タイムアウト」としてエラーにする関数 `fetchWithTimeout(url, ms)` を作成してください。
*ヒント: `fetch` のPromiseと、指定時間後に reject するPromiseを `Promise.race()` で競走させてください。*

```js:practice10_2.js
```

```js-exec:practice10_2.js
```
