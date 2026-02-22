---
id: cpp-pointers-new-delete
title: new と delete
level: 3
---

### `new` と `delete`

ヒープ領域を使うには `new` 演算子を使用し、使い終わったら必ず `delete` 演算子でメモリをOSに返却（解放）する必要があります。

```cpp:heap_memory.cpp
#include <iostream>

int main() {
    // ヒープ上に整数を1つ確保
    int* pInt = new int(10); 
    
    // ヒープ上に配列を確保 (サイズ100)
    // std::vectorを使わない場合、サイズは動的に決められるが管理は手動
    int size = 5;
    int* pArray = new int[size];

    // 配列への書き込み
    for(int i = 0; i < size; ++i) {
        pArray[i] = i * 10;
    }

    std::cout << "ヒープ上の値: " << *pInt << std::endl;
    std::cout << "ヒープ上の配列[2]: " << pArray[2] << std::endl;

    // 【重要】使い終わったら必ず解放する！
    delete pInt;       // 単体の解放
    delete[] pArray;   // 配列の解放 (delete[] を使うこと)

    // 解放後のアドレスには触ってはいけない（ダングリングポインタ）
    // 安全のため nullptr にしておく
    pInt = nullptr;
    pArray = nullptr;

    return 0;
}
```

```cpp-exec:heap_memory.cpp
ヒープ上の値: 10
ヒープ上の配列[2]: 20
```
