---
id: cpp-templates-practice1
title: '練習問題1: 汎用的なprint関数'
level: 3
question:
  - std::vector以外の配列、例えば生のCスタイル配列を渡しても動作しますか
  - print_elements関数の引数をconst参照にしないとどうなりますか
  - print_elements関数で、要素の間にカンマなどを入れたい場合はどうすればいいですか
  - std::coutで出力できないようなカスタムクラスをvectorに入れた場合どうなりますか
  - 空のvectorを渡した場合、print_elementsはどのように動作しますか
---

### 練習問題1: 汎用的なprint関数

任意の型の配列（ここでは`std::vector`を使いましょう）を受け取り、その要素をすべて画面に出力する関数テンプレート`print_elements`を作成してください。

```cpp:practice10_1.cpp
#include <iostream>
#include <vector>
#include <string>

// ここに関数テンプレート print_elements を実装してください


int main() {
    std::vector<int> v_int = {1, 2, 3, 4, 5};
    std::cout << "Integers: ";
    print_elements(v_int);

    std::vector<std::string> v_str = {"C++", "is", "powerful"};
    std::cout << "Strings: ";
    print_elements(v_str);

    return 0;
}
```

```cpp-exec:practice10_1.cpp
Integers: 1 2 3 4 5 
Strings: C++ is powerful 
```
