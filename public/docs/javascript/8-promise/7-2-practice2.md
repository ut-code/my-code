---
id: javascript-promise-practice2
title: '練習問題2: 擬似的なデータ取得フロー'
level: 3
question:
  - '`fetchUser`と`fetchPosts`の関数は、それぞれ`new Promise`を使って実装するのでしょうか？'
  - '`fetchUser`で取得したユーザーの名前を、どのように`fetchPosts`の引数として渡せばよいですか？'
  - 「Promiseチェーンで繋ぎ」の部分のコードの書き方が具体的にイメージできません、ヒントをください。
---

### 練習問題2: 擬似的なデータ取得フロー

以下の仕様を満たすコードを作成してください。

1.  関数 `fetchUser(userId)`: 1秒後に `{ id: userId, name: "User" + userId }` というオブジェクトでresolveする。
2.  関数 `fetchPosts(userName)`: 1秒後に `["Post 1 by " + userName, "Post 2 by " + userName]` という配列でresolveする。
3.  これらをPromiseチェーンで繋ぎ、ユーザーID `1` でユーザーを取得した後、その名前を使って投稿を取得し、最終的に投稿リストをコンソールに表示してください。

```js:practice9_2.js
```

```js-exec:practice9_2.js
```
