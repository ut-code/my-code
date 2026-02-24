---
id: cpp-types-console
title: 'コンソール入出力 (std::cin, std::cout)'
level: 2
---

## コンソール入出力 (`std::cin`, `std::cout`)

C言語の `printf`/`scanf` と異なり、C++ではストリーム（データの流れ）として入出力を扱います。型指定子（`%d`など）を覚える必要がなく、型安全です。

  * `std::cout << 値`: 出力（Console OUT）
  * `std::cin >> 変数`: 入力（Console IN）
  * `std::endl`: 改行を行い、バッファをフラッシュする。

> my.code(); の実行環境には入力機能がないので、コード例だけ示します:

```cpp
#include <iostream>
#include <string>

int main() {
    int id;
    std::string name;

    // 複数の値を出力する場合、<< で連結します
    std::cout << "Enter ID and Name: ";
    
    // キーボードから "101 Bob" のように入力されるのを待つ
    std::cin >> id >> name; 

    std::cout << "User: " << name << " (ID: " << id << ")" << std::endl;
    // User: Bob (ID: 101)

    return 0;
}
```
