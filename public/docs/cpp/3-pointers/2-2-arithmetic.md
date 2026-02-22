---
id: cpp-pointers-arithmetic
title: ポインタ演算
level: 3
---

### ポインタ演算

ポインタに対して数値を足し引きすると、**「その型のサイズ分」**だけアドレスが移動します。
`int`（通常4バイト）のポインタに `+1` すると、メモリアドレスは4増えます。

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
