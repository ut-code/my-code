---
id: cpp-pointers-array
title: 配列とポインタの関係
level: 2
---

## 配列とポインタの関係

第3章では `std::vector` を使いましたが、C++にはC言語互換の「生の配列（Cスタイル配列）」も存在します。これはサイズが固定で、機能が制限されています。

* **配列名の減衰（Decay）:** 配列の名前は式の中で使うと、**「先頭要素へのポインタ」**として扱われます。これを「減衰（Decay）」と呼びます。
* **ポインタ演算:** ポインタに対して数値を足し引きすると、**「その型のサイズ分」**だけアドレスが移動します。`int`（通常4バイト）のポインタに `+1` すると、メモリアドレスは4増えます。

```cpp:array_decay.cpp
#include <iostream>

int main() {
    // Cスタイル配列の宣言（サイズ固定）
    int primes[] = {2, 3, 5, 7};

    // 配列名 primes は &primes[0] とほぼ同じ意味になる
    int* ptr = primes;

    std::cout << "先頭要素 (*ptr): " << *ptr << std::endl;

    // ポインタ演算
    // ptr + 1 は次のint要素（メモリ上で4バイト隣）を指す
    std::cout << "2番目の要素 (*(ptr + 1)): " << *(ptr + 1) << std::endl;
    
    // 配列添字アクセス primes[2] は、実は *(primes + 2) のシンタックスシュガー
    std::cout << "3番目の要素 (primes[2]): " << primes[2] << std::endl;
    std::cout << "3番目の要素 (*(primes + 2)): " << *(primes + 2) << std::endl;

    return 0;
}
```

```cpp-exec:array_decay.cpp
先頭要素 (*ptr): 2
2番目の要素 (*(ptr + 1)): 3
3番目の要素 (primes[2]): 5
3番目の要素 (*(primes + 2)): 5
```
