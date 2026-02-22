---
id: typescript-async-utilities-0-promise-asyncawait
title: '非同期処理の型: Promise と async/await'
level: 2
---

## 非同期処理の型: Promise と async/await

JavaScriptでは、非同期関数の戻り値は常に `Promise` オブジェクトです。TypeScriptでは、このPromiseが**解決（Resolve）されたときに持つ値の型**をジェネリクスを使って `Promise<T>` の形式で表現します。
