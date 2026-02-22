---
id: rust-intro-3-fearless-concurrency
title: 3. 安全な並行性（Fearless Concurrency）
level: 3
---

### 3\. 安全な並行性（Fearless Concurrency）

多くの言語で並行処理はバグの温床（データ競合など）ですが、Rustではコンパイラがデータ競合を検知し、コンパイルエラーとして報告します。「コンパイルが通れば、並行性のバグを含んでいる可能性は低い」という安心感を持ってコーディングできます。
