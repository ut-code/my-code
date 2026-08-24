---
id: cpp-templates-function-template
title: '関数テンプレート: intでもdoubleでもstringでも動く関数を作る'
level: 2
question:
  - 関数テンプレートのTは何でも指定できるのでしょうか
  - string型で比較する場合、どのようなルールで大きい小さいが判断されるのですか
  - intとdoubleなど、異なる型の引数を同時に渡した場合どうなりますか
  - テンプレートを使わない場合と比べて、具体的にどのようなメリットがありますか
  - typenameとclassは同じ意味とのことですが、どちらを使うのが一般的ですか
  - テンプレート引数推論が失敗することはありますか その場合どうなりますか
  - コンパイラが内部的に生成するコードとは、目に見えないところでコードが増えているということですか
  - もしTで比較できない型が来たらどうなりますか
  - 型引数はT一つだけでなく、複数指定することもできますか
term:
  - 関数テンプレート
  - テンプレート引数推論
---

## 関数テンプレート: intでもdoubleでもstringでも動く関数を作る

関数テンプレートを使うと、先ほどの`max`関数の問題をエレガントに解決できます。

```cpp:function_template_intro.cpp
#include <iostream>
#include <string>

// Tという名前で型を仮引数として受け取るテンプレートを宣言
template <typename T>
T max_value(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    // int型でmax_valueを呼び出す
    std::cout << "max(10, 20) = " << max_value(10, 20) << std::endl;

    // double型でmax_valueを呼び出す
    std::cout << "max(3.14, 1.41) = " << max_value(3.14, 1.41) << std::endl;

    // std::string型でも動作する！
    std::string s1 = "world";
    std::string s2 = "hello";
    std::cout << "max(\"world\", \"hello\") = " << max_value(s1, s2) << std::endl;

    return 0;
}
```

```cpp-exec:function_template_intro.cpp
max(10, 20) = 20
max(3.14, 1.41) = 3.14
max("world", "hello") = world
```

`template <typename T>`という部分が、この関数がテンプレートであることを示しています。

  * **`template <...>`**: テンプレートの宣言を開始します。
  * **`typename T`**: `T`という名前の「型引数」を定義しています。`typename`の代わりに`class`と書くこともできますが、意味は同じです。`T`は、このテンプレートが実際に使われるときに具体的な型（`int`や`double`など）に置き換えられます。

[[`main`関数]]で`max_value(10, 20)`のように呼び出すと、コンパイラは引数の型が`int`であることから、`T`を`int`だと自動的に判断します（これを**テンプレート引数推論**と呼びます）。そして、内部的に以下のような`int`版の関数を生成してくれるのです。

```cpp
// コンパイラが内部的に生成するコードのイメージ
int max_value(int a, int b) {
    return (a > b) ? a : b;
}
```

同様に、`double`や`std::string`で呼び出されれば、それぞれの型に対応したバージョンの関数が自動的に生成されます。これにより、私たちは一つの「設計図」を書くだけで、様々な型に対応できるのです。
