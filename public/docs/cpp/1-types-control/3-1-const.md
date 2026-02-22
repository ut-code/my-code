---
id: cpp-types-const
title: constによる不変性の保証
level: 3
---

### `const`による不変性の保証

`const` (constantの略) は、変数を**読み取り専用**にするためのキーワードです。一度`const`で初期化された変数の値は、後から変更しようとするとコンパイルエラーになります。

なぜ`const`が重要なのでしょうか？

  * **安全性の向上**: 変更されるべきでない値を誤って変更してしまうバグを防ぎます。
  * **意図の明確化**: プログラムを読む人に対して、「この値は変わらない」という意図を明確に伝えられます。

円周率のように、プログラム中で決して変わることのない値に`const`を使うのが典型的な例です。

```cpp:const_example.cpp
#include <iostream>

int main() {
    const double PI = 3.14159;
    int radius = 5;

    double area = PI * radius * radius;
    std::cout << "Area: " << area << std::endl;

    // PI = 3.14; // この行はコンパイルエラーになる！

    return 0;
}
```
```cpp-exec:const_example.cpp
Area: 78.5397
```
