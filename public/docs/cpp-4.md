# 第4章: ポインタとメモリ管理の深淵

ようこそ、C++学習の最大の山場へ。
第3章までは、`std::vector`や`std::string`といった便利な機能を使ってきましたが、今回はその「裏側」で何が起きているかを覗き込みます。

他の言語（Java, Python, C\#など）では言語機能やガベージコレクション（GC）が隠蔽してくれている「メモリ」という物理的なリソースを、C++では直接操作することができます。これがC++の強力な武器であり、同時にバグの温床でもあります。

ここを理解すれば、第3章の機能がいかに偉大だったか、そしてコンピュータが実際にどう動いているかが手に取るようにわかるようになります。

## ポインタの基礎

ポインタとは、変数の「値」ではなく、その変数がメモリ上の**どこにあるか（アドレス）**を格納する変数です。

変数の型に応じて、対応するポインタの型が存在します。例えば、`int`型の変数のアドレスを格納するなら `int*` 型、`double`型の変数のアドレスを格納するなら `double*` 型のポインタを使います。アスタリスク `*` がポインタ型であることを示します。

> ポインタ変数の宣言時に `*` を型の横に付けるか、変数名の横に付けるかは好みが分かれますが、意味は同じです (`int* p;` と `int *p;` は等価)。このチュートリアルでは `int* p;` のように型の側に付けます。

### アドレスと間接参照

  * **アドレス演算子 `&`**: 変数のメモリ上の住所（アドレス）を取得します。
  * **間接参照演算子 `*`**: ポインタが指し示している住所に行き、その中身（値）にアクセスします。

<!-- end list -->

```cpp:basic_pointer.cpp
#include <iostream>

int main() {
    int number = 42;
    // numberのアドレスを取得して ptr に格納
    // int* は「int型へのポインタ」という意味
    int* ptr = &number; 

    std::cout << "numberの値: " << number << std::endl;
    std::cout << "numberのアドレス (&number): " << &number << std::endl;
    std::cout << "ptrの値 (アドレス): " << ptr << std::endl;
    
    // アドレスの中身を見る（間接参照）
    std::cout << "ptrが指す中身 (*ptr): " << *ptr << std::endl;

    // ポインタ経由で値を書き換える
    *ptr = 100;
    std::cout << "書き換え後のnumber: " << number << std::endl;

    return 0;
}
```

```cpp-exec:basic_pointer.cpp
numberの値: 42
numberのアドレス (&number): 0x7ffedffe3adc
ptrの値 (アドレス): 0x7ffedffe3adc
ptrが指す中身 (*ptr): 42
書き換え後のnumber: 100
```

※ アドレス（0x...）は実行環境ごとに異なります。

### `nullptr` の使用

ポインタが「どこも指していない」ことを示したい場合、C++では `nullptr` を使用します。
古いC++やC言語では `NULL` や `0` が使われていましたが、モダンC++では型安全な `nullptr` を使うのが鉄則です。初期化されていないポインタは不定な場所を指すため、必ず初期化しましょう。

```cpp:pointer_declaration.cpp
#include <iostream>

int main() {
    // ポインタの宣言
    // 初期化していないポインタは不定なアドレスを指す可能性がある。
    int* p;
    std::cout << "p の初期値(アドレス): " << p << std::endl;

    // *p = 10; // 【危険】未初期化ポインタの間接参照は未定義動作

    // どの変数も指していないことを示す特別な値 nullptr
    // ポインタを初期化する際は nullptr を使うのが安全です
    p = nullptr;
    std::cout << "p の値(アドレス): " << p << std::endl;

    if (p == nullptr) {
        std::cout << "p は何も指していません。" << std::endl;
    }

    // *p = 10; // 【危険】nullptrはどこも指していないので、やっぱり未定義動作

    return 0;
}
```

```cpp-exec:pointer_declaration.cpp
p の初期値(アドレス): 0x7ffedffe3ab8
p の値(アドレス): 0
p は何も指していません。
```

## 配列とポインタの関係

第3章では `std::vector` を使いましたが、C++にはC言語互換の「生の配列（Cスタイル配列）」も存在します。これはサイズが固定で、機能が制限されています。

### 配列名の減衰（Decay）

実は、配列の名前は式の中で使うと、**「先頭要素へのポインタ」**として扱われます。これを「減衰（Decay）」と呼びます。

### ポインタ演算

ポインタに対して数値を足し引きすると、**「その型のサイズ分」**だけアドレスが移動します。
`int`（通常4バイト）のポインタに `+1` すると、メモリアドレスは4増えます。

```cpp:array_decay.cpp
#include <iostream>

int main() {
    // Cスタイル配列の宣言（サイズ固定）
    int primes[] = {2, 3, 5, 7};

    // 配列名 primes は &primes[0] とほぼ同じ意味になる
    int* ptr = primes;

    std::cout << "先頭要素 (*ptr): " << *ptr << std::endl;

    // ポインタ演算
    // ptr + 1 は次のint要素（メモリ上で4バイト隣）を指す
    std::cout << "2番目の要素 (*(ptr + 1)): " << *(ptr + 1) << std::endl;
    
    // 配列添字アクセス primes[2] は、実は *(primes + 2) のシンタックスシュガー
    std::cout << "3番目の要素 (primes[2]): " << primes[2] << std::endl;
    std::cout << "3番目の要素 (*(primes + 2)): " << *(primes + 2) << std::endl;

    return 0;
}
```

```cpp-exec:array_decay.cpp
先頭要素 (*ptr): 2
2番目の要素 (*(ptr + 1)): 3
3番目の要素 (primes[2]): 5
3番目の要素 (*(primes + 2)): 5
```

## 文字列の正体（Legacy）

`std::string` が登場する前、文字列は単なる `char` 型の配列でした。これを「Cスタイル文字列」と呼びます。
現在でも、ライブラリとの連携などで頻繁に目にします。

### 文字列リテラルと `char*`

Cスタイル文字列は、文字の並びの最後に「終端文字 `\0`（ヌル文字）」を置くことで終わりを表します。

```cpp:legacy_string.cpp
#include <iostream>
#include <string>

int main() {
    // 文字列リテラルは const char 配列
    const char* c_str = "Hello"; 
    
    // std::string から Cスタイル文字列への変換
    std::string cpp_str = "World";
    const char* converted = cpp_str.c_str(); // .c_str() を使う

    std::cout << "C-Style: " << c_str << std::endl;
    std::cout << "C++ String: " << cpp_str << std::endl;
    std::cout << "Converted to C-Style: " << converted << std::endl;
    
    // 注意: c_str は配列なのでサイズ情報を持っていない
    // 終端文字 '\0' まで読み進める必要がある
    
    return 0;
}
```

```cpp-exec:legacy_string.cpp
C-Style: Hello
C++ String: World
Converted to C-Style: World
```

**重要:** モダンC++では基本的に `std::string` を使いましょう。`char*` は参照用やAPI互換のために使います。

## 動的なメモリ確保

ここがメモリ管理の核心です。プログラムが使うメモリ領域には大きく分けて「スタック」と「ヒープ」があります。

### スタック (Stack)

  * これまでの変数は主にここに置かれます。
  * 関数のスコープ `{ ... }` を抜けると**自動的に消滅**します。
  * 管理が楽で高速ですが、サイズに制限があります。

### ヒープ (Heap)

  * プログラマが**手動で確保・解放**する領域です。
  * 広大なサイズを使えますが、管理を怠ると危険です。

### `new` と `delete`

ヒープ領域を使うには `new` 演算子を使用し、使い終わったら必ず `delete` 演算子でメモリをOSに返却（解放）する必要があります。

```cpp:heap_memory.cpp
#include <iostream>

int main() {
    // ヒープ上に整数を1つ確保
    int* pInt = new int(10); 
    
    // ヒープ上に配列を確保 (サイズ100)
    // std::vectorを使わない場合、サイズは動的に決められるが管理は手動
    int size = 5;
    int* pArray = new int[size];

    // 配列への書き込み
    for(int i = 0; i < size; ++i) {
        pArray[i] = i * 10;
    }

    std::cout << "ヒープ上の値: " << *pInt << std::endl;
    std::cout << "ヒープ上の配列[2]: " << pArray[2] << std::endl;

    // 【重要】使い終わったら必ず解放する！
    delete pInt;       // 単体の解放
    delete[] pArray;   // 配列の解放 (delete[] を使うこと)

    // 解放後のアドレスには触ってはいけない（ダングリングポインタ）
    // 安全のため nullptr にしておく
    pInt = nullptr;
    pArray = nullptr;

    return 0;
}
```

```cpp-exec:heap_memory.cpp
ヒープ上の値: 10
ヒープ上の配列[2]: 20
```

### 恐怖の「メモリリーク」

もし `delete` を忘れるとどうなるでしょう？
確保されたメモリは、プログラムが終了するまで「使用中」のまま残ります。これを**メモリリーク**と呼びます。長時間動くサーバーなどでこれが起きると、メモリを食いつぶしてシステムがクラッシュします。

**第3章の振り返り:**
`std::vector` や `std::string` は、内部で `new` と `delete` を自動的に行ってくれています。

  * 作成時に `new` で確保。
  * スコープを抜けるときに自動で `delete`（デストラクタ）。
    これがC++のクラスの強力な機能（RAII）です。生の `new/delete` を直接使うことは、モダンC++では「最後の手段」あるいは「ライブラリを作る側の仕事」と考えられています。


## この章のまとめ

1.  **ポインタ**はメモリアドレスを保持する変数。`&`で取得、`*`でアクセス。
2.  ポインタの初期化には `nullptr` を使う。
3.  **配列名**は先頭要素へのポインタとして振る舞う（減衰）。
4.  `ptr + i` は、`ptr` の指す型 `i` 個分先のアドレスを指す。
5.  **ヒープメモリ**は `new` で確保し、必ず `delete` で解放する。
6.  `delete` を忘れると**メモリリーク**になる。これを防ぐために `std::vector` などのコンテナクラスが存在する。

## 練習問題1: ポインタによる配列操作

`int` 型のCスタイル配列 `arr` について、 `int*` 型のポインタを使って走査し、**すべての値を2倍に書き換えてください**（`[]` 演算子は使わず、ポインタ演算 `*` と `++` または `+` を使用すること）。

```cpp:practice4_1.cpp
#include <iostream>

int main() {
    int arr[] = {10, 20, 30, 40, 50};

    // ここにコードを書く


    std::cout << "配列の値を2倍にしました: ";
    for (int i = 0; i < 5; ++i) {
        std::cout << arr[i] << " ";
    }
    return 0;
}
```

```cpp-exec:practice4_1.cpp
配列の値を2倍にしました: 60 80 100 120 140 
```

### 問題2：手動メモリ管理の体験

`n` 個の整数を格納できる配列を**ヒープ領域（`new`）**に確保してください。
その配列に 0 から `n-1` までの数値を代入し、合計値を計算して表示してください。
最後に、確保したメモリを適切に解放してください。

```cpp:practice4_2.cpp
#include <iostream>

int main() {
    const int n = 5;

    // ここにコードを書く

    
    return 0;
}
```

```cpp-exec:practice4_2.cpp
配列の合計値は: 10
```
