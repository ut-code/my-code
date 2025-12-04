# 第5章: 関数の設計とデータの受け渡し：コピー、参照、ポインタ

前章（第4章）では、C++のメモリモデルの核心である「ポインタ」について学びました。ポインタは強力ですが、構文が複雑になりがちで、バグの温床にもなりえます。

C++では、C言語から受け継いだポインタに加え、より安全で直感的な**「参照（Reference）」**という概念が導入されています。本章では、関数の設計を通して、この「参照」がいかに強力な武器になるかを学びます。「データをどう渡すか」は、C++のパフォーマンスと設計の良し悪しを決める最も重要な要素の一つです。

## 関数の宣言と定義

PythonやJavaScriptのような言語では、関数をどこに書いても（あるいは実行時に解決されて）呼び出せることが多いですが、C++のコンパイラはコードを上から下へと一直線に読みます。そのため、**「使用する前に、その関数が存在すること」**をコンパイラに知らせる必要があります。

### プロトタイプ宣言

関数を `main` 関数の後に定義したい場合、事前に「こういう名前と引数の関数がありますよ」と宣言だけしておく必要があります。これを**プロトタイプ宣言**と呼びます。

```cpp:declaration_intro.cpp
#include <iostream>

// プロトタイプ宣言
// 戻り値の型 関数名(引数の型1 引数名1, 引数の型2 引数名2, ...);
// 本体（{}の中身）は書かず、セミコロンで終わる
void greet(int times);

int main() {
    std::cout << "main関数開始" << std::endl;
    
    // 定義は下にあるが、宣言があるので呼び出せる
    greet(3);
    
    return 0;
}

// 関数の定義
void greet(int times) {
    for (int i = 0; i < times; ++i) {
        std::cout << "Hello C++!" << std::endl;
    }
}
```

```cpp-exec:declaration_intro.cpp
main関数開始
Hello C++!
Hello C++!
Hello C++!
```

実際の開発では、プロトタイプ宣言をヘッダーファイル（`.h`）に書き、定義をソースファイル（`.cpp`）に書くことで、大規模なプログラムを管理します（これについては次章で詳しく解説します）。

### 戻り値がない場合: `void`型

関数が何も値を返す必要がない場合もあります。例えば、「画面にメッセージを表示するだけ」といった関数です。その場合、戻り値の型として `void` という特別なキーワードを使います。

```cpp
void printMessage(std::string message);
```

第2章で学んだように、`int`や`double`などの型は変数を定義するために使えましたが、`void`は「型がない」ことを示す特殊な型なので、`void my_variable;` のように変数を定義することはできません。あくまで関数の戻り値の型としてのみ使います。

## 引数の渡し方（パフォーマンスと安全性）

ここが本章のハイライトです。他の言語では言語仕様として決まっていることが多い引数の渡し方を、C++ではプログラマが意図的に選択できます。

### 1\. 値渡し (Pass by Value)

特に何も指定しない場合のデフォルトです。変数の**コピー**が作成され、関数に渡されます。

  * **メリット:** 安全。関数内で値を変更しても、呼び出し元の変数には影響しない。
  * **デメリット:** コストが高い。巨大な配列やオブジェクトを渡す際、丸ごとコピーするためメモリと時間を浪費する。

<!-- end list -->

```cpp:pass_by_value.cpp
#include <iostream>

// 値渡し：xは呼び出し元のコピー
void attemptUpdate(int x) {
    x = 100; // コピーを変更しているだけ
    std::cout << "関数内: " << x << " (アドレス: " << &x << ")" << std::endl;
}

int main() {
    int num = 10;
    std::cout << "呼び出し前: " << num << " (アドレス: " << &num << ")" << std::endl;
    
    attemptUpdate(num);
    
    // numは変わっていない
    std::cout << "呼び出し後: " << num << std::endl;
    return 0;
}
```

```cpp-exec:pass_by_value.cpp
呼び出し前: 10 (アドレス: 0x7ff...)
関数内: 100 (アドレス: 0x7ff...)  <-- アドレスが違う＝別の領域（コピー）
呼び出し後: 10
```

### 2\. ポインタ渡し (Pass by Pointer)

C言語からある手法です。第4章で学んだポインタ（アドレス）を渡します。

  * **メリット:** コピーが発生しない（アドレス値のコピーのみ）。呼び出し元のデータを変更できる。
  * **デメリット:** 呼び出す際に `&` を付ける必要がある。関数内で `*` や `->` を使う必要があり、構文が汚れる。`nullptr` チェックが必要になることがある。

<!-- end list -->

```cpp:pass_by_pointer.cpp
#include <iostream>

// ポインタ渡し：アドレスを受け取る
void updateByPointer(int* ptr) {
    if (ptr != nullptr) {
        *ptr = 200; // アドレスの指す先を書き換える
    }
}

int main() {
    int num = 10;
    
    // アドレスを渡す
    updateByPointer(&num);
    
    std::cout << "ポインタ渡し後: " << num << std::endl;
    return 0;
}
```

```cpp-exec:pass_by_pointer.cpp
ポインタ渡し後: 200
```

### 3\. 参照渡し (Pass by Reference)

C++の真骨頂です。**「参照（Reference）」**とは、既存の変数に別の名前（エイリアス）をつける機能です。引数の型に `&` を付けるだけで宣言できます。

  * **メリット:** コピーが発生しない。**構文は「値渡し」と同じように書ける**（`*`や`&`を呼び出し側で意識しなくていい）。`nullptr` になることがないため安全性が高い。
  * **デメリット:** 関数内で値を変更すると、呼び出し元も変わる（意図しない変更に注意）。

<!-- end list -->

```cpp:pass_by_ref.cpp
#include <iostream>

// 参照渡し：引数に & をつける
// ref は呼び出し元の変数の「別名」となる
void updateByRef(int& ref) {
    ref = 300; // 普通の変数のように扱えるが、実体は呼び出し元
}

int main() {
    int num = 10;
    
    // 値渡しと同じように呼び出せる（&num と書かなくていい！）
    updateByRef(num);
    
    std::cout << "参照渡し後: " << num << std::endl;
    return 0;
}
```

```cpp-exec:pass_by_ref.cpp
参照渡し後: 300
```

### 4\. const 参照渡し (Pass by const Reference)

これが**C++で最も頻繁に使われるパターン**です。「コピーはしたくない（重いから）。でも、関数内で書き換えられたくもない」という要求を満たします。

  * **構文:** `const 型& 引数名`
  * **用途:** `std::string`、`std::vector`、クラスのオブジェクトなど、サイズが大きくなる可能性があるデータ。

<!-- end list -->

```cpp:const_ref.cpp
#include <iostream>
#include <string>
#include <vector>

// const参照渡し
// textの実体はコピーされないが、書き換えも禁止される
void printMessage(const std::string& text) {
    // text = "Modified"; // コンパイルエラーになる
    std::cout << "Message: " << text << std::endl;
}

int main() {
    std::string bigData = "This is a potentially very large string...";
    
    // コピーコストゼロで渡す
    printMessage(bigData);
    
    return 0;
}
```

```cpp-exec:const_ref.cpp
Message: This is a potentially very large string...
```

> **ガイドライン:**
>
>   * `int` や `double` などの基本型 → **値渡し** でOK。
>   * 変更させたいデータ → **参照渡し** (`T&`)。
>   * 変更しないがサイズが大きいデータ（string, vectorなど） → **const参照渡し** (`const T&`)。

## 関数の機能拡張

C++には関数をより柔軟に使うための機能が備わっています。

### オーバーロード (Function Overloading)

引数の**型**や**数**が異なれば、同じ名前の関数を複数定義できます。C言語では関数名はユニークである必要がありましたが、C++では「名前＋引数リスト」で区別されます。

```cpp:overloading.cpp
#include <iostream>
#include <string>

// int型を受け取る関数
void print(int i) {
    std::cout << "Integer: " << i << std::endl;
}

// double型を受け取る関数（同名）
void print(double d) {
    std::cout << "Double: " << d << std::endl;
}

// 文字列を受け取る関数（同名）
void print(const std::string& s) {
    std::cout << "String: " << s << std::endl;
}

int main() {
    print(42);
    print(3.14);
    print("Overloading");
    return 0;
}
```

```cpp-exec:overloading.cpp
Integer: 42
Double: 3.14
String: Overloading
```

### デフォルト引数

引数が省略された場合に使われるデフォルト値を設定できます。これはプロトタイプ宣言（または最初にコンパイラが見る定義）に記述します。
※デフォルト引数は**後ろの引数から順に**設定する必要があります。

```cpp:default_args.cpp
#include <iostream>

// power: 指数を省略すると2乗になる
// verbose: 詳細出力を省略するとfalseになる
int power(int base, int exponent = 2, bool verbose = false) {
    int result = 1;
    for (int i = 0; i < exponent; ++i) {
        result *= base;
    }
    
    if (verbose) {
        std::cout << base << " の " << exponent << " 乗を計算しました。" << std::endl;
    }
    return result;
}

int main() {
    std::cout << power(3) << std::endl;          // 3^2, verbose=false
    std::cout << power(3, 3) << std::endl;       // 3^3, verbose=false
    std::cout << power(2, 4, true) << std::endl; // 2^4, verbose=true
    return 0;
}
```

```cpp-exec:default_args.cpp
9
27
2 の 4 乗を計算しました。
16
```

## この章のまとめ

  * **プロトタイプ宣言**を使うことで、関数の定義順序に依存せずに記述できる。
  * **値渡し**は安全だが、大きなオブジェクトではコピーコストがかかる。
  * **参照渡し (`&`)** は、ポインタのような効率性を持ちながら、変数のエイリアスとして直感的に扱える。
  * **`const` 参照渡し (`const T&`)** は、大きなデータを「読み取り専用」で効率的に渡すC++の定石である。
  * **オーバーロード**により、同じ名前で異なる引数を受け取る関数を作れる。
  * **デフォルト引数**で、呼び出し時の記述を省略できる。

## 練習問題1: 値の入れ替え（Swap）

2つの `int` 変数を受け取り、その値を入れ替える関数 `mySwap` を作成してください。
ポインタではなく、**参照渡し**を使用してください。

```cpp:practice5_1.cpp
#include <iostream>

// ここにmySwap関数を実装してください


// main関数
int main() {
    int a = 10;
    int b = 20;
    std::cout << "Before: a = " << a << ", b = " << b << std::endl;
    mySwap(a, b);
    std::cout << "After: a = " << a << ", b = " << b << std::endl;
    return 0;
}
```

```cpp-exec:practice5_1.cpp
(期待される実行結果)
Before: a = 10, b = 20
After: a = 20, b = 10
```

### 問題2：ベクター統計

`std::vector<int>` を受け取り、その中の「最大値」を見つけて返す関数 `findMax` を作成してください。
ただし、以下の条件を守ってください。

1.  ベクターはコピーされないようにしてください（**参照渡し**）。
2.  関数内でベクターの内容が変更されないことを保証してください（**const**）。
3.  ベクターが空の場合は `0` を返すなどの処理を入れてください。

<!-- end list -->

```cpp:practice5_2.cpp
#include <iostream>
#include <vector>
#include <algorithm> // maxを使うなら便利ですが、for文でも可

// ここに findMax を作成


int main() {
    std::vector<int> data = {10, 5, 8, 42, 3};
    std::cout << "Max: " << findMax(data) << std::endl;
    return 0;
}
```
```cpp-exec:practice5_2.cpp
Max: 42
```
