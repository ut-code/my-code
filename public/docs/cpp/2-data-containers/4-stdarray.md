---
id: cpp-data-containers-4-stdarray
title: '固定長配列：std::array'
level: 2
---

## 固定長配列：std::array

データの個数が決まっている場合（例えば、3次元座標、RGB値、固定バッファなど）は、`std::vector` よりも `std::array` が適しています。

「なぜ昔ながらの `int arr[5];` を使わないの？」と思われるかもしれません。
Cスタイルの配列は、他のコンテナ（vectorなど）と操作感が異なり、サイズ情報を自分で管理しなければならないなどの欠点があります。`std::array` はC配列のパフォーマンス（スタック確保）と、コンテナの利便性（`.size()`などが使える）を両立させたものです。

```cpp:array_demo.cpp
#include <iostream>
#include <array> // std::arrayを使うために必要

int main() {
    // int型でサイズ3の配列を宣言・初期化
    // std::array<型, サイズ>
    std::array<int, 3> coords = {10, 20, 30};

    std::cout << "X: " << coords[0] << std::endl;
    std::cout << "Y: " << coords[1] << std::endl;
    std::cout << "Z: " << coords[2] << std::endl;

    // vectorと同じようにsize()が使える
    std::cout << "Dimension: " << coords.size() << std::endl;

    return 0;
}
```

```cpp-exec:array_demo.cpp
X: 10
Y: 20
Z: 30
Dimension: 3
```
