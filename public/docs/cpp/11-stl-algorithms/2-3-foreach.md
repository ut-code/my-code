---
id: cpp-stl-algorithms-foreach
title: 'std::for_each: 各要素に処理を適用する'
level: 3
question:
  - std::for_eachと通常のforループで要素を処理する場合、どちらを使うべきですか？
  - print_functionのような関数は、どこに定義すれば良いのですか？
  - std::for_eachを使ってコンテナの要素の値を変更することはできますか？
---

### `std::for_each`: 各要素に処理を適用する

指定された範囲の全ての要素に対して、特定の関数（処理）を適用します。ループを書くよりも意図が明確になる場合があります。

```cpp
// 3番目の引数に関数を渡す
std::for_each(numbers.begin(), numbers.end(), print_function);
```

ここで「特定の処理」をその場で手軽に記述する方法が**ラムダ式**です。
