---
id: cpp-templates-class-template
title: 'クラステンプレート: 様々な型のデータを格納できるクラスを作る'
level: 2
question:
  - クラステンプレートのT1とT2は同じ型を指定しても問題ないですか
  - p1 = p2; がコンパイルエラーになる理由をもう少し詳しく教えてください
  - main関数でのPairオブジェクトの生成時、型を明示的に指定しないとどうなりますか
  - Pairクラスで、例えば3つの値を保持するようにはできないのですか
  - print関数で各型が正しく出力されるのはなぜですか
  - クラステンプレートで関数テンプレートのように型推論を使うことはできないのですか
  - テンプレートのインスタンス化とは、メモリ上に具体的なクラスが作成されることですか
  - コンパイラが生成するクラスの名前は実際にはどうなるのか、確認する方法はありますか
  - 異なる型でインスタンス化されたクラスは、実行時に本当に全く別のものとして扱われるのですか
  - STLがクラステンプレートで実装されているとのことですが、具体的にどのSTLコンテナがクラステンプレートなのですか
term:
  - クラステンプレート
---

## クラステンプレート: 様々な型のデータを格納できるクラスを作る

テンプレートの力は、[[クラス]]にも適用できます。これにより、様々な型のデータを格納できる汎用的な[[クラス]]（コンテナなど）を作成できます。例えば、「2つの値をペアで保持する」[[クラス]]を考えてみましょう。

```cpp:class_template_intro.cpp
#include <iostream>
#include <string>

// 2つの型 T1, T2 を引数に取るクラステンプレート
template <typename T1, typename T2>
class Pair {
public:
    T1 first;
    T2 second;

    // コンストラクタ
    Pair(T1 f, T2 s) : first(f), second(s) {}

    void print() {
        std::cout << "(" << first << ", " << second << ")" << std::endl;
    }
};

int main() {
    // T1=int, T2=std::string としてPairクラスのオブジェクトを生成
    Pair<int, std::string> p1(1, "apple");
    p1.print();

    // T1=std::string, T2=double としてPairクラスのオブジェクトを生成
    Pair<std::string, double> p2("pi", 3.14159);
    p2.print();
    
    // 違う型のPair同士は当然、別の型として扱われる
    // p1 = p2; // これはコンパイルエラーになる

    return 0;
}
```

```cpp-exec:class_template_intro.cpp
(1, apple)
(pi, 3.14159)
```

関数テンプレートと基本的な考え方は同じですが、いくつか重要な違いがあります。

1.  **明示的な型指定**:
    関数テンプレートではコンパイラが型を推論してくれましたが、クラステンプレートの場合は、[[オブジェクト]]を生成する際に`Pair<int, std::string>`のように、開発者が明示的に型を指定する必要があります。

2.  **インスタンス化**:
    `Pair<int, std::string>`のように具体的な型を指定して[[オブジェクト]]を作ることを、テンプレートの**インスタンス化**と呼びます。コンパイラは、この指定に基づいて`T1`を`int`に、`T2`を`std::string`に置き換えた、以下のような新しい[[クラス]]を内部的に生成します。

    ```cpp
    // コンパイラが内部的に生成するクラスのイメージ
    class Pair_int_string { // クラス名は実際には異なります
    public:
        int first;
        std::string second;

        Pair_int_string(int f, std::string s) : first(f), second(s) {}

        void print() {
            std::cout << "(" << first << ", " << second << ")" << std::endl;
        }
    };
    ```

    `Pair<int, std::string>`と`Pair<std::string, double>`は、[[コンパイル]]されると全く別の[[クラス]]として扱われることに注意してください。

クラステンプレートは、C++の強力なライブラリである**STL (Standard Template Library)**の根幹をなす技術です。[[./next]]で学ぶ`vector`や`map`といった便利なコンテナは、すべてクラステンプレートで実装されています。
