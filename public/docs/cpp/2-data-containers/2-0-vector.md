---
id: cpp-data-containers-vector
title: '可変長配列：std::vector'
level: 2
---

## 可変長配列：`std::vector`

「データの個数が事前にわからない」「途中でデータを追加したい」という場合、C++で最も頻繁に使われるのが `std::vector` です。これは「動的配列」や「可変長配列」と呼ばれ、Pythonの `list` や Javaの `ArrayList` に相当します。

**基本操作**

  * **宣言**: `std::vector<型> 変数名;`
  * **追加**: `.push_back(値)` で末尾に追加。
  * **アクセス**: `変数名[インデックス]` または `.at(インデックス)`。
  * **サイズ**: `.size()`。

<!-- end list -->

```cpp:vector_demo.cpp
#include <iostream>
#include <vector> // std::vectorを使うために必要

int main() {
    // 整数を格納するvector（初期サイズは0）
    std::vector<int> numbers;

    // データの追加
    numbers.push_back(10);
    numbers.push_back(20);
    numbers.push_back(30);

    // サイズの確認
    std::cout << "Size: " << numbers.size() << std::endl;

    // 要素へのアクセス
    std::cout << "First element: " << numbers[0] << std::endl;
    
    // .at() を使うと範囲外アクセスの時に例外を投げてくれる（安全）
    try {
        std::cout << numbers.at(100) << std::endl; // 範囲外
    } catch (const std::out_of_range& e) {
        std::cout << "Error: " << e.what() << std::endl;
    }

    // 初期化リストを使った宣言（C++11以降）
    std::vector<double> prices = {10.5, 20.0, 33.3};
    std::cout << "Price list size: " << prices.size() << std::endl;

    return 0;
}
```

```cpp-exec:vector_demo.cpp
Size: 3
First element: 10
Error: vector::_M_range_check: __n (which is 100) >= this->size() (which is 3)
Price list size: 3
```
