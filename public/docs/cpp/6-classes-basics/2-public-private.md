---
id: cpp-classes-basics-2-public-private
title: 'アクセス制御: public と private による情報の隠蔽'
level: 2
---

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
