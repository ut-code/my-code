# 第8章: クラスを使いこなす

第7章では、C++のオブジェクト指向プログラミングの核となる`class`の基本的な使い方を学びました。しかし、クラスを真に強力なツールとして使いこなすには、もう少し知識が必要です。この章では、オブジェクトのコピー、演算子のオーバーロード、クラスで共有されるメンバなど、より実践的でパワフルな機能について掘り下げていきます。これらの概念をマスターすることで、あなたの書くクラスはより安全で、直感的で、再利用性の高いものになるでしょう。

## オブジェクトのコピー: コピーコンストラクタと代入演算子

オブジェクトをコピーしたい場面は頻繁にあります。例えば、関数の引数にオブジェクトを渡すとき（値渡し）や、既存のオブジェクトで新しいオブジェクトを初期化するときなどです。

```cpp
Vector2D v1(1.0, 2.0);
Vector2D v2 = v1; // ここでコピーが発生！
```

多くの場合、コンパイラが自動的に生成するコピー機能で十分です。しかし、クラスがポインタなどでリソース（メモリなど）を管理している場合、単純なコピーでは問題が発生します。

### 何もしないとどうなる？ (浅いコピー)

まず、コピーの機能を自分で作らなかった場合に何が起きるか見てみましょう。
コンパイラは、メンバ変数を単純にコピーするだけの「浅いコピー」を行います。

ここでは、`int`へのポインタを一つだけ持つ`ResourceHolder`（リソース保持者）というクラスを考えます。

```cpp:shallow_copy.cpp
// 悪い例：浅いコピーの問題点
#include <iostream>

class ResourceHolder {
private:
    int* m_data; // 動的に確保したデータへのポインタ
public:
    ResourceHolder(int value) {
        m_data = new int(value); // メモリを確保
        std::cout << "Resource " << *m_data << " created. (at " << m_data << ")" << std::endl;
    }
    ~ResourceHolder() {
        std::cout << "Resource " << *m_data << " destroyed. (at " << m_data << ")" << std::endl;
        delete m_data; // メモリを解放
    }
    // コピーコンストラクタや代入演算子を定義していない！
};

int main() {
    ResourceHolder r1(10);
    ResourceHolder r2 = r1; // 浅いコピーが発生！
    // r1.m_data と r2.m_data は同じアドレスを指してしまう
    
    // main()終了時、r1とr2のデストラクタが呼ばれる
    // 同じメモリを2回deleteしようとしてクラッシュ！💥
    return 0;
}
```
```cpp-exec:shallow_copy.cpp
Resource 10 created. (at 0x139f065e0)
Resource 10 destroyed. (at 0x139f065e0)
Resource 107521 destroyed. (at 0x1a4012b0)
free(): double free detected in tcache 2
```

この例では、`r2`が作られるときに`r1`のポインタ`m_data`の値（メモリアドレス）だけがコピーされます。その結果、2つのオブジェクトが1つのメモリ領域を指してしまいます。プログラム終了時にそれぞれのデストラクタが呼ばれ、同じメモリを2回解放しようとしてエラーになります。

### 解決策：コピー機能を自作する (深いコピー)

この問題を解決するために、**コピーコンストラクタ**と**コピー代入演算子**を自分で定義して、「深いコピー」を実装します。深いコピーとは、ポインタの指す先の実体（データそのもの）を新しく作ってコピーすることです。

```cpp:resource_holder.cpp
#include <iostream>

class ResourceHolder {
private:
    int* m_data; // リソースとして動的に確保したintへのポインタ

public:
    // コンストラクタ: intを1つ動的に確保し、値を設定
    ResourceHolder(int value) {
        m_data = new int(value);
        std::cout << "Resource " << *m_data << " created. (at " << m_data << ")" << std::endl;
    }

    // デストラクタ: 確保したメモリを解放
    ~ResourceHolder() {
        if (m_data != nullptr) {
            std::cout << "Resource " << *m_data << " destroyed. (at " << m_data << ")" << std::endl;
            delete m_data;
        }
    }

    // --- ここからが本題です ---

    // 1. コピーコンストラクタ (深いコピー)
    // ResourceHolder r2 = r1; のように、オブジェクトの作成と同時にコピーするときに呼ばれる
    ResourceHolder(const ResourceHolder& other) {
        // ① 新しいメモリを確保する
        // ② otherの「値」(*other.m_data)を、新しいメモリにコピーする
        m_data = new int(*other.m_data);
        std::cout << "COPY CONSTRUCTOR: New resource " << *m_data << " created. (at " << m_data << ")" << std::endl;
    }

    // 2. コピー代入演算子 (深いコピー)
    // r3 = r1; のように、既存のオブジェクトに代入するときに呼ばれる
    ResourceHolder& operator=(const ResourceHolder& other) {
        std::cout << "COPY ASSIGNMENT OPERATOR called." << std::endl;

        // ① 自己代入のチェック (a = a; のような無駄な処理を防ぐ)
        if (this == &other) {
            return *this; // 何もせず自分自身を返す
        }

        // ② 自分が元々持っていた古いリソースを解放する
        delete m_data;

        // ③ 新しいリソースを確保し、相手の値をコピーする
        m_data = new int(*other.m_data);

        return *this; // 自分自身を返すことで、a = b = c; のような連続代入が可能になる
    }

    void print() const {
        std::cout << "Value: " << *m_data << ", Address: " << m_data << std::endl;
    }
};

int main() {
    std::cout << "--- rh1の作成 ---" << std::endl;
    ResourceHolder rh1(10);

    std::cout << "\n--- rh2をrh1で初期化 ---" << std::endl;
    ResourceHolder rh2 = rh1; // コピーコンストラクタが呼ばれる

    std::cout << "\n--- rh3の作成 ---" << std::endl;
    ResourceHolder rh3(20);

    std::cout << "\n--- rh3にrh1を代入 ---" << std::endl;
    rh3 = rh1; // コピー代入演算子が呼ばれる

    std::cout << "\n--- 各オブジェクトの状態 ---" << std::endl;
    std::cout << "rh1: "; rh1.print();
    std::cout << "rh2: "; rh2.print(); // rh1とは別のメモリを持っている
    std::cout << "rh3: "; rh3.print(); // rh1とは別のメモリを持っている

    std::cout << "\n--- main関数終了 ---" << std::endl;
    return 0; // ここでrh1, rh2, rh3のデストラクタが呼ばれ、それぞれが確保したメモリを安全に解放する
}
```

```cpp-exec:resource_holder.cpp
--- rh1の作成 ---
Resource 10 created. (at 0x139f065e0)

--- rh2をrh1で初期化 ---
COPY CONSTRUCTOR: New resource 10 created. (at 0x139f06600)

--- rh3の作成 ---
Resource 20 created. (at 0x139f06620)

--- rh3にrh1を代入 ---
COPY ASSIGNMENT OPERATOR called.

--- 各オブジェクトの状態 ---
rh1: Value: 10, Address: 0x139f065e0
rh2: Value: 10, Address: 0x139f06600
rh3: Value: 10, Address: 0x139f06640

--- main関数終了 ---
Resource 10 destroyed. (at 0x139f06640)
Resource 10 destroyed. (at 0x139f06600)
Resource 10 destroyed. (at 0x139f065e0)
```

*(メモリアドレスは実行するたびに変わります)*

実行結果を見ると、`rh1`, `rh2`, `rh3` はそれぞれ異なるメモリアドレス (`Address`) を持っていることがわかります。これにより、各オブジェクトは独立したリソースを管理でき、プログラム終了時にそれぞれのデストラクタが安全にメモリを解放できます。

| 機能 | いつ呼ばれるか | 何をするか |
| :--- | :--- | :--- |
| **コピーコンストラクタ** | オブジェクトが**作られる時**に、他のオブジェクトで初期化される場合<br>`ResourceHolder r2 = r1;` | 新しいリソースを確保し、元のオブジェクトの**値**をコピーする。 |
| **コピー代入演算子** | **既にあるオブジェクト**に、他のオブジェクトを代入する場合<br>`r3 = r1;` | 1. 自分が持っている古いリソースを解放する。<br>2. 新しいリソースを確保し、元のオブジェクトの**値**をコピーする。 |

このように、ポインタでリソースを管理するクラスでは、安全なコピーを実現するためにこの2つの関数を自分で定義することが不可欠です。

## 演算子のオーバーロード

C++では、`+`, `-`, `==`, `<<` などの組み込み演算子を、自作のクラスで使えるように**再定義（オーバーロード）**できます。これにより、クラスのインスタンスをあたかも組み込み型（`int`や`double`など）のように直感的に扱えるようになります。

例えば、2次元ベクトルを表す `Vector2D` クラスがあるとします。`v3 = v1 + v2;` のように、ベクトル同士の足し算を自然に記述できると便利ですよね。

演算子のオーバーロードは、メンバ関数または非メンバ関数（グローバル関数）として定義します。

| 演算子 | メンバ関数での定義 | 非メンバ関数での定義 |
| :--- | :--- | :--- |
| 二項演算子 (`+`, `==` etc.) | `T operator+(const U& rhs);` | `T operator+(const T& lhs, const U& rhs);` |
| 単項演算子 (`-`, `!` etc.) | `T operator-();` | `T operator-(const T& obj);` |

### 実装例

`Vector2D` クラスで `+`（加算）、`==`（等価比較）、`<<`（ストリーム出力）をオーバーロードしてみましょう。

```cpp:operator_overloading.cpp
#include <iostream>

class Vector2D {
public:
    double x, y;

    Vector2D(double x = 0.0, double y = 0.0) : x(x), y(y) {}

    // メンバ関数として + 演算子をオーバーロード
    Vector2D operator+(const Vector2D& rhs) const {
        return Vector2D(this->x + rhs.x, this->y + rhs.y);
    }

    // メンバ関数として == 演算子をオーバーロード
    bool operator==(const Vector2D& rhs) const {
        return (this->x == rhs.x) && (this->y == rhs.y);
    }
};

// 非メンバ関数として << 演算子をオーバーロード
// 第1引数が std::ostream& なので、メンバ関数にはできない
std::ostream& operator<<(std::ostream& os, const Vector2D& v) {
    os << "(" << v.x << ", " << v.y << ")";
    return os;
}

int main() {
    Vector2D v1(1.0, 2.0);
    Vector2D v2(3.0, 4.0);

    // operator+ が呼ばれる
    Vector2D v3 = v1 + v2;
    std::cout << "v1: " << v1 << std::endl; // operator<<
    std::cout << "v2: " << v2 << std::endl; // operator<<
    std::cout << "v3 = v1 + v2: " << v3 << std::endl; // operator<<

    // operator== が呼ばれる
    if (v1 == Vector2D(1.0, 2.0)) {
        std::cout << "v1 is equal to (1.0, 2.0)" << std::endl;
    }

    return 0;
}
```

```cpp-exec:operator_overloading.cpp
v1: (1, 2)
v2: (3, 4)
v3 = v1 + v2: (4, 6)
v1 is equal to (1.0, 2.0)
```

`operator<<` は、左辺のオペランドが `std::ostream` 型（`std::cout` など）であるため、`Vector2D` のメンバ関数としては定義できません。そのため、非メンバ関数として定義するのが一般的です。

## staticメンバ

通常、クラスのメンバ変数はオブジェクトごとに個別のメモリ領域を持ちます。しかし、あるクラスの**全てのオブジェクトで共有したい**情報もあります。例えば、「これまでに生成されたオブジェクトの総数」などです。このような場合、**staticメンバ**を使用します。

### staticメンバ変数

`static` キーワードを付けて宣言されたメンバ変数は、特定のオブジェクトに属さず、クラスそのものに属します。そのため、全オブジェクトでただ1つの実体を共有します。これを**クラス変数**と呼ぶこともあります。

  * **宣言**: クラス定義の中で `static` を付けて行います。
  * **定義**: クラス定義の外（ソースファイル）で、メモリ上の実体を確保し、初期化します。

### staticメンバ関数

`static` キーワードを付けて宣言されたメンバ関数は、特定のオブジェクトに依存せずに呼び出せます。そのため、`this` ポインタ（後述）を持ちません。

  * **アクセス**: staticメンバ変数や他のstaticメンバ関数にはアクセスできますが、非staticなメンバ（インスタンスごとのメンバ変数やメンバ関数）にはアクセスできません。
  * **呼び出し**: `クラス名::関数名()` のように、オブジェクトを生成しなくても呼び出せます。

### 実装例

ゲームに登場する `Player` クラスがあり、現在何人のプレイヤーが存在するかを管理する例を見てみましょう。

```cpp:static_members.cpp
#include <iostream>
#include <string>

class Player {
private:
    std::string name;
    // (1) staticメンバ変数の宣言
    static int playerCount;

public:
    Player(const std::string& name) : name(name) {
        playerCount++; // オブジェクトが生成されるたびにインクリメント
        std::cout << name << " がゲームに参加しました。現在のプレイヤー数: " << playerCount << std::endl;
    }

    ~Player() {
        playerCount--; // オブジェクトが破棄されるたびにデクリメント
        std::cout << name << " がゲームから退出しました。現在のプレイヤー数: " << playerCount << std::endl;
    }

    // (2) staticメンバ関数の宣言
    static int getPlayerCount() {
        // name などの非staticメンバにはアクセスできない
        return playerCount;
    }
};

// (3) staticメンバ変数の定義と初期化
int Player::playerCount = 0;

int main() {
    // オブジェクトがなくてもstaticメンバ関数を呼び出せる
    std::cout << "ゲーム開始時のプレイヤー数: " << Player::getPlayerCount() << std::endl;
    std::cout << "---" << std::endl;

    Player p1("Alice");
    Player p2("Bob");

    {
        Player p3("Charlie");
        std::cout << "現在のプレイヤー数 (p1経由): " << p1.getPlayerCount() << std::endl;
    } // p3のスコープが終わり、デストラクタが呼ばれる

    std::cout << "---" << std::endl;
    std::cout << "ゲーム終了時のプレイヤー数: " << Player::getPlayerCount() << std::endl;

    return 0;
}
```

```cpp-exec:static_members.cpp
ゲーム開始時のプレイヤー数: 0
---
Alice がゲームに参加しました。現在のプレイヤー数: 1
Bob がゲームに参加しました。現在のプレイヤー数: 2
Charlie がゲームに参加しました。現在のプレイヤー数: 3
現在のプレイヤー数 (p1経由): 3
Charlie がゲームから退出しました。現在のプレイヤー数: 2
---
ゲーム終了時のプレイヤー数: 2
Alice がゲームから退出しました。現在のプレイヤー数: 1
Bob がゲームから退出しました。現在のプレイヤー数: 0
```

`playerCount` は `p1`, `p2`, `p3` の全てで共有されており、一つの値が更新されていることがわかります。

## thisポインタ

非staticなメンバ関数が呼び出されるとき、その関数は「どのオブジェクトに対して呼び出されたか」を知る必要があります。コンパイラは、そのメンバ関数に対して、呼び出し元のオブジェクトのアドレスを暗黙的に渡します。このアドレスを保持するのが `this` ポインタです。

`this` は、メンバ関数内で使用できるキーワードで、自分自身のオブジェクトを指すポインタです。

`this` ポインタが主に使われるのは、以下のような場面です。

1.  **メンバ変数と引数の名前が同じ場合**
    コンストラクタの初期化子リストを使わない場合など、引数名とメンバ変数名が同じになることがあります。その際、`this->` を付けることでメンバ変数であることを明示できます。

    ```cpp
    void setX(double x) {
        this->x = x; // this->x はメンバ変数, x は引数
    }
    ```

2.  **自分自身の参照やポインタを返す場合**
    コピー代入演算子で `return *this;` としたように、オブジェクト自身を返したい場合に使います。これにより、**メソッドチェーン**（`obj.setX(10).setY(20);` のような連続したメソッド呼び出し）が可能になります。

### 実装例

メソッドチェーンを実現する簡単な例を見てみましょう。

```cpp:this_pointer.cpp
#include <iostream>

class Point {
private:
    int x, y;

public:
    Point(int x = 0, int y = 0) : x(x), y(y) {}

    // 自身の参照を返すことで、メソッドチェーンを可能にする
    Point& setX(int newX) {
        this->x = newX;
        return *this; // 自分自身の参照を返す
    }

    Point& setY(int newY) {
        this->y = newY;
        return *this; // 自分自身の参照を返す
    }

    void print() const {
        std::cout << "(" << this->x << ", " << this->y << ")" << std::endl;
    }
};

int main() {
    Point p;

    // メソッドチェーン
    p.setX(10).setY(20);

    p.print();

    return 0;
}
```

```cpp-exec:this_pointer.cpp
(10, 20)
```

`setX` が `p` 自身の参照を返すため、その返り値に対して続けて `.setY(20)` を呼び出すことができます。

## この章のまとめ

この章では、クラスをより効果的に利用するための応用的な機能を学びました。

  * **オブジェクトのコピー**: ポインタなどリソースを管理するクラスでは、**コピーコンストラクタ**と**コピー代入演算子**を定義し、**深いコピー**を実装することが重要です。これにより、リソースの二重解放などの問題を未然に防ぎます。
  * **演算子のオーバーロード**: `+` や `==` などの演算子を自作クラスに対して定義することで、コードの可読性を高め、直感的な操作を可能にします。
  * **staticメンバ**: `static`メンバ変数やメンバ関数は、クラスの全オブジェクトで共有されるデータや機能を提供します。オブジェクトを生成しなくてもアクセスできるのが特徴です。
  * **thisポインタ**: 非staticメンバ関数内で、呼び出し元のオブジェクト自身を指すポインタです。メンバ変数と引数の区別や、メソッドチェーンの実装に役立ちます。

これらの機能を組み合わせることで、C++のクラスは単なるデータの入れ物から、振る舞いを伴った洗練された部品へと進化します。

### 練習問題1: 複素数クラス

実部 (real) と虚部 (imaginary) を`double`型で持つ複素数クラス `Complex` を作成してください。以下の要件を満たすものとします。

1.  コンストラクタで実部と虚部を初期化できるようにする。
2.  複素数同士の足し算 (`+`) と掛け算 (`*`) を演算子オーバーロードで実装する。
      * 加算: $(a+bi) + (c+di) = (a+c) + (b+d)i$
      * 乗算: $(a+bi) \* (c+di) = (ac-bd) + (ad+bc)i$
3.  `std::cout` で `(a + bi)` という形式で出力できるように、`<<` 演算子をオーバーロードする。（虚部が負の場合は `(a - bi)` のように表示されるとより良い）

```cpp:practice8_1.cpp
#include <iostream>

// ここに Complex クラスを実装してください

int main() {
    Complex c1(1.0, 2.0); // 1 + 2i
    Complex c2(3.0, 4.0); // 3 + 4i
    Complex sum = c1 + c2;
    Complex product = c1 * c2;

    std::cout << "c1: " << c1 << std::endl;
    std::cout << "c2: " << c2 << std::endl;
    std::cout << "c1 + c2 = " << sum << std::endl;
    std::cout << "c1 * c2 = " << product << std::endl;
    return 0;
}
```

```cpp-exec:practice8_1.cpp
c1: (1 + 2i)
c2: (3 + 4i)
c1 + c2 = (4 + 6i)
c1 * c2 = (-5 + 10i)
```

### 練習問題2: 動的配列クラスのコピー制御

整数 (`int`) の動的配列を管理するクラス `IntArray` を作成してください。このクラスは、コンストラクタで指定されたサイズの配列を `new` で確保し、デストラクタで `delete[]` を使って解放します。

この `IntArray` クラスに対して、**深いコピー**を正しく行うための**コピーコンストラクタ**と**コピー代入演算子**を実装してください。

```cpp:practice8_2.cpp
#include <iostream>

// ここに IntArray クラスを実装してください

int main() {
    IntArray arr1(5); // サイズ5の配列を作成
    for (int i = 0; i < 5; ++i) {
        arr1.set(i, i * 10); // 0, 10, 20, 30, 40
    }

    IntArray arr2 = arr1; // コピーコンストラクタ
    IntArray arr3(3);
    arr3 = arr1;          // コピー代入演算子

    std::cout << "arr1: ";
    for (int i = 0; i < 5; ++i) {
        std::cout << arr1.get(i) << " ";
    }
    std::cout << std::endl;

    std::cout << "arr2 (コピー): ";
    for (int i = 0; i < 5; ++i) {
        std::cout << arr2.get(i) << " ";
    }
    std::cout << std::endl;

    std::cout << "arr3 (代入): ";
    for (int i = 0; i < 5; ++i) {
        std::cout << arr3.get(i) << " ";
    }
    std::cout << std::endl;

    return 0;
}
```

```cpp-exec:practice8_2.cpp
arr1: 0 10 20 30 40 
arr2 (コピー): 0 10 20 30 40 
arr3 (代入): 0 10 20 30 40 
```
