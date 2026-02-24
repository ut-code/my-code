---
id: cpp-project-build-practice1
title: '練習問題1: 電卓クラスの分割'
level: 3
---

### 練習問題1: 電卓クラスの分割

`Calculator` というクラスを作成してください。このクラスは、加算、減算、乗算、除算のメンバ関数を持ちます。

* `Calculator.h`: `Calculator`クラスの定義を記述します。
* `Calculator.cpp`: 各メンバ関数の実装を記述します。
* `practice6_1.cpp`: `Calculator`クラスのインスタンスを作成し、いくつかの計算を行って結果を表示します。

これらのファイルをg++で手動ビルドして、プログラムを実行してください。

```cpp:Calculator.h

```

```cpp:Calculator.cpp

```

```cpp:practice6_1.cpp
#include <iostream>
#include "Calculator.h"

int main() {
    Calculator calc;

    std::cout << "3 + 5 = " << calc.add(3, 5) << std::endl;
    std::cout << "10 - 2 = " << calc.subtract(10, 2) << std::endl;
    std::cout << "4 * 7 = " << calc.multiply(4, 7) << std::endl;
    std::cout << "20 / 4 = " << calc.divide(20, 4) << std::endl;
    return 0;
}
```

```cpp-exec:practice6_1.cpp,Calculator.cpp
3 + 5 = 8
10 - 2 = 8
4 * 7 = 28
20 / 4 = 5
```
