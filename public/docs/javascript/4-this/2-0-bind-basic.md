---
id: javascript-this-bind-basic
title: 'this を固定する: bind, call, apply'
level: 2
question:
  - '`this`を固定する必要があるのは、どのような場面ですか？'
  - '`bind`、`call`、`apply`は、それぞれどういう状況で使い分けるべきですか？'
---

## `this` を固定する: bind, call, apply

「関数呼び出し」でも特定のオブジェクトを `this` として扱いたい場合があります。JavaScriptには、`this` を明示的に指定（束縛）するためのメソッドが3つ用意されています。
