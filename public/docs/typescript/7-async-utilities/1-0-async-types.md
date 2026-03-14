---
id: typescript-async-utilities-async-types
title: '非同期処理の型: Promise と async/await'
level: 2
question:
  - Promiseとは何ですか？
  - Promise<T>のTは何を意味しますか？
  - なぜ非同期関数の戻り値は常にPromiseなのですか？
  - JavaScriptの非同期処理とTypeScriptの型の関係がよくわかりません。
---

## 非同期処理の型: Promise と async/await

JavaScriptでは、非同期関数の戻り値は常に `Promise` オブジェクトです。TypeScriptでは、このPromiseが**解決（Resolve）されたときに持つ値の型**をジェネリクスを使って `Promise<T>` の形式で表現します。
