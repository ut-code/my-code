---
id: cpp-pointers-string-literal
title: 文字列リテラルと char*
level: 3
---

### 文字列リテラルと `char*`

Cスタイル文字列は、文字の並びの最後に「終端文字 `\0`（ヌル文字）」を置くことで終わりを表します。

```cpp:legacy_string.cpp
#include <iostream>
#include <string>

int main() {
    // 文字列リテラルは const char 配列
    const char* c_str = "Hello"; 
    
    // std::string から Cスタイル文字列への変換
    std::string cpp_str = "World";
    const char* converted = cpp_str.c_str(); // .c_str() を使う

    std::cout << "C-Style: " << c_str << std::endl;
    std::cout << "C++ String: " << cpp_str << std::endl;
    std::cout << "Converted to C-Style: " << converted << std::endl;
    
    // 注意: c_str は配列なのでサイズ情報を持っていない
    // 終端文字 '\0' まで読み進める必要がある
    
    return 0;
}
```

```cpp-exec:legacy_string.cpp
C-Style: Hello
C++ String: World
Converted to C-Style: World
```

**重要:** モダンC++では基本的に `std::string` を使いましょう。`char*` は参照用やAPI互換のために使います。
