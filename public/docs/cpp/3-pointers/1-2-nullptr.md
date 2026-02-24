---
id: cpp-pointers-nullptr
title: nullptr の使用
level: 3
---

### `nullptr` の使用

ポインタが「どこも指していない」ことを示したい場合、C++では `nullptr` を使用します。
古いC++やC言語では `NULL` や `0` が使われていましたが、モダンC++では型安全な `nullptr` を使うのが鉄則です。初期化されていないポインタは不定な場所を指すため、必ず初期化しましょう。

```cpp:pointer_declaration.cpp
#include <iostream>

int main() {
    // ポインタの宣言
    // 初期化していないポインタは不定なアドレスを指す可能性がある。
    int* p;
    std::cout << "p の初期値(アドレス): " << p << std::endl;

    // *p = 10; // 【危険】未初期化ポインタの間接参照は未定義動作

    // どの変数も指していないことを示す特別な値 nullptr
    // ポインタを初期化する際は nullptr を使うのが安全です
    p = nullptr;
    std::cout << "p の値(アドレス): " << p << std::endl;

    if (p == nullptr) {
        std::cout << "p は何も指していません。" << std::endl;
    }

    // *p = 10; // 【危険】nullptrはどこも指していないので、やっぱり未定義動作

    return 0;
}
```

```cpp-exec:pointer_declaration.cpp
p の初期値(アドレス): 0x7ffedffe3ab8
p の値(アドレス): 0
p は何も指していません。
```
