---
id: javascript-async-await-5-json-post
title: JSONデータの送信 (POST)
level: 3
---

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
