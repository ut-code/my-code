---
id: cpp-stl-containers-map
title: 'std::map: キーと値のペアを管理する連想配列'
level: 2
---

## std::map: キーと値のペアを管理する連想配列

`std::map`は、キー (key) と値 (value) のペアを管理するためのコンテナです。他の言語の「辞書 (dictionary)」や「ハッシュマップ (hash map)」に似ています。キーを使って値を高速に検索、追加、削除できます。

**主な特徴**:

  * **キーによる高速な検索**: キーに基づいて要素が自動的にソートされて格納されるため、検索、挿入、削除が高速です (`O(log n)`)。
  * **一意なキー**: `std::map`内のキーは重複しません。同じキーで値を挿入しようとすると、既存の値が上書きされます。

`std::map`を使うには、`<map>`ヘッダをインクルードする必要があります。

```cpp:map_example.cpp
#include <iostream>
#include <map>
#include <string>

int main() {
    // キーがstring型、値がint型のmapを作成
    std::map<std::string, int> scores;

    // []演算子で要素を追加・更新
    scores["Alice"] = 95;
    scores["Bob"] = 88;
    scores["Charlie"] = 76;

    // []演算子で値にアクセス
    std::cout << "Bob's score: " << scores["Bob"] << std::endl;

    // 新しいキーで追加
    scores["David"] = 100;
    
    // 既存のキーの値を更新
    scores["Alice"] = 98;

    // 範囲for文を使った全要素の走査
    // autoキーワードを使うと型推論が効いて便利
    std::cout << "\nAll scores:" << std::endl;
    for (const auto& pair : scores) {
        std::cout << "- " << pair.first << ": " << pair.second << std::endl;
    }

    // count()でキーの存在を確認
    std::string search_key = "Charlie";
    if (scores.count(search_key)) {
        std::cout << "\n" << search_key << " is in the map." << std::endl;
    }

    // erase()で要素を削除
    scores.erase("Bob");

    std::cout << "\nAfter erasing Bob:" << std::endl;
    for (const auto& pair : scores) {
        std::cout << "- " << pair.first << ": " << pair.second << std::endl;
    }

    return 0;
}
```

```cpp-exec:map_example.cpp
Bob's score: 88

All scores:
- Alice: 98
- Bob: 88
- Charlie: 76
- David: 100

Charlie is in the map.

After erasing Bob:
- Alice: 98
- Charlie: 76
- David: 100
```

`std::map`は、キーと値のペアを効率的に管理したい場合に非常に強力なツールです。
