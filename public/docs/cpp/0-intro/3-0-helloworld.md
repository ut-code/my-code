---
id: cpp-intro-helloworld
title: 最初のプログラム
level: 2
question:
  - なぜファイル名はmain.cppである必要があるのですか？他の名前ではだめですか？
  - コードの各行が何をしているのかまだ理解できません。
  - //は何のために使われていますか？
---

## 最初のプログラム

環境が整ったら、さっそく定番の "Hello, World\!" プログラムを作成し、C++開発の流れを掴みましょう。

`main.cpp` という名前でファイルを作成し、以下のコードを記述してください。

```cpp:main.cpp
// 画面に "Hello, World!" と表示するプログラム

#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```
