---
id: rust-generics-traits-7-trait-bounds
title: トレイト境界（Trait Bounds）
level: 2
---

## トレイト境界（Trait Bounds）

ジェネリック関数を作る際、型 `T` に対して「どんな型でもいい」のではなく、「特定の機能（トレイト）を持っている型だけ受け付けたい」という場合がほとんどです。これを制約するのが**トレイト境界**です。
