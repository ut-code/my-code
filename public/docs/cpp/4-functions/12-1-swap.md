---
id: cpp-functions-12-1-swap
title: '練習問題1: 値の入れ替え（Swap）'
level: 2
---

## 練習問題1: 値の入れ替え（Swap）

2つの `int` 変数を受け取り、その値を入れ替える関数 `mySwap` を作成してください。
ポインタではなく、**参照渡し**を使用してください。

```cpp:practice5_1.cpp
#include <iostream>

// ここにmySwap関数を実装してください


// main関数
int main() {
    int a = 10;
    int b = 20;
    std::cout << "Before: a = " << a << ", b = " << b << std::endl;
    mySwap(a, b);
    std::cout << "After: a = " << a << ", b = " << b << std::endl;
    return 0;
}
```

```cpp-exec:practice5_1.cpp
(期待される実行結果)
Before: a = 10, b = 20
After: a = 20, b = 10
```
