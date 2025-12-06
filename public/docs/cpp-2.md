# 第2章: C++の型システムと制御構造：静的型付けとスコープを再確認する

C++は**静的型付け言語**です。PythonやJavaScriptのような動的型付け言語とは異なり、コンパイル時に変数の型が確定している必要があります。これにより、実行時のエラーを未然に防ぎ、高いパフォーマンスを実現します。

## 基本的なデータ型

C++には多くの型がありますが、まずは以下の基本型を押さえましょう。

  * **整数型**: `int` (通常4バイト), `long long` (8バイト, 大きな整数)
  * **浮動小数点型**: `double` (倍精度, 基本的にこれを使う), `float` (単精度)
  * **文字型**: `char` (1バイト文字), `std::string` (文字列クラス。厳密には基本型ではありませんが、実用上必須)
  * **ブール型**: `bool` (`true` または `false`)

C++では変数のサイズ（ビット幅）が環境によって異なる場合がありますが、現代的な環境では `int` は32bit以上であることが保証されています。

## 変数の初期化：ユニフォーム初期化 `{}`

C++には変数を初期化する方法がいくつもありますが、C++11以降では **波括弧 `{}` を使った初期化（ユニフォーム初期化）** が推奨されています。

なぜ `{}` が良いのでしょうか？ それは、**縮小変換（Narrowing Conversion）** を防げるからです。例えば、少数のデータを整数型変数に無理やり入れようとした時、`=` なら黙って切り捨てられますが、`{}` ならコンパイルエラーにしてくれます。

```cpp:initialization.cpp
#include <iostream>

int main() {
    // 推奨：波括弧による初期化
    int age{25};           // int age = 25; と同じだがより安全
    double weight{65.5};
    bool is_student{false};

    // 縮小変換の防止（コメントアウトを外すとコンパイルエラーになります）
    // int height{170.5}; // エラー！ doubleからintへの情報の欠落を防ぐ

    // 従来の方法（＝を使う）も間違いではありませんが、警告が出ないことがあります
    int rough_height = 170.9; // 170に切り捨てられる（エラーにならない）

    std::cout << "Alice is " << age << " years old." << std::endl;
    std::cout << "Height (rough): " << rough_height << std::endl;

    return 0;
}
```

```cpp-exec:initialization.cpp
Alice is 25 years old.
Height (rough): 170
```

## 型を厳密に扱う

静的型付けの恩恵を最大限に受けるために、C++には型をより安全かつ便利に扱うための仕組みがあります。

### `const`による不変性の保証

`const` (constantの略) は、変数を**読み取り専用**にするためのキーワードです。一度`const`で初期化された変数の値は、後から変更しようとするとコンパイルエラーになります。

なぜ`const`が重要なのでしょうか？

  * **安全性の向上**: 変更されるべきでない値を誤って変更してしまうバグを防ぎます。
  * **意図の明確化**: プログラムを読む人に対して、「この値は変わらない」という意図を明確に伝えられます。

円周率のように、プログラム中で決して変わることのない値に`const`を使うのが典型的な例です。

```cpp:const_example.cpp
#include <iostream>

int main() {
    const double PI = 3.14159;
    int radius = 5;

    double area = PI * radius * radius;
    std::cout << "Area: " << area << std::endl;

    // PI = 3.14; // この行はコンパイルエラーになる！

    return 0;
}
```
```cpp-exec:const_example.cpp
Area: 78.5397
```

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

## コンソール入出力 (`std::cin`, `std::cout`)

C言語の `printf`/`scanf` と異なり、C++ではストリーム（データの流れ）として入出力を扱います。型指定子（`%d`など）を覚える必要がなく、型安全です。

  * `std::cout << 値`: 出力（Console OUT）
  * `std::cin >> 変数`: 入力（Console IN）
  * `std::endl`: 改行を行い、バッファをフラッシュする。

> my.code(); の実行環境には入力機能がないので、コード例だけ示します:

```cpp
#include <iostream>
#include <string>

int main() {
    int id;
    std::string name;

    // 複数の値を出力する場合、<< で連結します
    std::cout << "Enter ID and Name: ";
    
    // キーボードから "101 Bob" のように入力されるのを待つ
    std::cin >> id >> name; 

    std::cout << "User: " << name << " (ID: " << id << ")" << std::endl;
    // User: Bob (ID: 101)

    return 0;
}
```

## 制御構文：if, switch, while, for

他のC系言語（Java, C\#, JSなど）とほぼ同じですが、いくつか注意点があります。

### if文

`if (条件式)` の条件式は `bool` に変換可能なものである必要があります。C++では `0` は `false`、それ以外は `true` とみなされます。

### switch文とフォールスルー

`switch` 文は `break` を書かない限り、次の `case` へ処理が流れます（フォールスルー）。意図的なフォールスルーでない限り、`break` を忘れないように注意が必要です。C++17以降では `[[fallthrough]];` 属性をつけることで、「意図的なものである」とコンパイラに伝え、警告を抑制できます。

### ループ構文

`while`, `for` も標準的です。

```cpp:control.cpp
#include <iostream>

int main() {
    // --- if文 ---
    const int score = 85;
    if (score >= 90) {
        std::cout << "Grade: A" << std::endl;
    } else if (score >= 80) {
        std::cout << "Grade: B" << std::endl;
    } else {
        std::cout << "Grade: C or below" << std::endl;
    }

    // --- switch文 ---
    const int rank = 2;
    std::cout << "Rank " << rank << ": ";

    switch (rank) {
        case 1:
            std::cout << "Gold" << std::endl;
            break;
        case 2:
            std::cout << "Silver" << std::endl;
            // breakを忘れるとcase 3も実行される
            [[fallthrough]]; // C++17: 意図的に下に流すことを明示
        case 3:
            std::cout << "(Medalist)" << std::endl;
            break;
        default:
            std::cout << "Participant" << std::endl;
    }

    // --- 基本的なforループ ---
    std::cout << "Countdown: ";
    for (int i = 3; i > 0; --i) {
        std::cout << i << " ";
    }
    std::cout << "Start!" << std::endl;

    return 0;
}
```

```cpp-exec:control.cpp
Grade: B
Rank 2: Silver
(Medalist)
Countdown: 3 2 1 Start!
```

## この章のまとめ

  * **型システム**: `int`, `double`, `bool` などの基本型があり、静的に管理される。
  * **初期化**: `int x{10};` のような波括弧 `{}` を使う初期化が推奨される（縮小変換の防止）。
  * **型推論と定数**: `auto` で型推論を行い、変更しない変数には `const` を付ける。
  * **入出力**: `std::cout`, `std::cin` を使い、`<<`, `>>` 演算子でデータを流す。
  * **制御構文**: 基本は他言語と同じだが、`switch` のフォールスルー挙動などに注意する。


## 練習問題1：うるう年判定機

西暦（整数）を変数 `year` に代入し、その年がうるう年かどうかを判定して結果を出力するプログラムを書いてください。

> **うるう年の条件**
>
> 1.  4で割り切れる年はうるう年である。
> 2.  ただし、100で割り切れる年はうるう年ではない。
> 3.  ただし、400で割り切れる年はうるう年である。

```cpp:practice2_1.cpp
#include <iostream>

int main() {
    const int year = 2025;

    // ここにコードを書く
}
```

```cpp-exec:practice2_1.cpp
```

### 練習問題2：FizzBuzz（C++スタイル）

1から20までの整数を順に出力するループを作成してください。ただし、以下のルールに従ってください。

  * 数値が3で割り切れるときは数値の代わりに "Fizz" と出力。
  * 数値が5で割り切れるときは数値の代わりに "Buzz" と出力。
  * 両方で割り切れるときは "FizzBuzz" と出力。
  * それ以外は数値をそのまま出力。

出力はスペース区切りまたは改行区切りどちらでも構いません。変数の初期化には `{}` を、ループカウンタの型には `auto` を使用してみてください。

```cpp:practice2_2.cpp
#include <iostream>

int main() {

}
```

```cpp-exec:practice2_2.cpp
```
