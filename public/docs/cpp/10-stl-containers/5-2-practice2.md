---
id: cpp-stl-containers-practice2
title: '練習問題2: 簡単な単語カウンター'
level: 3
question:
  - std::mapを使って単語の出現回数を数える基本的な流れを教えてください。
  - std::istringstreamを使って文字列から単語を抽出する詳しい方法を教えてください。
  - 単語をカウントする際に、大文字と小文字を区別しないようにするにはどうすれば良いですか。
  - 入力文字列に句読点が含まれていた場合、それらを無視して単語だけをカウントするにはどうすれば良いですか。
  - std::mapを使うと、なぜ自動的に単語がアルファベット順に表示されるのですか。
---

### 練習問題2: 簡単な単語カウンター

英文（スペースで区切られた単語の列）を読み込み、各単語が何回出現したかをカウントするプログラムを`std::map<std::string, int>`を使って作成してください。最後に、出現した全単語とその出現回数をアルファベット順に表示してください。

> 文字列を単語ごとに分割するには、以下のように`std::istringstream`を使うと便利です。
```cpp
#include <sstream>

std::string text = "this is a sample text";
std::istringstream iss(text);
std::string word;
while (iss >> word) {
    // wordには1単語ずつ格納される
}
```



```cpp:practice11_2.cpp
#include <iostream>
#include <map>
#include <string>
#include <sstream>

int main() {
    std::string text = "cpp is fun and cpp is powerful";


}
```
```cpp-exec:practice11_2.cpp
and: 1
cpp: 2
fun: 1
is: 2
powerful: 1
```
