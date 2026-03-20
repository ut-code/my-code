---
id: javascript-objects-properties
title: プロパティの追加・削除
level: 3
question:
  - オブジェクト作成後にプロパティを追加・削除できるのはどんな時に便利ですか？
  - 存在しないプロパティを削除しようとしたらどうなりますか？
  - '`const` で宣言したオブジェクトでもプロパティを変更できるのはなぜですか？'
---

### プロパティの追加・削除

動的な言語であるJavaScriptでは、オブジェクト作成後にプロパティを追加・削除できます。

```js-repl
> const config = { env: "production" };
undefined
> config.port = 8080; // 追加
8080
> delete config.env;  // 削除
true
> config
{ port: 8080 }
```
