---
id: cpp-stl-algorithms-practice1
title: '練習問題1: 文字列の長さでソート'
level: 3
---

### 練習問題1: 文字列の長さでソート

`std::vector<std::string>` を用意し、格納されている文字列を、文字数が短い順にソートして、結果を出力するプログラムを作成してください。`std::sort` とラムダ式を使用してください。

**ヒント**: ラムダ式は2つの文字列を引数に取り、1つ目の文字列の長さが2つ目の文字列の長さより短い場合に `true` を返すように実装します。


```cpp:practice12_1.cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<std::string> words = {"apple", "banana", "kiwi", "cherry", "fig", "grape"};

    return 0;
}
```

```cpp-exec:practice12_1.cpp
fig kiwi grape apple banana cherry 
```
