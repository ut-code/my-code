# 第3章: データ集合とモダンな操作：「配列」ではなく「コンテナ」としてデータを扱う

他の言語（Python, JavaScript, C\#など）経験者がC++を学び始めるとき、最も躓きやすいのが「文字や配列の扱い」です。古いC言語の教科書では、ポインタ操作やメモリ管理が必須となる「Cスタイル」のやり方から入ることが多いのですが、**現代の実務的なC++（モダンC++）では、もっと安全で便利な「クラス（コンテナ）」を使います。**

この章では、ポインタの複雑な話を抜きにして、他の高級言語と同じくらい直感的にデータを扱えるツールを紹介します。

## 文字列の扱い：std::string

C言語では文字列を扱うために `char*` や `char[]` を使い、ヌル終端文字 `\0` を意識する必要がありました。これはバグの温床です。
C++では、標準ライブラリの `std::string` クラスを使用します。これはPythonの `str` や Javaの `String` のように直感的に扱えます。

### 主な機能

  * **代入・初期化**: 文字列リテラルをそのまま代入可能。
  * **結合**: `+` 演算子で結合可能。
  * **比較**: `==`, `!=` などで中身の文字列比較が可能（C言語の `strcmp` は不要）。
  * **サイズ取得**: `.size()` または `.length()` メソッドを使用。

<!-- end list -->

```cpp:string_demo.cpp
#include <iostream>
#include <string> // std::stringを使うために必要

int main() {
    // 初期化
    std::string greeting = "Hello";
    std::string target = "World";

    // 文字列の結合
    std::string message = greeting + ", " + target + "!";

    // 出力
    std::cout << message << std::endl;

    // 長さの取得
    std::cout << "Length: " << message.size() << std::endl; // .length()でも同じ

    // 文字列の比較
    if (greeting == "Hello") {
        std::cout << "Greeting matches 'Hello'." << std::endl;
    }

    // 特定の文字へのアクセス（配列のようにアクセス可能）
    message[0] = 'h'; // 先頭を小文字に変更
    std::cout << "Modified: " << message << std::endl;

    return 0;
}
```

```cpp-exec:string_demo.cpp
Hello, World!
Length: 13
Greeting matches 'Hello'.
Modified: hello, World!
```

> **Note:** `std::string` は必要に応じて自動的にメモリを拡張します。プログラマがメモリ確保（malloc/free）を気にする必要はありません。

## 可変長配列：std::vector

「データの個数が事前にわからない」「途中でデータを追加したい」という場合、C++で最も頻繁に使われるのが `std::vector` です。これは「動的配列」や「可変長配列」と呼ばれ、Pythonの `list` や Javaの `ArrayList` に相当します。

### 基本操作

  * **宣言**: `std::vector<型> 変数名;`
  * **追加**: `.push_back(値)` で末尾に追加。
  * **アクセス**: `変数名[インデックス]` または `.at(インデックス)`。
  * **サイズ**: `.size()`。

<!-- end list -->

```cpp:vector_demo.cpp
#include <iostream>
#include <vector> // std::vectorを使うために必要

int main() {
    // 整数を格納するvector（初期サイズは0）
    std::vector<int> numbers;

    // データの追加
    numbers.push_back(10);
    numbers.push_back(20);
    numbers.push_back(30);

    // サイズの確認
    std::cout << "Size: " << numbers.size() << std::endl;

    // 要素へのアクセス
    std::cout << "First element: " << numbers[0] << std::endl;
    
    // .at() を使うと範囲外アクセスの時に例外を投げてくれる（安全）
    try {
        std::cout << numbers.at(100) << std::endl; // 範囲外
    } catch (const std::out_of_range& e) {
        std::cout << "Error: " << e.what() << std::endl;
    }

    // 初期化リストを使った宣言（C++11以降）
    std::vector<double> prices = {10.5, 20.0, 33.3};
    std::cout << "Price list size: " << prices.size() << std::endl;

    return 0;
}
```

```cpp-exec:vector_demo.cpp
Size: 3
First element: 10
Error: vector::_M_range_check: __n (which is 100) >= this->size() (which is 3)
Price list size: 3
```

## 固定長配列：std::array

データの個数が決まっている場合（例えば、3次元座標、RGB値、固定バッファなど）は、`std::vector` よりも `std::array` が適しています。

「なぜ昔ながらの `int arr[5];` を使わないの？」と思われるかもしれません。
Cスタイルの配列は、他のコンテナ（vectorなど）と操作感が異なり、サイズ情報を自分で管理しなければならないなどの欠点があります。`std::array` はC配列のパフォーマンス（スタック確保）と、コンテナの利便性（`.size()`などが使える）を両立させたものです。

```cpp:array_demo.cpp
#include <iostream>
#include <array> // std::arrayを使うために必要

int main() {
    // int型でサイズ3の配列を宣言・初期化
    // std::array<型, サイズ>
    std::array<int, 3> coords = {10, 20, 30};

    std::cout << "X: " << coords[0] << std::endl;
    std::cout << "Y: " << coords[1] << std::endl;
    std::cout << "Z: " << coords[2] << std::endl;

    // vectorと同じようにsize()が使える
    std::cout << "Dimension: " << coords.size() << std::endl;

    return 0;
}
```

```cpp-exec:array_demo.cpp
X: 10
Y: 20
Z: 30
Dimension: 3
```

## 範囲ベース for ループ (Range-based for)

`std::vector` や `std::array` の中身を順番に処理する場合、インデックス `i` を使った `for (int i = 0; i < n; ++i)` は書くのが面倒ですし、境界外アクセスのリスクがあります。

モダンC++では、PythonやC\#の `foreach` に相当する **範囲ベース for ループ** が使えます。

### 基本構文

```cpp
for (要素の型 変数名 : コンテナ) {
    // 処理
}
```

ここで便利なのが、**`auto` キーワード**です。`auto` を使うと、コンパイラが型を自動推論してくれるため、型名を詳しく書く必要がなくなります。

```cpp:range_for_demo.cpp
#include <iostream>
#include <vector>
#include <string>

int main() {
    std::vector<std::string> inventory = {"Sword", "Shield", "Potion"};

    std::cout << "--- Inventory List ---" << std::endl;

    // string item : inventory と書いても良いが、autoが楽
    for (auto item : inventory) {
        std::cout << "- " << item << std::endl;
    }

    // 数値の計算例
    std::vector<int> scores = {80, 65, 90, 72};
    int total = 0;
    
    for (auto score : scores) {
        total += score;
    }
    
    std::cout << "Total Score: " << total << std::endl;

    return 0;
}
```

```cpp-exec:range_for_demo.cpp
--- Inventory List ---
- Sword
- Shield
- Potion
Total Score: 307
```

> **Advanced Hint:**
> 上記の `auto item` は、要素を「コピー」して取り出します。`std::string` のような大きなデータを扱う場合、コピーコストを避けるために `const auto& item` （参照）を使うのが一般的ですが、これについては**第5章**で詳しく解説します。今の段階では「`auto` でループが回せる」と覚えておけば十分です。

# この章のまとめ

1.  **文字列**: `char*` ではなく `std::string` を使う。結合や比較が簡単で安全。
2.  **動的配列**: データの増減がある場合は `std::vector` を使う。`push_back()` で追加できる。
3.  **固定配列**: サイズ固定の場合は `std::array` を使う。Cスタイル配列のモダンな代替。
4.  **ループ**: コンテナの全要素走査には「範囲ベース for ループ」と `auto` を使うとシンプルに書ける。

これらの「標準ライブラリ（STL: Standard Template Library）」のコンテナを活用することで、メモリ管理の苦労を飛ばして、アプリケーションのロジックに集中できるようになります。

### 練習問題1: 数値リストの統計

`std::vector<int>` を使用して、好きな整数を5つほど格納してください（コード内で直接初期化して構いません）。
その後、範囲ベース for ループを使用して、その数値の「合計」と「最大値」を求めて出力するプログラムを作成してください。

```cpp:practice3_1.cpp
#include <iostream>
#include <vector>

int main() {
    // ここに整数リストを初期化してください
    std::vector<int> numbers = {12, 45, 7, 23, 89};


    // 結果を出力
    std::cout << "Sum: " << sum << std::endl;
    std::cout << "Max Value: " << max_value << std::endl;

    return 0;
}
```

```cpp-exec:practice3_1.cpp
Sum: 176
Max Value: 89
```

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
