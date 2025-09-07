# 第12章: プロジェクトの分割とビルド

これまでの章では、すべてのコードを1つの `.cpp` ファイルに記述してきました。しかし、プログラムが大規模で複雑になるにつれて、このアプローチは現実的ではなくなります。コードの可読性が低下し、少しの変更でもプログラム全体の再コンパイルが必要になり、開発効率が大きく損なわれるからです。

この章では、プログラムを複数のファイルに分割し、それらを効率的に管理・ビルドする方法を学びます。これは、小さなプログラムから一歩進み、本格的なソフトウェア開発を行うための重要なステップです。

## ヘッダファイルとソースファイル

C++では、プログラムを**ヘッダファイル**と**ソースファイル**という2種類のファイルに分割するのが一般的です。

  * **ヘッダファイル (`.h` または `.hpp`)**: 「宣言」を置く場所です。クラスの定義、関数のプロトタイプ宣言、定数、テンプレートなどを記述します。他のファイルに対して「何ができるか（インターフェース）」を公開する役割を持ちます。
  * **ソースファイル (`.cpp`)**: 「実装」を置く場所です。ヘッダファイルで宣言された関数の具体的な処理内容などを記述します。ヘッダファイルが公開したインターフェースを「どのように実現するか」を記述する役割を持ちます。

### なぜ分割するのか？ 🤔

1.  **関心の分離**: インターフェース（何ができるか）と実装（どうやるか）を分離することで、コードの見通しが良くなります。他の開発者はヘッダファイルを見るだけで、その機能の使い方がわかります。
2.  **コンパイル時間の短縮**: ソースファイルを変更した場合、再コンパイルはそのファイルだけで済みます。プロジェクト全体を再コンパイルする必要がないため、大規模なプロジェクトでは開発サイクルが劇的に速くなります。
3.  **再利用性の向上**: よく使う関数やクラスをまとめておけば、別のプロジェクトでそのファイルをインクルードするだけで簡単に再利用できます。

### 分割の例

簡単な足し算を行う関数を別のファイルに分割してみましょう。

まず、関数の「宣言」をヘッダファイルに記述します。

```cpp:math_utils.h
// 関数の宣言を記述するヘッダファイル

// この関数が他のファイルから参照されることを示す
int add(int a, int b);
```

次に、この関数の「実装」をソースファイルに記述します。

```cpp:math_utils.cpp
// 関数の実装を記述するソースファイル

#include "math_utils.h" // 対応するヘッダファイルをインクルード

int add(int a, int b) {
    return a + b;
}
```

最後に、`main`関数を含むメインのソースファイルから、この`add`関数を呼び出します。

```cpp:math_app.cpp
#include <iostream>
#include "math_utils.h" // 自作したヘッダファイルをインクルード

int main() {
    int result = add(5, 3);
    std::cout << "The result is: " << result << std::endl;
    return 0;
}
```

```cpp-exec:math_app.cpp,math_utils.cpp
The result is: 8
```

ここで注目すべき点は、`math_app.cpp`が`add`関数の具体的な実装を知らないことです。`math_utils.h`を通じて「`int`を2つ受け取って`int`を返す`add`という関数が存在する」ことだけを知り、それを利用しています。

## インクルードガード

複数のファイルから同じヘッダファイルがインクルードされる状況はよくあります。例えば、`A.h`が`B.h`をインクルードし、ソースファイルが`A.h`と`B.h`の両方をインクルードするような場合です。

もしヘッダファイルに何の対策もしていないと、同じ内容（クラス定義や関数宣言）が複数回読み込まれ、「再定義」としてコンパイルエラーが発生してしまいます。

```cpp:A.h
#include "B.h" // B.hをインクルード

// A.hの内容
```

```cpp:B.h
class B {
    // Bクラスの内容
};
```

```cpp:bad_include_app.cpp
#include "A.h"
#include "B.h" // B.hが二重にインクルードされる

int main() {
    [[maybe_unused]] B b; // Bクラスを使う

    return 0;
}
```

```cpp-exec:bad_include_app.cpp
In file included from bad_include_app.cpp:2:
B.h:1:7: error: redefinition of 'class B'
    1 | class B {
      |       ^
In file included from A.h:1,
                 from bad_include_app.cpp:1:
B.h:1:7: note: previous definition of 'class B'
    1 | class B {
      |       ^
```

この問題を解決するのが**インクルードガード**です。インクルードガードは、ヘッダファイルの内容が1つの翻訳単位（ソースファイル）内で一度しか読み込まれないようにするための仕組みです。

### 伝統的なインクルードガード

プリプロセッサディレクティブである `#ifndef`, `#define`, `#endif` を使います。

```cpp
#ifndef MATH_UTILS_H // もし MATH_UTILS_H が未定義なら
#define MATH_UTILS_H // MATH_UTILS_H を定義する

// --- ヘッダファイルの中身 ---
int add(int a, int b);
// -------------------------

#endif // MATH_UTILS_H
```

  * **最初のインクルード**: `MATH_UTILS_H` は未定義なので、`#define` が実行され、中身が読み込まれます。
  * **2回目以降のインクルード**: `MATH_UTILS_H` は既に定義されているため、`#ifndef` から `#endif` までのすべてが無視されます。

マクロ名 (`MATH_UTILS_H`) は、ファイル名に基づいて一意になるように命名するのが慣習です。

### \#pragma once

より現代的で簡潔な方法として `#pragma once` があります。多くのモダンなコンパイラがサポートしています。

```cpp
#pragma once

#include <string>

std::string to_upper(const std::string& str);
```

この一行をヘッダファイルの先頭に書くだけで、コンパイラがそのファイルが一度しかインクルードされないように処理してくれます。特別な理由がない限り、現在では `#pragma once` を使うのが主流です。

## プロジェクトのビルド

複数のソースファイル（`.cpp`）は、それぞれがコンパイルされて**オブジェクトファイル**（`.o` や `.obj`）になります。その後、**リンカ**がこれらのオブジェクトファイルと必要なライブラリを結合して、最終的な実行可能ファイルを生成します。

この一連の作業を**ビルド**と呼びます。ファイルが増えてくると、これを手動で行うのは非常に面倒です。そこで、ビルド作業を自動化する**ビルドシステム**が使われます。

### 手動でのビルド (g++)

先ほどの`math_app.cpp`と`math_utils.cpp`を例に、g++コンパイラで手動ビルドする手順を見てみましょう。

```bash
# 1. 各ソースファイルをコンパイルしてオブジェクトファイルを生成する (-c オプション)
g++ -c math_app.cpp -o main.o
g++ -c math_utils.cpp -o math_utils.o

# 2. オブジェクトファイルをリンクして実行可能ファイルを生成する
g++ main.o math_utils.o -o my_app

# 3. 実行する
./my_app
```

または、以下のように1回のg++コマンドで複数ソースファイルのコンパイルとリンクを同時に行うこともできます。

```bash
g++ math_app.cpp math_utils.cpp -o my_app
./my_app
```

### Makefileによる自動化

`make`は、ファイルの依存関係と更新ルールを記述した`Makefile`というファイルに従って、ビルドプロセスを自動化するツールです。

以下は、非常にシンプルな`Makefile`の例です。

```makefile
# コンパイラを指定
CXX = g++
# コンパイルオプションを指定
CXXFLAGS = -std=c++17 -Wall

# 最終的なターゲット（実行可能ファイル名）
TARGET = my_app

# ソースファイルとオブジェクトファイル
SRCS = math_app.cpp math_utils.cpp
OBJS = $(SRCS:.cpp=.o)

# デフォルトのターゲット (makeコマンド実行時に最初に実行される)
all: $(TARGET)

# 実行可能ファイルの生成ルール
$(TARGET): $(OBJS)
    $(CXX) $(CXXFLAGS) -o $(TARGET) $(OBJS)

# オブジェクトファイルの生成ルール (%.o: %.cpp)
# .cppファイルから.oファイルを作るための汎用ルール
%.o: %.cpp
    $(CXX) $(CXXFLAGS) -c $< -o $@

# 中間ファイルなどを削除するルール
clean:
    rm -f $(OBJS) $(TARGET)
```

この`Makefile`があるディレクトリで、ターミナルから`make`と入力するだけで、必要なコンパイルとリンクが自動的に実行されます。`math_app.cpp`だけを変更した場合、`make`は`main.o`だけを再生成し、再リンクするため、ビルド時間が短縮されます。

### CMakeによるモダンなビルド管理

`Makefile`は強力ですが、OSやコンパイラに依存する部分があり、複雑なプロジェクトでは管理が難しくなります。

**CMake**は、`Makefile`やVisual Studioのプロジェクトファイルなどを自動的に生成してくれる、クロスプラットフォーム対応のビルドシステムジェネレータです。`CMakeLists.txt`という設定ファイルに、より抽象的なビルドのルールを記述します。

```cmake
# CMakeの最低要求バージョン
cmake_minimum_required(VERSION 3.10)

# プロジェクト名を設定
project(MyAwesomeApp)

# C++の標準バージョンを設定
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 実行可能ファイルを追加
# add_executable(実行ファイル名 ソースファイル1 ソースファイル2 ...)
add_executable(my_app math_app.cpp math_utils.cpp)
```

この`CMakeLists.txt`を使ってビルドする一般的な手順は以下の通りです。

```bash
# 1. ビルド用の中間ファイルを置くディレクトリを作成し、移動する
mkdir build
cd build

# 2. CMakeを実行して、ビルドシステム（この場合はMakefile）を生成する
cmake ..

# 3. make (または cmake --build .) を実行してビルドする
make

# 4. 実行する
./my_app
```

CMakeは、ライブラリの検索、依存関係の管理、テストの実行など、大規模プロジェクトに必要な多くの機能を備えており、現在のC++開発における標準的なツールとなっています。

## この章のまとめ

  * **プロジェクトの分割**: プログラムは「宣言」を記述する**ヘッダファイル** (`.h`) と、「実装」を記述する**ソースファイル** (`.cpp`) に分割することで、保守性や再利用性が向上します。
  * **インクルードガード**: ヘッダファイルの多重インクルードによる再定義エラーを防ぐために、`#pragma once` や `#ifndef`/`#define`/`#endif` を使用します。
  * **ビルドシステム**: 複数のファイルをコンパイル・リンクするプロセスを自動化するために、`make` や `CMake` といったツールが使われます。特に **CMake** はクロスプラットフォーム開発におけるデファクトスタンダードです。

### 練習問題1: 電卓クラスの分割

`Calculator` というクラスを作成してください。このクラスは、加算、減算、乗算、除算のメンバ関数を持ちます。

* `Calculator.h`: `Calculator`クラスの定義を記述します。
* `Calculator.cpp`: 各メンバ関数の実装を記述します。
* `practice12_1.cpp`: `Calculator`クラスのインスタンスを作成し、いくつかの計算を行って結果を表示します。

これらのファイルをg++で手動ビルドして、プログラムを実行してください。

```cpp:Calculator.h

```

```cpp:Calculator.cpp

```

```cpp:practice12_1.cpp
#include <iostream>
#include "Calculator.h"

int main() {
    Calculator calc;

    std::cout << "3 + 5 = " << calc.add(3, 5) << std::endl;
    std::cout << "10 - 2 = " << calc.subtract(10, 2) << std::endl;
    std::cout << "4 * 7 = " << calc.multiply(4, 7) << std::endl;
    std::cout << "20 / 4 = " << calc.divide(20, 4) << std::endl;
    return 0;
}
```

```cpp-exec:practice12_1.cpp,Calculator.cpp
3 + 5 = 8
10 - 2 = 8
4 * 7 = 28
20 / 4 = 5
```
