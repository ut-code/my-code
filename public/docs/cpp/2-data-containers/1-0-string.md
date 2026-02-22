---
id: cpp-data-containers-string
title: '文字列の扱い：std::string'
level: 2
---

## 文字列の扱い：`std::string`

C言語では文字列を扱うために `char*` や `char[]` を使い、ヌル終端文字 `\0` を意識する必要がありました。これはバグの温床です。
C++では、標準ライブラリの `std::string` クラスを使用します。これはPythonの `str` や Javaの `String` のように直感的に扱えます。

**主な機能**

  * **代入・初期化**: 文字列リテラルをそのまま代入可能。
  * **結合**: `+` 演算子で結合可能。
  * **比較**: `==`, `!=` などで中身の文字列比較が可能（C言語の `strcmp` は不要）。
  * **サイズ取得**: `.size()` または `.length()` メソッドを使用。

<!-- end list -->

```cpp:string_demo.cpp
#include <iostream>
#include <string> // std::stringを使うために必要

int main() {
    // 初期化
    std::string greeting = "Hello";
    std::string target = "World";

    // 文字列の結合
    std::string message = greeting + ", " + target + "!";

    // 出力
    std::cout << message << std::endl;

    // 長さの取得
    std::cout << "Length: " << message.size() << std::endl; // .length()でも同じ

    // 文字列の比較
    if (greeting == "Hello") {
        std::cout << "Greeting matches 'Hello'." << std::endl;
    }

    // 特定の文字へのアクセス（配列のようにアクセス可能）
    message[0] = 'h'; // 先頭を小文字に変更
    std::cout << "Modified: " << message << std::endl;

    return 0;
}
```

```cpp-exec:string_demo.cpp
Hello, World!
Length: 13
Greeting matches 'Hello'.
Modified: hello, World!
```

> **Note:** `std::string` は必要に応じて自動的にメモリを拡張します。プログラマがメモリ確保（malloc/free）を気にする必要はありません。
