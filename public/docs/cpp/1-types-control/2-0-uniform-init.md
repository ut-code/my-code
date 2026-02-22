---
id: cpp-types-uniform-init
title: '変数の初期化：ユニフォーム初期化 {}'
level: 2
---

## 変数の初期化：ユニフォーム初期化 `{}`

C++には変数を初期化する方法がいくつもありますが、C++11以降では **波括弧 `{}` を使った初期化（ユニフォーム初期化）** が推奨されています。

なぜ `{}` が良いのでしょうか？ それは、**縮小変換（Narrowing Conversion）** を防げるからです。例えば、少数のデータを整数型変数に無理やり入れようとした時、`=` なら黙って切り捨てられますが、`{}` ならコンパイルエラーにしてくれます。

```cpp:initialization.cpp
#include <iostream>

int main() {
    // 推奨：波括弧による初期化
    int age{25};           // int age = 25; と同じだがより安全
    double weight{65.5};
    bool is_student{false};

    // 縮小変換の防止（コメントアウトを外すとコンパイルエラーになります）
    // int height{170.5}; // エラー！ doubleからintへの情報の欠落を防ぐ

    // 従来の方法（＝を使う）も間違いではありませんが、警告が出ないことがあります
    int rough_height = 170.9; // 170に切り捨てられる（エラーにならない）

    std::cout << "Alice is " << age << " years old." << std::endl;
    std::cout << "Height (rough): " << rough_height << std::endl;

    return 0;
}
```

```cpp-exec:initialization.cpp
Alice is 25 years old.
Height (rough): 170
```
