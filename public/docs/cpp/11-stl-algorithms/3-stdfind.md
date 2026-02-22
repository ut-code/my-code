---
id: cpp-stl-algorithms-3-stdfind
title: 'std::find: 要素を検索する'
level: 3
---

### `std::find`: 要素を検索する

指定された範囲から特定の値を持つ要素を検索します。

  * **見つかった場合**: その要素を指すイテレータを返します。
  * **見つからなかった場合**: 範囲の終端を示すイテレータ (`end()`) を返します。

この性質を利用して、要素が存在するかどうかをチェックできます。

```cpp:find_example.cpp
#include <iostream>
#include <vector>
#include <algorithm> // std::find のために必要

int main() {
    std::vector<int> numbers = {10, 20, 30, 40, 50};
    int value_to_find = 30;

    // numbers の中から 30 を探す
    auto it = std::find(numbers.begin(), numbers.end(), value_to_find);

    if (it != numbers.end()) {
        // 見つかった場合
        std::cout << "Found " << *it << " at index " << std::distance(numbers.begin(), it) << std::endl;
    } else {
        // 見つからなかった場合
        std::cout << value_to_find << " not found." << std::endl;
    }

    value_to_find = 99;
    it = std::find(numbers.begin(), numbers.end(), value_to_find);

    if (it != numbers.end()) {
        std::cout << "Found " << *it << std::endl;
    } else {
        std::cout << value_to_find << " not found." << std::endl;
    }

    return 0;
}
```

```cpp-exec:find_example.cpp
Found 30 at index 2
99 not found.
```
