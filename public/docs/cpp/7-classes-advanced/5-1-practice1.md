---
id: cpp-classes-advanced-practice1
title: '練習問題1: 複素数クラス'
level: 3
---

### 練習問題1: 複素数クラス

実部 (real) と虚部 (imaginary) を`double`型で持つ複素数クラス `Complex` を作成してください。以下の要件を満たすものとします。

1.  コンストラクタで実部と虚部を初期化できるようにする。
2.  複素数同士の足し算 (`+`) と掛け算 (`*`) を演算子オーバーロードで実装する。
      * 加算: $(a+bi) + (c+di) = (a+c) + (b+d)i$
      * 乗算: $(a+bi) \* (c+di) = (ac-bd) + (ad+bc)i$
3.  `std::cout` で `(a + bi)` という形式で出力できるように、`<<` 演算子をオーバーロードする。（虚部が負の場合は `(a - bi)` のように表示されるとより良い）

```cpp:practice8_1.cpp
#include <iostream>

// ここに Complex クラスを実装してください

int main() {
    Complex c1(1.0, 2.0); // 1 + 2i
    Complex c2(3.0, 4.0); // 3 + 4i
    Complex sum = c1 + c2;
    Complex product = c1 * c2;

    std::cout << "c1: " << c1 << std::endl;
    std::cout << "c2: " << c2 << std::endl;
    std::cout << "c1 + c2 = " << sum << std::endl;
    std::cout << "c1 * c2 = " << product << std::endl;
    return 0;
}
```

```cpp-exec:practice8_1.cpp
c1: (1 + 2i)
c2: (3 + 4i)
c1 + c2 = (4 + 6i)
c1 * c2 = (-5 + 10i)
```
