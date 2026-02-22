---
id: javascript-promise-3-promise
title: Promiseの概念
level: 2
---

## Promiseの概念

**Promise** は、非同期処理の「最終的な完了（または失敗）」とその「結果の値」を表すオブジェクトです。未来のある時点で値が返ってくる「約束手形」のようなものと考えてください。

Promiseオブジェクトは以下の3つの状態のいずれかを持ちます。

1.  **Pending (待機中):** 初期状態。処理はまだ完了していない。
2.  **Fulfilled (履行):** 処理が成功し、値を持っている状態。(`resolve` された)
3.  **Rejected (拒否):** 処理が失敗し、エラー理由を持っている状態。(`reject` された)

Promiseの状態は一度 Pending から Fulfilled または Rejected に変化すると、二度と変化しません（Immutable）。
