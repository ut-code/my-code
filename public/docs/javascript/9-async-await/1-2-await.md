---
id: javascript-async-await-await
title: await 式
level: 3
question:
  - awaitはasync関数の中でしか使えないのですか？
  - awaitが関数の実行を一時停止するとはどういうことですか？
  - Settled（解決または拒否）とは具体的にどういう状態ですか？
  - delay関数はPromiseを返すのですか？
  - await delay(1000)の後にすぐにconsole.log("End")が実行されないのはなぜですか？
---

### `await` 式

`async` 関数の内部（またはモジュールのトップレベル）でのみ使用できるキーワードです。
`await` は、右側の Promise が **Settled（解決または拒否）されるまで関数の実行を一時停止** します。Promiseが解決されると、その結果の値を返して実行を再開します。

これは、C\# の `async/await` や Python の `asyncio` に慣れている方にはおなじみの挙動でしょう。

```js-repl
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
