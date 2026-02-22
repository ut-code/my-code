---
id: cpp-templates-function-template
title: '関数テンプレート: intでもdoubleでもstringでも動く関数を作る'
level: 2
---

## 関数テンプレート: intでもdoubleでもstringでも動く関数を作る

関数テンプレートを使うと、先ほどの`max`関数の問題をエレガントに解決できます。

```cpp:function_template_intro.cpp
#include <iostream>
#include <string>

// Tという名前で型を仮引数として受け取るテンプレートを宣言
template <typename T>
T max_value(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    // int型でmax_valueを呼び出す
    std::cout << "max(10, 20) = " << max_value(10, 20) << std::endl;

    // double型でmax_valueを呼び出す
    std::cout << "max(3.14, 1.41) = " << max_value(3.14, 1.41) << std::endl;

    // std::string型でも動作する！
    std::string s1 = "world";
    std::string s2 = "hello";
    std::cout << "max(\"world\", \"hello\") = " << max_value(s1, s2) << std::endl;

    return 0;
}
```

```cpp-exec:function_template_intro.cpp
max(10, 20) = 20
max(3.14, 1.41) = 3.14
max("world", "hello") = world
```
