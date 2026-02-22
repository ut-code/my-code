---
id: cpp-types-control-4-auto
title: autoによる型推論
level: 3
---

### `auto`による型推論

C++11から導入された`auto`キーワードを使うと、コンパイラが初期化式から変数の型を自動で推論してくれます。これにより、特に型名が長い場合にコードを簡潔に書くことができます。

```cpp
// autoを使わない場合
std::vector<int>::iterator it = my_vector.begin();

// autoを使う場合
auto it = my_vector.begin(); // コンパイラが it の型を std::vector<int>::iterator と推論してくれる
```

ただし、`auto`はあくまで「型を書く手間を省く」ものであり、変数が型を持たないわけではありません（動的型付け言語とは異なります）。初期化と同時に使う必要があり、型が明確な場面で適切に使うことが推奨されます。

```cpp
auto x = 10;       // x は int型になる
auto y = 3.14;     // y は double型になる
auto z = "hello";  // z は const char* (C言語スタイルの文字列) になるので注意
```
