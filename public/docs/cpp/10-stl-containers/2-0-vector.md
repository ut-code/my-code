---
id: cpp-stl-containers-vector
title: 'std::vector: 最もよく使う可変長配列'
level: 2
---

## `std::vector`: 最もよく使う可変長配列

`std::vector`は、最も基本的で最もよく使われるコンテナです。他の言語でいうところの「リスト」や「動的配列」に相当し、要素を連続したメモリ領域に格納します。

**主な特徴**:

  * **動的なサイズ**: 必要に応じて自動的にサイズが拡張されます。
  * **高速なランダムアクセス**: インデックス（添字）を使って `[i]` の形式で要素に高速にアクセスできます (`O(1)`)。
  * **末尾への高速な追加・削除**: `push_back()` や `pop_back()` を使った末尾への操作は非常に高速です。

`std::vector`を使うには、`<vector>`ヘッダをインクルードする必要があります。

```cpp:vector_example.cpp
#include <iostream>
#include <vector>
#include <string>

int main() {
    // string型の要素を格納するvectorを作成
    std::vector<std::string> names;

    // push_backで末尾に要素を追加
    names.push_back("Alice");
    names.push_back("Bob");
    names.push_back("Charlie");

    // インデックスを使った要素へのアクセス
    std::cout << "Index 1: " << names[1] << std::endl;

    // 範囲for文 (range-based for loop) を使った全要素の走査
    std::cout << "\nAll names:" << std::endl;
    for (const std::string& name : names) {
        std::cout << "- " << name << std::endl;
    }

    // size()で現在の要素数を取得
    std::cout << "\nCurrent size: " << names.size() << std::endl;

    // pop_backで末尾の要素を削除
    names.pop_back(); // "Charlie"を削除

    std::cout << "\nAfter pop_back:" << std::endl;
    for (const std::string& name : names) {
        std::cout << "- " << name << std::endl;
    }
    std::cout << "Current size: " << names.size() << std::endl;

    return 0;
}
```

```cpp-exec:vector_example.cpp
Index 1: Bob

All names:
- Alice
- Bob
- Charlie

Current size: 3

After pop_back:
- Alice
- Bob
Current size: 2
```

`std::vector`は、どのコンテナを使うか迷ったら、まず最初に検討すべきデフォルトの選択肢と言えるほど万能です。
