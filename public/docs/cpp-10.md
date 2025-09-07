# 第10章: 標準テンプレートライブラリ (STL) ②：アルゴリズムとラムダ式

ようこそ、C++チュートリアルの第10章へ！前の章ではSTLのコンテナについて学び、様々なデータを効率的に格納する方法を見てきました。しかし、データを格納するだけではプログラムは完成しません。そのデータを並べ替えたり、検索したり、特定の処理を施したりといった「操作」が必要です。

この章では、STLのもう一つの強力な柱である**アルゴリズム**ライブラリを学びます。これらのアルゴリズムは、コンテナ内のデータを操作するための汎用的な関数群です。そして、アルゴリズムをさらに柔軟かつ強力にするための現代的なC++の機能、**ラムダ式**についても解説します。これらをマスターすれば、驚くほど少ないコードで複雑なデータ操作が実現できるようになります。

## イテレータ：コンテナとアルゴリズムを繋ぐ架け橋

アルゴリズムは、特定のコンテナ（`std::vector` や `std::list` など）に直接依存しないように設計されています。では、どうやってコンテナ内の要素にアクセスするのでしょうか？そこで登場するのが**イテレータ (Iterator)** です。

イテレータは、コンテナ内の要素を指し示す「ポインタのような」オブジェクトです。ポインタのように `*` で要素の値を参照したり、`++` で次の要素に進んだりできます。

ほとんどのコンテナは、以下の2つの重要なイテレータを取得するメンバ関数を持っています。

  * `begin()`: コンテナの先頭要素を指すイテレータを返す。
  * `end()`: コンテナの**最後の要素の次**を指すイテレータを返す。これは有効な要素を指していない「番兵」のような役割を果たします。

アルゴリズムは、この `begin()` と `end()` から得られるイテレータのペアを使い、操作対象の「範囲」を指定します。範囲は半開区間 `[begin, end)` で表され、`begin` が指す要素は範囲に含まれ、`end` が指す要素は含まれません。

簡単な例を見てみましょう。イテレータを使って `vector` の全要素を表示するコードです。

```cpp:iterator_example.cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers = {0, 1, 2, 3, 4};

    // イテレータを使ってコンテナを走査
    std::cout << "Numbers: ";
    for (auto it = numbers.begin(); it != numbers.end(); ++it) {
        std::cout << *it << " "; // *it で要素の値にアクセス
    }
    std::cout << std::endl;

    // C++11以降の範囲ベースforループ (内部ではイテレータが使われている)
    std::cout << "Numbers (range-based for): ";
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;

    return 0;
}
```

```cpp-exec:iterator_example.cpp
Numbers: 0 1 2 3 4 
Numbers (range-based for): 0 1 2 3 4 
```

このように、イテレータはコンテナの種類を問わず、統一的な方法で要素にアクセスする仕組みを提供します。これが、アルゴリズムが様々なコンテナに対して汎用的に機能する理由です。

## 便利なアルゴリズム

C++の標準ライブラリには、`<algorithm>` ヘッダと `<numeric>` ヘッダに数多くの便利なアルゴリズムが用意されています。ここでは、特によく使われるものをいくつか紹介します。

### `std::sort`: 要素を並べ替える

名前の通り、指定された範囲の要素をソートします。デフォルトでは昇順に並べ替えます。

```cpp:sort_example.cpp
#include <iostream>
#include <vector>
#include <algorithm> // std::sort のために必要
#include <string>

int main() {
    std::vector<int> numbers = {5, 2, 8, 1, 9};
    
    // numbers.begin() から numbers.end() の範囲をソート
    std::sort(numbers.begin(), numbers.end());

    std::cout << "Sorted numbers: ";
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;

    std::vector<std::string> words = {"banana", "apple", "cherry"};
    std::sort(words.begin(), words.end());

    std::cout << "Sorted words: ";
    for (const auto& word : words) {
        std::cout << word << " ";
    }
    std::cout << std::endl;

    return 0;
}
```

```cpp-exec:sort_example.cpp
Sorted numbers: 1 2 5 8 9 
Sorted words: apple banana cherry 
```

### `std::find`: 要素を検索する

指定された範囲から特定の値を持つ要素を検索します。

  * **見つかった場合**: その要素を指すイテレータを返します。
  * **見つからなかった場合**: 範囲の終端を示すイテレータ (`end()`) を返します。

この性質を利用して、要素が存在するかどうかをチェックできます。

```cpp:find_example.cpp
#include <iostream>
#include <vector>
#include <algorithm> // std::find のために必要

int main() {
    std::vector<int> numbers = {10, 20, 30, 40, 50};
    int value_to_find = 30;

    // numbers の中から 30 を探す
    auto it = std::find(numbers.begin(), numbers.end(), value_to_find);

    if (it != numbers.end()) {
        // 見つかった場合
        std::cout << "Found " << *it << " at index " << std::distance(numbers.begin(), it) << std::endl;
    } else {
        // 見つからなかった場合
        std::cout << value_to_find << " not found." << std::endl;
    }

    value_to_find = 99;
    it = std::find(numbers.begin(), numbers.end(), value_to_find);

    if (it != numbers.end()) {
        std::cout << "Found " << *it << std::endl;
    } else {
        std::cout << value_to_find << " not found." << std::endl;
    }

    return 0;
}
```

```cpp-exec:find_example.cpp
Found 30 at index 2
99 not found.
```

### `std::for_each`: 各要素に処理を適用する

指定された範囲の全ての要素に対して、特定の関数（処理）を適用します。ループを書くよりも意図が明確になる場合があります。

```cpp
// 3番目の引数に関数を渡す
std::for_each(numbers.begin(), numbers.end(), print_function);
```

ここで「特定の処理」をその場で手軽に記述する方法が**ラムダ式**です。

## ラムダ式：その場で書ける無名関数

ラムダ式（Lambda Expression）は、C++11から導入された非常に強力な機能です。一言で言えば、「**その場で定義して使える名前のない小さな関数**」です。これにより、アルゴリズムに渡すためだけの短い関数をわざわざ定義する必要がなくなり、コードが非常に簡潔になります。

ラムダ式の基本的な構文は以下の通りです。

```cpp
[キャプチャ](引数リスト) -> 戻り値の型 { 処理本体 }
```

  * `[]` **キャプチャ句**: ラムダ式の外にある変数を取り込んで、式の中で使えるようにします。
      * `[]`: 何もキャプチャしない。
      * `[=]`: 外の変数を全て値渡し（コピー）でキャプチャする。
      * `[&]`: 外の変数を全て参照渡しでキャプチャする。
      * `[x, &y]`: 変数 `x` は値渡し、変数 `y` は参照渡しでキャプチャする。
  * `()` **引数リスト**:通常の関数と同じ引数を取ることができます。
  * `-> 戻り値の型`: 戻り値の型を指定します。多くの場合、コンパイラが推論できるため省略可能です。
  * `{}` **処理本体**: 関数の処理内容を記述します。

`std::for_each` とラムダ式を組み合わせた例を見てみましょう。

```cpp:for_each_lambda_example.cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5};

    // 各要素を2倍して表示する
    std::cout << "Doubled numbers: ";
    std::for_each(numbers.begin(), numbers.end(), [](int n) {
        std::cout << n * 2 << " ";
    });
    std::cout << std::endl;

    // 外部の変数をキャプチャする例
    int sum = 0;
    // `&sum` で sum を参照キャプチャし、ラムダ式内で変更できるようにする
    std::for_each(numbers.begin(), numbers.end(), [&sum](int n) {
        sum += n;
    });

    std::cout << "Sum: " << sum << std::endl;

    return 0;
}
```

```cpp-exec:for_each_lambda_example.cpp
Doubled numbers: 2 4 6 8 10 
Sum: 15
```

このコードは、`for_each` の3番目の引数に直接処理を書き込んでいます。非常に直感的で読みやすいと思いませんか？

ラムダ式は、特に `std::sort` のソート順をカスタマイズする際に真価を発揮します。例えば、数値を降順にソートしたい場合、比較ルールをラムダ式で与えることができます。

```cpp:lambda_sort_example.cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> numbers = {5, 2, 8, 1, 9};

    // 比較関数としてラムダ式を渡す
    // a > b であれば true を返すことで降順ソートになる
    std::sort(numbers.begin(), numbers.end(), [](int a, int b) {
        return a > b;
    });

    std::cout << "Sorted in descending order: ";
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;

    return 0;
}
```

```cpp-exec:lambda_sort_example.cpp
Sorted in descending order: 9 8 5 2 1 
```

## この章のまとめ

この章では、STLのアルゴリズムとラムダ式について学びました。

  * **イテレータ**は、コンテナの要素を指し示すオブジェクトであり、アルゴリズムとコンテナの間のインターフェースとして機能します。
  * `<algorithm>` ヘッダには、**`std::sort`** (ソート)、**`std::find`** (検索)、**`std::for_each`** (繰り返し処理) といった、汎用的で強力なアルゴリズムが多数用意されています。
  * **ラムダ式**は、その場で定義できる無名関数であり、アルゴリズムに渡す処理を簡潔かつ直感的に記述することができます。
  * **キャプチャ**機能を使うことで、ラムダ式の外にある変数を取り込んで処理に利用できます。

コンテナ、イテレータ、アルゴリズム、そしてラムダ式。これらを組み合わせることで、C++におけるデータ処理は、他の多くの言語に引けを取らない、あるいはそれ以上に表現力豊かで効率的なものになります。

### 練習問題1: 文字列の長さでソート

`std::vector<std::string>` を用意し、格納されている文字列を、文字数が短い順にソートして、結果を出力するプログラムを作成してください。`std::sort` とラムダ式を使用してください。

**ヒント**: ラムダ式は2つの文字列を引数に取り、1つ目の文字列の長さが2つ目の文字列の長さより短い場合に `true` を返すように実装します。


```cpp:practice10_1.cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<std::string> words = {"apple", "banana", "kiwi", "cherry", "fig", "grape"};

    return 0;
}
```

```cpp-exec:practice10_1.cpp
fig kiwi grape apple banana cherry 
```

### 練習問題2: 条件に合う要素のカウント

`std::vector<int>` に整数をいくつか格納します。その後、ラムダ式と `std::for_each`（または他のアルゴリズム）を使って、以下の2つの条件を満たす要素がそれぞれいくつあるかを数えて出力してください。

1.  正の偶数である要素の数
2.  負の奇数である要素の数

**ヒント**: カウント用の変数を2つ用意し、ラムダ式のキャプチャ句で参照キャプチャ (`[&]`) して、式の中でインクリメントします。

```cpp:practice10_2.cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> numbers = {3, -1, 4, -5, 6, -7, 8, 0, -2};


    return 0;
}
```

```cpp-exec:practice10_2.cpp
Positive even count: 3
Negative odd count: 3
```
