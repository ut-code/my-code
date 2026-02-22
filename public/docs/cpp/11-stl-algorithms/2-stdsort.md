---
id: cpp-stl-algorithms-2-stdsort
title: 'std::sort: 要素を並べ替える'
level: 3
---

### `std::sort`: 要素を並べ替える

名前の通り、指定された範囲の要素をソートします。デフォルトでは昇順に並べ替えます。

```cpp:sort_example.cpp
#include <iostream>
#include <vector>
#include <algorithm> // std::sort のために必要
#include <string>

int main() {
    std::vector<int> numbers = {5, 2, 8, 1, 9};
    
    // numbers.begin() から numbers.end() の範囲をソート
    std::sort(numbers.begin(), numbers.end());

    std::cout << "Sorted numbers: ";
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;

    std::vector<std::string> words = {"banana", "apple", "cherry"};
    std::sort(words.begin(), words.end());

    std::cout << "Sorted words: ";
    for (const auto& word : words) {
        std::cout << word << " ";
    }
    std::cout << std::endl;

    return 0;
}
```

```cpp-exec:sort_example.cpp
Sorted numbers: 1 2 5 8 9 
Sorted words: apple banana cherry 
```
