---
id: cpp-functions-arg-by-const-reference
title: 4. const 参照渡し (Pass by const Reference)
level: 3
---

### 4\. const 参照渡し (Pass by const Reference)

これが**C++で最も頻繁に使われるパターン**です。「コピーはしたくない（重いから）。でも、関数内で書き換えられたくもない」という要求を満たします。

  * **構文:** `const 型& 引数名`
  * **用途:** `std::string`、`std::vector`、クラスのオブジェクトなど、サイズが大きくなる可能性があるデータ。

<!-- end list -->

```cpp:const_ref.cpp
#include <iostream>
#include <string>
#include <vector>

// const参照渡し
// textの実体はコピーされないが、書き換えも禁止される
void printMessage(const std::string& text) {
    // text = "Modified"; // コンパイルエラーになる
    std::cout << "Message: " << text << std::endl;
}

int main() {
    std::string bigData = "This is a potentially very large string...";
    
    // コピーコストゼロで渡す
    printMessage(bigData);
    
    return 0;
}
```

```cpp-exec:const_ref.cpp
Message: This is a potentially very large string...
```

> **ガイドライン:**
>
>   * `int` や `double` などの基本型 → **値渡し** でOK。
>   * 変更させたいデータ → **参照渡し** (`T&`)。
>   * 変更しないがサイズが大きいデータ（string, vectorなど） → **const参照渡し** (`const T&`)。
