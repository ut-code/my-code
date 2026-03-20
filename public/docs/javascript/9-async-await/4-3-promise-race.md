---
id: javascript-async-await-promise-race
title: Promise.race()
level: 3
question:
  - Promise.race()は何をするための関数ですか？
  - Promise.race()が最も早く完了（または失敗）したものだけを返すのはなぜですか？
  - タイムアウト処理の実装にPromise.race()がよく使われるのはなぜですか？
  - fastとslowのPromiseはそれぞれ何秒後に解決されますか？
---

### `Promise.race()`

複数のPromiseのうち、**最も早く完了（または失敗）したもの**の結果だけを返します。タイムアウト処理の実装などによく使われます。

```js-repl
> const fast = new Promise(r => setTimeout(() => r("Fast"), 100));
> const slow = new Promise(r => setTimeout(() => r("Slow"), 500));
> await Promise.race([fast, slow])
'Fast'
```
