---
id: javascript-async-await-8-promiseall
title: Promise.all() による並列実行
level: 3
---

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
