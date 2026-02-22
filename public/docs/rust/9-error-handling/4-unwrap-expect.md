---
id: rust-error-handling-4-unwrap-expect
title: unwrap と expect の使い所
level: 2
---

## `unwrap` と `expect` の使い所

毎回 `match` で分岐を書くのは冗長な場合があります。「失敗したらプログラムをクラッシュさせていい」という場合や、「ここでは絶対に失敗しない」と確信がある場合のために、ヘルパーメソッドが用意されています。
