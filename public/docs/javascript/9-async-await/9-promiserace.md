---
id: javascript-async-await-9-promiserace
title: Promise.race()
level: 3
---

### Promise.race()

複数のPromiseのうち、**最も早く完了（または失敗）したもの**の結果だけを返します。タイムアウト処理の実装などによく使われます。

```js-repl:4
> const fast = new Promise(r => setTimeout(() => r("Fast"), 100));
> const slow = new Promise(r => setTimeout(() => r("Slow"), 500));
> await Promise.race([fast, slow])
'Fast'
```
