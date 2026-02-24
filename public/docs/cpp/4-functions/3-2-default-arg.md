---
id: cpp-functions-default-arg
title: デフォルト引数
level: 3
---

### デフォルト引数

引数が省略された場合に使われるデフォルト値を設定できます。これはプロトタイプ宣言（または最初にコンパイラが見る定義）に記述します。
※デフォルト引数は**後ろの引数から順に**設定する必要があります。

```cpp:default_args.cpp
#include <iostream>

// power: 指数を省略すると2乗になる
// verbose: 詳細出力を省略するとfalseになる
int power(int base, int exponent = 2, bool verbose = false) {
    int result = 1;
    for (int i = 0; i < exponent; ++i) {
        result *= base;
    }
    
    if (verbose) {
        std::cout << base << " の " << exponent << " 乗を計算しました。" << std::endl;
    }
    return result;
}

int main() {
    std::cout << power(3) << std::endl;          // 3^2, verbose=false
    std::cout << power(3, 3) << std::endl;       // 3^3, verbose=false
    std::cout << power(2, 4, true) << std::endl; // 2^4, verbose=true
    return 0;
}
```

```cpp-exec:default_args.cpp
9
27
2 の 4 乗を計算しました。
16
```
