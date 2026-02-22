---
id: cpp-data-containers-range-based-for
title: 範囲ベース for ループ (Range-based for)
level: 2
---

## 範囲ベース for ループ (Range-based for)

`std::vector` や `std::array` の中身を順番に処理する場合、インデックス `i` を使った `for (int i = 0; i < n; ++i)` は書くのが面倒ですし、境界外アクセスのリスクがあります。

モダンC++では、PythonやC\#の `foreach` に相当する **範囲ベース for ループ** が使えます。
