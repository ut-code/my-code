# 第10章: テンプレートによる汎用プログラミング

これまでの章では、`int`や`double`、あるいは自作の`Car`クラスのように、特定の型に対して処理を行う関数やクラスを作成してきました。しかし、プログラムが複雑になるにつれて、「型は違うけれど、行いたい処理は全く同じ」という状況が頻繁に発生します。例えば、2つの値の大きい方を返す`max`という関数を考えてみましょう。

```cpp
int max_int(int a, int b) {
    return (a > b) ? a : b;
}

double max_double(double a, double b) {
    return (a > b) ? a : b;
}
```

このように、型ごとに同じロジックの関数をいくつも用意するのは非効率的ですし、バグの温床にもなります。

この問題を解決するのが**テンプレート**です。テンプレートを使うと、具体的な型を "仮引数" のように扱い、様々な型に対応できる関数やクラスの「設計図」を作ることができます。このような、型に依存しないプログラミングスタイルを**ジェネリックプログラミング（汎用プログラミング）**と呼びます。

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

### テンプレートの仕組み

`template <typename T>`という部分が、この関数がテンプレートであることを示しています。

  * **`template <...>`**: テンプレートの宣言を開始します。
  * **`typename T`**: `T`という名前の「型引数」を定義しています。`typename`の代わりに`class`と書くこともできますが、意味は同じです。`T`は、このテンプレートが実際に使われるときに具体的な型（`int`や`double`など）に置き換えられます。

`main`関数で`max_value(10, 20)`のように呼び出すと、コンパイラは引数の型が`int`であることから、`T`を`int`だと自動的に判断します（これを**テンプレート引数推論**と呼びます）。そして、内部的に以下のような`int`版の関数を生成してくれるのです。

```cpp
// コンパイラが内部的に生成するコードのイメージ
int max_value(int a, int b) {
    return (a > b) ? a : b;
}
```

同様に、`double`や`std::string`で呼び出されれば、それぞれの型に対応したバージョンの関数が自動的に生成されます。これにより、私たちは一つの「設計図」を書くだけで、様々な型に対応できるのです。

## クラステンプレート: 様々な型のデータを格納できるクラスを作る

テンプレートの力は、クラスにも適用できます。これにより、様々な型のデータを格納できる汎用的なクラス（コンテナなど）を作成できます。例えば、「2つの値をペアで保持する」クラスを考えてみましょう。

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

### クラステンプレートの仕組み

関数テンプレートと基本的な考え方は同じですが、いくつか重要な違いがあります。

1.  **明示的な型指定**:
    関数テンプレートではコンパイラが型を推論してくれましたが、クラステンプレートの場合は、オブジェクトを生成する際に`Pair<int, std::string>`のように、開発者が明示的に型を指定する必要があります。

2.  **インスタンス化**:
    `Pair<int, std::string>`のように具体的な型を指定してオブジェクトを作ることを、テンプレートの**インスタンス化**と呼びます。コンパイラは、この指定に基づいて`T1`を`int`に、`T2`を`std::string`に置き換えた、以下のような新しいクラスを内部的に生成します。

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

    `Pair<int, std::string>`と`Pair<std::string, double>`は、コンパイルされると全く別のクラスとして扱われることに注意してください。

クラステンプレートは、C++の強力なライブラリである**STL (Standard Template Library)**の根幹をなす技術です。次章で学ぶ`vector`や`map`といった便利なコンテナは、すべてクラステンプレートで実装されています。

## この章のまとめ

  * **ジェネリックプログラミング**は、特定の型に縛られない、汎用的なコードを書くための手法です。
  * **テンプレート**は、C++でジェネリックプログラミングを実現するための機能です。
  * **関数テンプレート**を使うと、様々な型の引数に対して同じ処理を行う関数を定義できます。呼び出し時には、コンパイラが**テンプレート引数推論**によって型を自動的に決定します。
  * **クラステンプレート**を使うと、様々な型を扱える汎用的なクラスを定義できます。オブジェクトを生成する際には、`< >`内に具体的な型を**明示的に指定**してインスタンス化する必要があります。

テンプレートを使いこなすことで、コードの再利用性が劇的に向上し、より柔軟で堅牢なプログラムを記述できるようになります。

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

### 練習問題2: 汎用的なスタッククラス

後入れ先出し（LIFO）のデータ構造であるスタックを、クラステンプレート`SimpleStack`として実装してください。以下のメンバ関数を持つようにしてください。

  * `void push(T item)`: スタックに要素を追加する
  * `T pop()`: スタックの先頭から要素を取り出す
  * `bool is_empty()`: スタックが空かどうかを返す

`std::vector`を内部のデータ格納場所として利用して構いません。`int`型と`char`型で動作を確認してください。

```cpp:practice10_2.cpp
#include <iostream>
#include <vector>
#include <stdexcept>

// ここにクラステンプレート SimpleStack を実装してください

int main() {
    SimpleStack<int> int_stack;
    int_stack.push(10);
    int_stack.push(20);
    std::cout << "Popped from int_stack: " << int_stack.pop() << std::endl; // 20
    std::cout << "Popped from int_stack: " << int_stack.pop() << std::endl; // 10

    SimpleStack<char> char_stack;
    char_stack.push('A');
    char_stack.push('B');
    std::cout << "Popped from char_stack: " << char_stack.pop() << std::endl; // B
    std::cout << "Popped from char_stack: " << char_stack.pop() << std::endl; // A

    return 0;
}
```

```cpp-exec:practice10_2.cpp
Popped from int_stack: 20
Popped from int_stack: 10
Popped from char_stack: B
Popped from char_stack: A
```
