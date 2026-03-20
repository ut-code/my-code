---
id: javascript-async-await-fetch-post
title: JSONデータの送信 (POST)
level: 3
question:
  - POSTリクエストでJSONデータを送信する方法は？
  - 'method: ''POST''は何を意味しますか？'
  - 'headers: { ''Content-Type'': ''application/json'' }はなぜ必要ですか？'
  - JSON.stringify(postData)は何をするためのものですか？
  - .then(res => res.json())はなぜここで使われているのですか？
  - 'POSTリクエストのid: 101は何を表していますか？'
---

### JSONデータの送信 (POST)

データを送信する場合は、第2引数にオプションオブジェクトを渡します。

```js-repl
> const postData = { title: 'foo', body: 'bar', userId: 1 };
> await fetch('https://jsonplaceholder.typicode.com/posts', {
...   method: 'POST',
...   headers: { 'Content-Type': 'application/json' },
...   body: JSON.stringify(postData)
... }).then(res => res.json())
{ title: 'foo', body: 'bar', userId: 1, id: 101 }
```
