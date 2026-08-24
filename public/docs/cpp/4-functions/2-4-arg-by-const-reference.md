---
id: cpp-functions-arg-by-const-reference
title: 4. const 参照渡し (Pass by const Reference)
level: 3
question:
  - '`const`参照渡しがC++で最も頻繁に使われるパターンとされるのはなぜですか？'
  - '`const`参照渡しで関数内で値を変更しようとするとコンパイルエラーになるのは、具体的にどのような仕組みですか？'
  - '`int`や`double`のような基本型では値渡しで良いとのことですが、なぜ`const`参照渡しを使う必要がないのですか？'
term:
  - const 参照渡し
---

### 4\. const 参照渡し (Pass by const Reference)

これが**C++で最も頻繁に使われるパターン**です。「[[コピー]]はしたくない（重いから）。でも、関数内で書き換えられたくもない」という要求を満たします。

  * **構文:** `const 型& 引数名`
  * **用途:** [[`std::string`]]、[[`std::vector`]]、[[クラス]]の[[オブジェクト]]など、サイズが大きくなる可能性があるデータ。

<!-- end list -->

> [!TIP]
> 変更しないがサイズが大きいデータ（[[`std::string`]], [[`std::vector`]]など） → **const参照渡し** (`const T&`)。

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
