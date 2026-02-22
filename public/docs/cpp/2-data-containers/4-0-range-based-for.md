---
id: cpp-data-containers-range-based-for
title: 範囲ベース for ループ (Range-based for)
level: 2
---

## 範囲ベース `for` ループ (Range-based for)

`std::vector` や `std::array` の中身を順番に処理する場合、インデックス `i` を使った `for (int i = 0; i < n; ++i)` は書くのが面倒ですし、境界外アクセスのリスクがあります。

モダンC++では、PythonやC\#の `foreach` に相当する **範囲ベース for ループ** が使えます。

```cpp
for (要素の型 変数名 : コンテナ) {
    // 処理
}
```

ここで便利なのが、**`auto` キーワード**です。`auto` を使うと、コンパイラが型を自動推論してくれるため、型名を詳しく書く必要がなくなります。

```cpp:range_for_demo.cpp
#include <iostream>
#include <vector>
#include <string>

int main() {
    std::vector<std::string> inventory = {"Sword", "Shield", "Potion"};

    std::cout << "--- Inventory List ---" << std::endl;

    // string item : inventory と書いても良いが、autoが楽
    for (auto item : inventory) {
        std::cout << "- " << item << std::endl;
    }

    // 数値の計算例
    std::vector<int> scores = {80, 65, 90, 72};
    int total = 0;
    
    for (auto score : scores) {
        total += score;
    }
    
    std::cout << "Total Score: " << total << std::endl;

    return 0;
}
```

```cpp-exec:range_for_demo.cpp
--- Inventory List ---
- Sword
- Shield
- Potion
Total Score: 307
```

> **Advanced Hint:**
> 上記の `auto item` は、要素を「コピー」して取り出します。`std::string` のような大きなデータを扱う場合、コピーコストを避けるために `const auto& item` （参照）を使うのが一般的ですが、これについては**第5章**で詳しく解説します。今の段階では「`auto` でループが回せる」と覚えておけば十分です。

