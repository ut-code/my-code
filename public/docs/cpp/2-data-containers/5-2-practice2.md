---
id: cpp-data-containers-practice2
title: '練習問題2: 単語のフィルタリング'
level: 3
---

### 練習問題2: 単語のフィルタリング

以下の単語リスト `words` の中から、**文字数（長さ）が5文字より大きい単語だけ**を選んで表示するプログラムを作成してください。
（ヒント：`std::string` の `.size()` または `.length()` メソッドと `if` 文を使用します）

```cpp:practice3_2.cpp
#include <iostream>
#include <vector>
#include <string>

int main() {
    std::vector<std::string> words = {"Apple", "Banana", "Cherry", "Date", "Elderberry"};

    std::cout << "Words longer than 5 characters:" << std::endl;

    // ここにコードを書く

    return 0;
} 
```

```cpp-exec:practice3_2.cpp
Words longer than 5 characters:
Banana
Cherry
Elderberry
```
