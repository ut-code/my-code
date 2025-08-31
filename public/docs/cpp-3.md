# 第3章: 関数と参照

プログラムを構成する基本的な部品である「関数」について、C++ならではの引数の渡し方や便利な機能を学びます。他の言語で関数に慣れている方も、C++特有の概念である「参照」は特に重要なので、しっかり理解していきましょう。

## 関数の基本: 宣言と定義の分離

プログラム内の特定のタスクを実行するコードのまとまりを「**関数**」と呼びます。C++では、この関数を利用する前に、コンパイラがその関数の存在と使い方を知っている必要があります。そのため、「**宣言 (declaration)**」と「**定義 (definition)**」という2つの概念が重要になります。

  * **宣言 (Declaration)**: 関数の使い方（名前、引数、戻り値）をコンパイラに教える。本体の処理はない。
  * **定義 (Definition)**: 関数の具体的な処理内容を記述する。

### 関数の宣言

宣言の基本的な文法は以下の通りです。

```
戻り値の型 関数名(引数の型1 引数名1, 引数の型2 引数名2, ...);
```

  * **戻り値の型 (Return Type)**: 関数が処理を終えた後に返す値の型です。例えば、`int`型なら整数値を返します。
  * **関数名 (Function Name)**: 関数を呼び出すときに使う名前です。
  * **引数リスト (Parameter List)**: 関数が処理のために受け取る値です。`()`の中に、`型名 変数名`のペアをコンマで区切って記述します。引数が必要ない場合は `()` の中を空にします。
  * **セミコロン (`;`)**: 宣言の最後には必ずセミコロンを付けます。

### 戻り値がない場合: `void`型

関数が何も値を返す必要がない場合もあります。例えば、「画面にメッセージを表示するだけ」といった関数です。その場合、戻り値の型として `void` という特別なキーワードを使います。

```cpp
void printMessage(std::string message);
```

第2章で学んだように、`int`や`double`などの型は変数を定義するために使えましたが、`void`は「型がない」ことを示す特殊な型なので、`void my_variable;` のように変数を定義することはできません。あくまで関数の戻り値の型としてのみ使います。

### コンパイラは上から順に読む

C++のコンパイラはソースコードを上から下へと順番に読み込んでいきます。そのため、`main`関数のような場所で別の関数を呼び出すコードに出会ったとき、コンパイラはその時点ですでに関数の「宣言」または「定義」を読み込んでいる必要があります。

つまり、**`main`関数よりも上（前）に、呼び出す関数の定義か宣言のどちらかが書かれていなければコンパイルエラー**になります。

コードを整理するため、一般的には`main`関数の前に関数の「宣言」だけを記述し、`main`関数の後（または別のファイル）に具体的な処理内容である「定義」を記述するスタイルがよく使われます。

以下の例で確認してみましょう。

```cpp:declaration_definition.cpp
#include <iostream>
#include <string>

// 1. 関数の「宣言」(プロトタイプ宣言)
// これにより、main関数の中で greet や add を使ってもコンパイラはエラーを出さない。
void greet(std::string name); // 戻り値がない関数の宣言
int add(int a, int b);       // int型の値を返す関数の宣言

// main関数: プログラムの開始点
int main() {
    // 宣言があるので、これらの関数を呼び出すことができる
    greet("Taro");

    int result = add(5, 3);
    std::cout << "5 + 3 = " << result << std::endl;
    
    return 0;
}

// 2. 関数の「定義」(本体の実装)
// 実際の処理はここに書く。
void greet(std::string name) {
    std::cout << "Hello, " << name << "!" << std::endl;
}

int add(int a, int b) {
    return a + b;
}
```

```cpp-exec:declaration_definition.cpp
Hello, Taro!
5 + 3 = 8
```

この例では、`main`関数が始まる前に`greet`関数と`add`関数の宣言をしています。これにより、`main`関数内でこれらの関数を自由な順序で呼び出すことができ、コードの可読性が向上します。関数の具体的な実装は`main`関数の後にまとめて記述することで、「プログラムの全体的な流れ（`main`）」と「各部分の具体的な処理（関数の定義）」を分離して考えることができます。

## 引数の渡し方

C++の関数の引数の渡し方には、主に **「値渡し」「ポインタ渡し」「参照渡し」** の3つがあります。ここでは特にC++特有の「参照渡し」に注目します。

### 値渡し (Pass by Value)

引数に渡された値が**コピー**されて、関数内のローカル変数として扱われます。関数内でその値を変更しても、呼び出し元の変数は影響を受けません。これは多くの言語で標準的な引数の渡し方です。

```cpp:pass_by_value.cpp
#include <iostream>

void tryToChange(int x) {
    x = 100; // 関数内のコピーが変更されるだけ
    std::cout << "Inside function: x = " << x << std::endl;
}

int main() {
    int my_number = 10;
    std::cout << "Before function call: my_number = " << my_number << std::endl;
    tryToChange(my_number);
    std::cout << "After function call: my_number = " << my_number << std::endl; // 10のまま変わらない
    return 0;
}
```

```cpp-exec:pass_by_value.cpp
Before function call: my_number = 10
Inside function: x = 100
After function call: my_number = 10
```

  * **長所**: 呼び出し元の変数が不用意に書き換えられることがなく、安全です。
  * **短所**: 大きなオブジェクト（例えば、たくさんの要素を持つ `std::vector` など）を渡すと、コピーのコストが無視できなくなり、パフォーマンスが低下する可能性があります。

### ポインタ渡し (Pass by Pointer)

これはC言語から引き継がれた伝統的な方法で、変数のメモリアドレスを渡します。ポインタ（アドレスを指し示す変数）を介して、呼び出し元の変数を直接変更できます。詳細は第4章で詳しく学びますが、ここでは簡単に紹介します。

```cpp:pass_by_pointer.cpp
#include <iostream>

// ポインタを受け取るには、型名の後にアスタリスク * を付ける
void changeWithPointer(int* ptr) {
    *ptr = 100; // アスタリスク * でポインタが指す先の値にアクセス
}

int main() {
    int my_number = 10;
    // 変数のアドレスを渡すには、アンパサンド & を付ける
    changeWithPointer(&my_number);
    std::cout << "After function call: my_number = " << my_number << std::endl; // 100に変わる
    return 0;
}
```

```cpp-exec:pass_by_pointer.cpp
After function call: my_number = 100
```

ポインタは強力ですが、`nullptr`（どこも指していないポインタ）の可能性を考慮する必要があるなど、扱いが少し複雑です。

### 参照渡し (Pass by Reference)

C++の大きな特徴の一つが**参照 (Reference)** です。参照は、既存の変数に**別名**を付ける機能と考えることができます。。

関数に参照を渡すと、値のコピーは発生せず、関数内の引数は呼び出し元の変数の「別名」として振る舞います。そのため、関数内での操作が呼び出し元の変数に直接反映されます。構文もポインタよりずっとシンプルです。

```cpp:pass_by_reference.cpp
#include <iostream>

// 参照を受け取るには、型名の後にアンパサンド & を付ける
void changeWithReference(int& ref) {
    ref = 100; // 通常の変数と同じように扱うだけ
}

int main() {
    int my_number = 10;
    changeWithReference(my_number); // 呼び出し側は特別な記号は不要
    std::cout << "After function call: my_number = " << my_number << std::endl; // 100に変わる
    return 0;
}
```

```cpp-exec:pass_by_reference.cpp
After function call: my_number = 100
```


  * **長所**: コピーが発生しないため効率的です。また、構文がシンプルで、呼び出し元の変数を変更する意図が明確になります。
  * **注意点**: 関数内で値を変更できるため、意図しない書き換えに注意が必要です。

#### `const`参照: 効率と安全性の両立

「大きなオブジェクトを渡したいけど、コピーは避けたい。でも関数内で値を変更されたくはない」という場合に最適なのが **`const`参照** です。

```cpp:const_reference.cpp
#include <iostream>
#include <string>

// const参照で受け取ることで、コピーを防ぎつつ、
// messageが関数内で変更されないことを保証する
void printMessage(const std::string& message) {
    // message = "changed!"; // この行はコンパイルエラーになる！
    std::cout << message << std::endl;
}

int main() {
    std::string greeting = "Hello, C++ world! This is a long string.";
    printMessage(greeting);
    return 0;
}
```

```cpp-exec:const_reference.cpp
Hello, C++ world! This is a long string.
```

**C++のベストプラクティス**:

  * `int`や`double`などの小さな基本型は**値渡し**。
  * 関数内で引数を**変更する必要がある**場合は**参照渡し (`&`)**。
  * 大きなオブジェクトを渡すが**変更はしない**場合は **`const`参照 (`const &`)** を使う。

## 関数のオーバーロード

C++では、**同じ名前で引数の型や個数が異なる関数を複数定義**できます。これを**オーバーロード (Overload)** と呼びます。コンパイラは、関数呼び出し時の引数の型や個数を見て、どの関数を呼び出すべきかを自動的に判断してくれます。

```cpp:overloading.cpp
#include <iostream>
#include <string>

// int型の引数を1つ取るprint関数
void print(int value) {
    std::cout << "Integer: " << value << std::endl;
}

// string型の引数を1つ取るprint関数
void print(const std::string& value) {
    std::cout << "String: " << value << std::endl;
}

// double型とint型の引数を取るprint関数
void print(double d_val, int i_val) {
    std::cout << "Double: " << d_val << ", Integer: " << i_val << std::endl;
}

int main() {
    print(123);
    print("hello");
    print(3.14, 42);
    return 0;
}
```

```cpp-exec:overloading.cpp
Integer: 123
String: hello
Double: 3.14, Integer: 42
```

これにより、`printInt`, `printDouble` のように別々の名前を付ける必要がなくなり、コードが直感的で読みやすくなります。

注意点として、戻り値の型が違うだけではオーバーロードはできません。あくまで引数のリストが異なる必要があります。

## デフォルト引数

関数の引数に、あらかじめ**デフォルト値**を設定しておくことができます。これにより、関数を呼び出す際に該当する引数を省略できるようになります。

デフォルト引数は、引数リストの**右側**から設定する必要があります。一度デフォルト引数を設定したら、それより右側にある引数もすべてデフォルト引数を持たなければなりません。

```cpp:default_arguments.cpp
#include <iostream>
#include <string>

// 第2引数 greeting にデフォルト値を設定
void greet(const std::string& name, const std::string& greeting = "Hello") {
    std::cout << greeting << ", " << name << "!" << std::endl;
}

int main() {
    // 第2引数を省略。デフォルト値 "Hello" が使われる
    greet("Alice");

    // 第2引数を指定。指定した値 "Hi" が使われる
    greet("Bob", "Hi");

    return 0;
}
```

```cpp-exec:default_arguments.cpp
Hello, Alice!
Hi, Bob!
```

## この章のまとめ

この章では、C++の関数に関する基本的ながらも重要な機能を学びました。

  * **関数の宣言と定義の分離**: プログラムの構造を整理し、分割コンパイルを可能にするための基本です。
  * **引数の渡し方**:
      * **値渡し**: 引数のコピーを作成し、元の変数を保護します。
      * **参照渡し (`&`)**: 変数の「別名」を渡し、コピーのコストをなくします。呼び出し元の変数を変更するため、または効率化のために使います。
      * **`const`参照渡し (`const&`)**: 効率的でありながら、意図しない変更を防ぐためのC++の定石です。
  * **関数のオーバーロード**: 同じ名前で引数リストの異なる関数を定義でき、文脈に応じた適切な関数が自動で選ばれます。
  * **デフォルト引数**: 関数の引数を省略可能にし、柔軟な関数呼び出しを実現します。

特に「参照」は、この先のC++プログラミングで頻繁に登場する極めて重要な概念です。値渡しとの違い、そして`const`参照との使い分けをしっかりマスターしましょう。

### 練習問題1: 値の交換

2つの`int`型変数の値を交換する関数 `swap` を作成してください。この関数は、呼び出し元の変数の値を直接変更できるように、**参照渡し**を使って実装してください。

```cpp:practice3_1.cpp
#include <iostream>

// ここにswap関数を実装してください


// main関数
int main() {
    int a = 10;
    int b = 20;
    std::cout << "Before: a = " << a << ", b = " << b << std::endl;
    swap(a, b);
    std::cout << "After: a = " << a << ", b = " << b << std::endl;
    return 0;
}
```

```cpp-exec:practice3_1.cpp
(期待される実行結果)
Before: a = 10, b = 20
After: a = 20, b = 10
```

### 問題2: 図形の面積

**関数のオーバーロード**を使い、正方形と長方形の面積を計算する `calculate_area` という名前の関数を実装してください。

1.  引数が1つ (`int side`) の場合は、正方形の面積 (side✕side) を計算して返す。
2.  引数が2つ (`int width`, `int height`) の場合は、長方形の面積 (width✕height) を計算して返す。

作成した関数を`main`関数から呼び出し、結果が正しく表示されることを確認してください。

```cpp:practice3_2.cpp
#include <iostream>

```

```cpp-exec:practice3_2.cpp
```
