---
id: rust-ownership-1-stack
title: スタック（Stack）
level: 3
---

### スタック（Stack）

  * **特徴:** Last In, First Out (LIFO)。高速。
  * **データ:** コンパイル時にサイズが既知のデータ（`i32`, `bool`, 固定長配列など）が置かれます。
  * **動作:** 関数呼び出し時にローカル変数がプッシュされ、関数終了時にポップされます。
