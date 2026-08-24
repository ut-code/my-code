---
id: cpp-classes-basics-instance
title: 'インスタンスの生成: クラスからオブジェクトを作ってみる'
level: 2
question:
  - オブジェクトとインスタンスは同じものと考えていいですか？違いはありますか？
  - Person taro;でインスタンスを生成するとありますが、メモリ上では具体的に何が起きているのでしょうか？
  - ドット演算子.を使ってメンバにアクセスする理由は何ですか？他のアクセス方法もありますか？
term:
  - インスタンス
  - インスタンス化
  - オブジェクト
---

## インスタンスの生成: クラスからオブジェクトを作ってみる

[[クラス]]はあくまで「設計図」です。実際にプログラムで利用するためには、この設計図をもとに実体を作る必要があります。[[クラス]]から作られた実体のことを**オブジェクト (object)** または**インスタンス (instance)** と呼び、オブジェクトを作ることを**インスタンス化 (instantiation)** と言います。

インスタンス化の構文は、[[変数]]の宣言とよく似ています。

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

このように、`クラス名 インスタンス名;` という形でインスタンスを生成できます。インスタンスの[[メンバ変数]]や[[メンバ関数]]にアクセスするには、`インスタンス名.メンバ名` のように**ドット演算子 (`.`)** を使います。`taro`と`hanako`は同じ`Person`[[クラス]]から作られたインスタンスですが、それぞれが独立したデータを持っていることがわかります。
