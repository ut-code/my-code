---
id: cpp-data-containers-summary
title: 基本構文
level: 3
---

### 基本構文

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

# この章のまとめ

1.  **文字列**: `char*` ではなく `std::string` を使う。結合や比較が簡単で安全。
2.  **動的配列**: データの増減がある場合は `std::vector` を使う。`push_back()` で追加できる。
3.  **固定配列**: サイズ固定の場合は `std::array` を使う。Cスタイル配列のモダンな代替。
4.  **ループ**: コンテナの全要素走査には「範囲ベース for ループ」と `auto` を使うとシンプルに書ける。

これらの「標準ライブラリ（STL: Standard Template Library）」のコンテナを活用することで、メモリ管理の苦労を飛ばして、アプリケーションのロジックに集中できるようになります。
