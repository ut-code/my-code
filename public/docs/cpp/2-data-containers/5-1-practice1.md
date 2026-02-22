---
id: cpp-data-containers-practice1
title: '練習問題1: 数値リストの統計'
level: 3
---

### 練習問題1: 数値リストの統計

`std::vector<int>` を使用して、好きな整数を5つほど格納してください（コード内で直接初期化して構いません）。
その後、範囲ベース for ループを使用して、その数値の「合計」と「最大値」を求めて出力するプログラムを作成してください。

```cpp:practice3_1.cpp
#include <iostream>
#include <vector>

int main() {
    // ここに整数リストを初期化してください
    std::vector<int> numbers = {12, 45, 7, 23, 89};


    // 結果を出力
    std::cout << "Sum: " << sum << std::endl;
    std::cout << "Max Value: " << max_value << std::endl;

    return 0;
}
```

```cpp-exec:practice3_1.cpp
Sum: 176
Max Value: 89
```
