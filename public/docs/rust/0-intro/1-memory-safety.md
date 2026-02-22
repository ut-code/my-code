---
id: rust-intro-1-memory-safety
title: 1. メモリ安全性（Memory Safety）
level: 3
---

### 1\. メモリ安全性（Memory Safety）

C/C++ではプログラマの責任であったメモリ管理を、Rustは**所有権（Ownership）**というコンパイル時のシステムで保証します。

  * ガベージコレクタ（GC）は**存在しません**。
  * ランタイムコストなしに、ダングリングポインタや二重解放、バッファオーバーフローをコンパイル段階で防ぎます。
