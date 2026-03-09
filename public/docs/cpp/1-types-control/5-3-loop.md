---
id: cpp-control-loop
title: ループ構文
level: 3
question:
  - for (int i = 3; i > 0; --i) の各部分が何を表しているのか、もう一度説明してください。
  - '--i と i-- は何が違うのですか？どちらを使っても良いのですか？'
  - whileループの具体的な使い方の例も見てみたいです。
  - 無限ループを防ぐためにはどうすれば良いですか？
  - ループを途中で抜け出す方法や、次のイテレーションに進む方法はC++にもありますか？
---

### ループ構文

`while`, `for` も標準的です。

```cpp:control-loop.cpp
#include <iostream>

int main() {
    // --- 基本的なforループ ---
    std::cout << "Countdown: ";
    for (int i = 3; i > 0; --i) {
        std::cout << i << " ";
    }
    std::cout << "Start!" << std::endl;

    return 0;
}
```

```cpp-exec:control-loop.cpp
Countdown: 3 2 1 Start!
```
