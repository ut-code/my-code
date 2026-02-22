---
id: cpp-functions-9-function-overloading
title: オーバーロード (Function Overloading)
level: 3
---

### オーバーロード (Function Overloading)

引数の**型**や**数**が異なれば、同じ名前の関数を複数定義できます。C言語では関数名はユニークである必要がありましたが、C++では「名前＋引数リスト」で区別されます。

```cpp:overloading.cpp
#include <iostream>
#include <string>

// int型を受け取る関数
void print(int i) {
    std::cout << "Integer: " << i << std::endl;
}

// double型を受け取る関数（同名）
void print(double d) {
    std::cout << "Double: " << d << std::endl;
}

// 文字列を受け取る関数（同名）
void print(const std::string& s) {
    std::cout << "String: " << s << std::endl;
}

int main() {
    print(42);
    print(3.14);
    print("Overloading");
    return 0;
}
```

```cpp-exec:overloading.cpp
Integer: 42
Double: 3.14
String: Overloading
```
