# 第5章: オブジェクト指向の入口：クラスの基礎

これまでの章では、C++の基本的な文法やメモリの扱い方について学んできました。この章からは、C++の最も強力な機能の一つである**オブジェクト指向プログラミング (Object-Oriented Programming, OOP)** の世界に足を踏み入れます。OOPの考え方を身につけることで、より大規模で複雑なプログラムを、現実世界の「モノ」の概念に近い形で、直感的に設計・実装できるようになります。その第一歩として、OOPの中核をなす**クラス**の基礎を学びましょう。

## クラスとは？: データ（メンバ変数）と処理（メンバ関数）のカプセル化

他のプログラミング言語でオブジェクト指向に触れたことがあるなら、「クラスはオブジェクトの設計図」という説明を聞いたことがあるかもしれません。C++でもその考え方は同じです。クラスは、ある「モノ」が持つべき**データ（属性）**と、そのデータに対する**処理（操作）**を一つにまとめたものです。

  - **データ（属性）**: クラス内に定義された変数のことで、**メンバ変数 (member variables)** または**データメンバ**と呼びます。
  - **処理（操作）**: クラス内に定義された関数のことで、**メンバ関数 (member functions)** または**メソッド**と呼びます。

このように、関連するデータと処理を一つのクラスにまとめることを、OOPの重要な概念の一つである**カプセル化 (encapsulation)** と呼びます。💊

例として、「人」を表す`Person`クラスを考えてみましょう。「人」は「名前」や「年齢」といったデータ（メンバ変数）を持ち、「自己紹介する」といった処理（メンバ関数）を行うことができます。

```cpp
class Person {
public:
    // メンバ変数
    std::string name;
    int age;

    // メンバ関数
    void introduce() {
        std::cout << "My name is " << name << ", and I am " << age << " years old." << std::endl;
    }
};
```

`class Person { ... };` という構文でクラスを定義します。クラス定義の最後にはセミコロン`;`が必要なので忘れないようにしましょう。現時点では、`public:`というキーワードは「これらのメンバは外部からアクセスできます」という意味だと考えておいてください。詳細は後ほど説明します。

## インスタンスの生成: クラスからオブジェクトを作ってみる

クラスはあくまで「設計図」です。実際にプログラムで利用するためには、この設計図をもとに実体を作る必要があります。クラスから作られた実体のことを**オブジェクト (object)** または**インスタンス (instance)** と呼び、オブジェクトを作ることを**インスタンス化 (instantiation)** と言います。

インスタンス化の構文は、変数の宣言とよく似ています。

```cpp:instantiation.cpp
#include <iostream>
#include <string>

// Personクラスの定義
class Person {
public:
    std::string name;
    int age;

    void introduce() {
        std::cout << "My name is " << name << ", and I am " << age << " years old." << std::endl;
    }
};

int main() {
    // Personクラスのインスタンスを生成
    Person taro;

    // メンバ変数に値を代入 (ドット演算子 . を使用)
    taro.name = "Taro";
    taro.age = 30;

    // メンバ関数を呼び出す
    taro.introduce(); // "My name is Taro, and I am 30 years old." と出力される

    // 別のインスタンスを生成
    Person hanako;
    hanako.name = "Hanako";
    hanako.age = 25;
    hanako.introduce(); // "My name is Hanako, and I am 25 years old." と出力される

    return 0;
}
```

```cpp-exec:instantiation.cpp
My name is Taro, and I am 30 years old.
My name is Hanako, and I am 25 years old.
```

このように、`クラス名 インスタンス名;` という形でインスタンスを生成できます。インスタンスのメンバ変数やメンバ関数にアクセスするには、`インスタンス名.メンバ名` のように**ドット演算子 (`.`)** を使います。`taro`と`hanako`は同じ`Person`クラスから作られたインスタンスですが、それぞれが独立したデータを持っていることがわかります。

## アクセス制御: public と private による情報の隠蔽

先ほどの`Person`クラスの例では、`main`関数から`taro.age = 30;`のようにメンバ変数に直接アクセスできました。これは手軽ですが、問題を引き起こす可能性があります。例えば、年齢にマイナスの値や非現実的な値を設定できてしまうかもしれません。

```cpp
Person jiro;
jiro.name = "Jiro";
jiro.age = -5; // 本来ありえない値が設定できてしまう！
jiro.introduce();
```

このような意図しない操作を防ぐために、C++には**アクセス制御**の仕組みがあります。クラスのメンバは、外部からのアクセスの可否を指定できます。

  - **`public`**: クラスの外部（`main`関数など）から自由にアクセスできます。
  - **`private`**: そのクラスのメンバ関数からしかアクセスできません。外部からはアクセス不可です。

アクセス制御の基本は、**メンバ変数は`private`にし、メンバ関数は`public`にする**ことです。これにより、データの不正な書き換えを防ぎ、クラスの内部実装を外部から隠蔽します。これを**情報の隠蔽 (information hiding)** と呼び、カプセル化の重要な目的の一つです。

`private`なメンバ変数に安全にアクセスするために、`public`なメンバ関数（**ゲッター**や**セッター**と呼ばれる）を用意するのが一般的です。

```cpp:access_control.cpp
#include <iostream>
#include <string>

class Person {
private:
    // メンバ変数は外部から隠蔽する
    std::string name;
    int age;

public:
    // セッター: メンバ変数に値を設定する
    void setName(const std::string& newName) {
        name = newName;
    }

    void setAge(int newAge) {
        if (newAge >= 0 && newAge < 150) { // 不正な値をチェック
            age = newAge;
        } else {
            std::cout << "Error: Invalid age value." << std::endl;
        }
    }

    // ゲッター: メンバ変数の値を取得する
    std::string getName() const {
        return name;
    }

    int getAge() const {
        return age;
    }

    // このメンバ関数はクラス内部にあるので、privateメンバにアクセスできる
    void introduce() {
        std::cout << "My name is " << name << ", and I am " << age << " years old." << std::endl;
    }
};

int main() {
    Person saburo;

    // saburo.name = "Saburo"; // エラー！ privateメンバには直接アクセスできない
    // saburo.age = -10;       // エラー！

    // publicなメンバ関数を経由して安全に値を設定
    saburo.setName("Saburo");
    saburo.setAge(28);

    saburo.introduce();

    saburo.setAge(-10); // エラーメッセージが出力される

    // publicなメンバ関数経由で値を取得
    std::cout << "Name: " << saburo.getName() << std::endl;

    return 0;
}
```

```cpp-exec:access_control.cpp
My name is Saburo, and I am 28 years old.
Error: Invalid age value.
Name: Saburo
```

`setAge`関数内で値の妥当性チェックを行っている点に注目してください。このように、クラスの利用者は内部の実装を気にすることなく、提供された`public`なインターフェース（メンバ関数）を通じて安全にオブジェクトを操作できます。

> `const`キーワード: `getName() const` のようにメンバ関数の後ろに`const`を付けると、その関数がメンバ変数を変更しないことをコンパイラに約束します。このような関数を**constメンバ関数**と呼びます。

## コンストラクタとデストラクタ: オブジェクトが生まれてから消えるまで

オブジェクトは生成され、利用され、やがて破棄されます。このライフサイクルに合わせて特別な処理を自動的に実行するための仕組みが**コンストラクタ**と**デストラクタ**です。

### コンストラクタ (Constructor)

**コンストラクタ**は、インスタンスが生成されるときに**自動的に呼び出される**特別なメンバ関数です。主な役割は、メンバ変数の初期化です。

コンストラクタには以下の特徴があります。

  - 関数名がクラス名と全く同じ。
  - 戻り値の型を指定しない（`void`も付けない）。
  - 引数を取ることができ、複数定義できる（オーバーロード）。

```cpp:constructor.cpp
class Person {
private:
    std::string name;
    int age;

public:
    // 引数付きコンストラクタ
    Person(const std::string& initName, int initAge) {
        std::cout << "Constructor called for " << initName << std::endl;
        name = initName;
        age = initAge;
    }
    // ...
};

int main() {
    // インスタンス生成時にコンストラクタが呼ばれ、引数が渡される
    Person yuko("Yuko", 22); // この時点でコンストラクタが実行される
    yuko.introduce();
}
```

```cpp-exec:constructor.cpp
Constructor called for Yuko
My name is Yuko, and I am 22 years old.
```

このように、インスタンス生成時に`()`で初期値を渡すことで、オブジェクトを生成と同時に有効な状態にできます。`set`関数を別途呼び出す手間が省け、初期化忘れを防ぐことができます。

### デストラクタ (Destructor)

**デストラクタ**は、インスタンスが破棄されるとき（例えば、変数のスコープを抜けるとき）に**自動的に呼び出される**特別なメンバ関数です。主な役割は、オブジェクトが使用していたリソース（メモリやファイルなど）の後片付けです。

デストラクタには以下の特徴があります。

  - 関数名が `~` + クラス名。
  - 戻り値も引数も取らない。
  - 1つのクラスに1つしか定義できない。

```cpp:constructor_destructor.cpp
#include <iostream>
#include <string>

class Person {
private:
    std::string name;
    int age;

public:
    // コンストラクタ
    Person(const std::string& initName, int initAge) {
        std::cout << "Constructor called for " << initName << "." << std::endl;
        name = initName;
        age = initAge;
    }

    // デストラクタ
    ~Person() {
        std::cout << "Destructor called for " << name << "." << std::endl;
    }

    void introduce() {
        std::cout << "My name is " << name << ", and I am " << age << " years old." << std::endl;
    }
};

void create_person_scope() {
    std::cout << "--- Entering scope ---" << std::endl;
    Person kenji("Kenji", 45); // kenjiはこのスコープ内でのみ生存
    kenji.introduce();
    std::cout << "--- Exiting scope ---" << std::endl;
} // ここでkenjiのスコープが終わり、デストラクタが呼ばれる

int main() {
    create_person_scope();

    std::cout << "--- Back in main ---" << std::endl;

    return 0;
}
```

```cpp-exec:constructor_destructor.cpp
--- Entering scope ---
Constructor called for Kenji.
My name is Kenji, and I am 45 years old.
--- Exiting scope ---
Destructor called for Kenji.
--- Back in main ---
```

実行結果を見ると、`kenji`オブジェクトが生成されたときにコンストラクタが、`create_person_scope`関数のスコープを抜けるときにデストラクタが自動的に呼び出されていることがわかります。動的に確保したメモリの解放など、クリーンアップ処理はデストラクタに書くのが定石です。この考え方は、今後の章で学ぶRAII（Resource Acquisition Is Initialization）という重要な概念に繋がります。

## この章のまとめ

この章では、C++におけるオブジェクト指向プログラミングの第一歩として、クラスの基本的な概念を学びました。

  - **クラス**は、データ（**メンバ変数**）と処理（**メンバ関数**）を一つにまとめた「設計図」です。
  - クラスから実体である**オブジェクト（インスタンス）**を生成して使用します。
  - **カプセル化**は、関連するデータと処理をまとめることです。
  - **アクセス制御**（`public`, `private`）により、外部からアクセスされたくないメンバを保護します（**情報の隠蔽**）。
  - **コンストラクタ**は、オブジェクト生成時に自動で呼ばれ、初期化を行います。
  - **デストラクタ**は、オブジェクト破棄時に自動で呼ばれ、後片付けを行います。

クラスを使いこなすことで、プログラムの部品化が進み、再利用性やメンテナンス性が格段に向上します。次の章では、クラスのさらに進んだ機能について学んでいきましょう。

### 練習問題1: 長方形クラス

幅(`width`)と高さ(`height`)をメンバ変数として持つ`Rectangle`クラスを作成してください。

  - メンバ変数は`private`で定義してください。
  - コンストラクタで幅と高さを初期化できるようにしてください。
  - 面積を計算して返す`getArea()`メソッドと、周の長さを計算して返す`getPerimeter()`メソッドを`public`で実装してください。
  - `main`関数で`Rectangle`クラスのインスタンスをいくつか生成し、面積と周の長さを表示するプログラムを作成してください。

```cpp:practice5_1.cpp
#include <iostream>
#include <string>
// ここにRectangleクラスを定義してください

int main() {
    // ここでRectangleクラスのインスタンスを生成し、面積と周の長さを表示してください

    return 0;
}
```

```cpp-exec:practice5_1.cpp
```


### 練習問題2: 書籍クラス

タイトル(`title`)、著者(`author`)、ページ数(`pages`)をメンバ変数として持つ`Book`クラスを作成してください。

  - メンバ変数は`private`で定義してください。
  - コンストラクタで、タイトル、著者、ページ数を初期化できるようにしてください。
  - 本の情報を整形してコンソールに出力する`printInfo()`メソッドを`public`で実装してください。（例: `Title: [タイトル], Author: [著者], Pages: [ページ数] pages`）
  - `main`関数で`Book`クラスのインスタンスを生成し、その情報を表示してください。

```cpp:practice5_2.cpp
#include <iostream>
#include <string>
// ここにBookクラスを定義してください

int main() {
    // ここでBookクラスのインスタンスを生成し、情報を表示してください

    return 0;
}
```

```cpp-exec:practice5_2.cpp
Title: The Great Gatsby, Author: F. Scott Fitzgerald, Pages: 180 pages
```
