---
id: cpp-project-build-split-example
title: 分割の例
level: 3
---

### 分割の例

簡単な足し算を行う関数を別のファイルに分割してみましょう。

まず、関数の「宣言」をヘッダファイルに記述します。

```cpp:math_utils.h
// 関数の宣言を記述するヘッダファイル

// この関数が他のファイルから参照されることを示す
int add(int a, int b);
```

次に、この関数の「実装」をソースファイルに記述します。

```cpp:math_utils.cpp
// 関数の実装を記述するソースファイル

#include "math_utils.h" // 対応するヘッダファイルをインクルード

int add(int a, int b) {
    return a + b;
}
```

最後に、`main`関数を含むメインのソースファイルから、この`add`関数を呼び出します。

```cpp:math_app.cpp
#include <iostream>
#include "math_utils.h" // 自作したヘッダファイルをインクルード

int main() {
    int result = add(5, 3);
    std::cout << "The result is: " << result << std::endl;
    return 0;
}
```

```cpp-exec:math_app.cpp,math_utils.cpp
The result is: 8
```

ここで注目すべき点は、`math_app.cpp`が`add`関数の具体的な実装を知らないことです。`math_utils.h`を通じて「`int`を2つ受け取って`int`を返す`add`という関数が存在する」ことだけを知り、それを利用しています。
