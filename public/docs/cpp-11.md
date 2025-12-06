# 第11章: 標準テンプレートライブラリ (STL) ①：コンテナ

C++の大きな魅力の一つに、**標準テンプレートライブラリ (Standard Template Library, STL)** の存在があります。STLは、よく使われるデータ構造やアルゴリズムを、汎用的かつ効率的に実装したライブラリ群です。この章では、STLの心臓部である**コンテナ**に焦点を当て、データの格納と管理を劇的に楽にする方法を学びます。

## STLの全体像: コンテナ、アルゴリズム、イテレータ

STLは、主に3つの要素から構成されています。

1.  **コンテナ (Containers)**: データを格納するためのデータ構造です。`vector`（可変長配列）や`map`（連想配列）など、様々な種類があります。
2.  **アルゴリズム (Algorithms)**: ソート、検索、変換など、コンテナ上のデータに対して操作を行う関数群です。
3.  **イテレータ (Iterators)**: コンテナの要素を指し示し、アルゴリズムがコンテナの種類に依存せずに各要素にアクセスするための統一的なインターフェースを提供します。ポインタを一般化したようなものです。

これら3つが連携することで、C++プログラマは効率的で再利用性の高いコードを素早く書くことができます。この章では「コンテナ」を、次の章では「アルゴリズム」と、それらをつなぐ「イテレータ」の応用を詳しく見ていきます。

## std::vector: 最もよく使う可変長配列

`std::vector`は、最も基本的で最もよく使われるコンテナです。他の言語でいうところの「リスト」や「動的配列」に相当し、要素を連続したメモリ領域に格納します。

**主な特徴**:

  * **動的なサイズ**: 必要に応じて自動的にサイズが拡張されます。
  * **高速なランダムアクセス**: インデックス（添字）を使って `[i]` の形式で要素に高速にアクセスできます (`O(1)`)。
  * **末尾への高速な追加・削除**: `push_back()` や `pop_back()` を使った末尾への操作は非常に高速です。

`std::vector`を使うには、`<vector>`ヘッダをインクルードする必要があります。

```cpp:vector_example.cpp
#include <iostream>
#include <vector>
#include <string>

int main() {
    // string型の要素を格納するvectorを作成
    std::vector<std::string> names;

    // push_backで末尾に要素を追加
    names.push_back("Alice");
    names.push_back("Bob");
    names.push_back("Charlie");

    // インデックスを使った要素へのアクセス
    std::cout << "Index 1: " << names[1] << std::endl;

    // 範囲for文 (range-based for loop) を使った全要素の走査
    std::cout << "\nAll names:" << std::endl;
    for (const std::string& name : names) {
        std::cout << "- " << name << std::endl;
    }

    // size()で現在の要素数を取得
    std::cout << "\nCurrent size: " << names.size() << std::endl;

    // pop_backで末尾の要素を削除
    names.pop_back(); // "Charlie"を削除

    std::cout << "\nAfter pop_back:" << std::endl;
    for (const std::string& name : names) {
        std::cout << "- " << name << std::endl;
    }
    std::cout << "Current size: " << names.size() << std::endl;

    return 0;
}
```

```cpp-exec:vector_example.cpp
Index 1: Bob

All names:
- Alice
- Bob
- Charlie

Current size: 3

After pop_back:
- Alice
- Bob
Current size: 2
```

`std::vector`は、どのコンテナを使うか迷ったら、まず最初に検討すべきデフォルトの選択肢と言えるほど万能です。

## std::map: キーと値のペアを管理する連想配列

`std::map`は、キー (key) と値 (value) のペアを管理するためのコンテナです。他の言語の「辞書 (dictionary)」や「ハッシュマップ (hash map)」に似ています。キーを使って値を高速に検索、追加、削除できます。

**主な特徴**:

  * **キーによる高速な検索**: キーに基づいて要素が自動的にソートされて格納されるため、検索、挿入、削除が高速です (`O(log n)`)。
  * **一意なキー**: `std::map`内のキーは重複しません。同じキーで値を挿入しようとすると、既存の値が上書きされます。

`std::map`を使うには、`<map>`ヘッダをインクルードする必要があります。

```cpp:map_example.cpp
#include <iostream>
#include <map>
#include <string>

int main() {
    // キーがstring型、値がint型のmapを作成
    std::map<std::string, int> scores;

    // []演算子で要素を追加・更新
    scores["Alice"] = 95;
    scores["Bob"] = 88;
    scores["Charlie"] = 76;

    // []演算子で値にアクセス
    std::cout << "Bob's score: " << scores["Bob"] << std::endl;

    // 新しいキーで追加
    scores["David"] = 100;
    
    // 既存のキーの値を更新
    scores["Alice"] = 98;

    // 範囲for文を使った全要素の走査
    // autoキーワードを使うと型推論が効いて便利
    std::cout << "\nAll scores:" << std::endl;
    for (const auto& pair : scores) {
        std::cout << "- " << pair.first << ": " << pair.second << std::endl;
    }

    // count()でキーの存在を確認
    std::string search_key = "Charlie";
    if (scores.count(search_key)) {
        std::cout << "\n" << search_key << " is in the map." << std::endl;
    }

    // erase()で要素を削除
    scores.erase("Bob");

    std::cout << "\nAfter erasing Bob:" << std::endl;
    for (const auto& pair : scores) {
        std::cout << "- " << pair.first << ": " << pair.second << std::endl;
    }

    return 0;
}
```

```cpp-exec:map_example.cpp
Bob's score: 88

All scores:
- Alice: 98
- Bob: 88
- Charlie: 76
- David: 100

Charlie is in the map.

After erasing Bob:
- Alice: 98
- Charlie: 76
- David: 100
```

`std::map`は、キーと値のペアを効率的に管理したい場合に非常に強力なツールです。

## その他: 目的に応じたコンテナ

STLには、他にも特定の目的に特化したコンテナが多数用意されています。ここでは代表的なものをいくつか紹介します。

  * `std::list`: 双方向リスト。要素の途中への挿入・削除が非常に高速 (`O(1)`) ですが、ランダムアクセスはできません（先頭から順番にたどる必要があります）。`<list>`ヘッダが必要です。
  * `std::set`: 重複しない要素の集合を管理します。要素は自動的にソートされます。特定の要素が集合内に存在するかどうかを高速に判定したい場合 (`O(log n)`) に便利です。`<set>`ヘッダが必要です。
  * `std::unordered_map`: `std::map`と同様にキーと値のペアを管理しますが、内部的にハッシュテーブルを使うため、平均的な検索・挿入・削除がさらに高速 (`O(1)`) です。ただし、要素はソートされません。`<unordered_map>`ヘッダが必要です。
  * `std::queue`, `std::stack`: それぞれ先入れ先出し (FIFO)、後入れ先出し (LIFO) のデータ構造を実装するためのコンテナアダプタです。

どのコンテナを選択するかは、プログラムの要件（データのアクセスパターン、挿入・削除の頻度など）によって決まります。まずは`std::vector`を基本とし、必要に応じて他のコンテナを検討するのが良いアプローチです。

## この章のまとめ

  * **STL**は、**コンテナ**、**アルゴリズム**、**イテレータ**の3つの主要コンポーネントから構成される、C++の強力な標準ライブラリです。
  * **コンテナ**は、データを格納するためのクラスです。
  * `std::vector`は、最も一般的に使われる動的配列で、高速なランダムアクセスと末尾への簡単な要素追加が特徴です。
  * `std::map`は、キーと値のペアを管理する連想配列で、キーによる高速な検索が可能です。
  * 他にも`std::list`, `std::set`など、特定の用途に合わせた様々なコンテナが用意されています。

### 練習問題1: 数値ベクタの操作

`std::vector<int>`型の整数のリストに対して、以下の処理を行うプログラムを作成してください。

1.  ベクタに格納されている全ての数値の合計値を計算して表示する。
2.  ベクタの中の最大値を検索して表示する。
3.  ベクタの要素を逆順にして、その内容を表示する。（ヒント：新しいベクタを作っても良いですし、`std::swap`を使っても構いません）

```cpp:practice11_1.cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers = {3, 5, 2, 8, 6};

    // 1. 合計値の計算


    // 2. 最大値の検索


    // 3. 要素の逆順表示


    return 0;
}
```

```cpp-exec:practice11_1.cpp
Sum: 24
Max: 8
Reversed: 6 8 2 5 3 
```


### 練習問題2: 簡単な単語カウンター

英文（スペースで区切られた単語の列）を読み込み、各単語が何回出現したかをカウントするプログラムを`std::map<std::string, int>`を使って作成してください。最後に、出現した全単語とその出現回数をアルファベット順に表示してください。

> 文字列を単語ごとに分割するには、以下のように`std::istringstream`を使うと便利です。
```cpp
#include <sstream>

std::string text = "this is a sample text";
std::istringstream iss(text);
std::string word;
while (iss >> word) {
    // wordには1単語ずつ格納される
}
```



```cpp:practice11_2.cpp
#include <iostream>
#include <map>
#include <string>
#include <sstream>

int main() {
    std::string text = "cpp is fun and cpp is powerful";


}
```
```cpp-exec:practice11_2.cpp
and: 1
cpp: 2
fun: 1
is: 2
powerful: 1
```
