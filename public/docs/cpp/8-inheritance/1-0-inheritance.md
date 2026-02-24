---
id: cpp-inheritance-inheritance
title: クラスの継承
level: 2
---

## クラスの継承

**継承**とは、既存のクラス（**親クラス**または**基底クラス**と呼びます）の機能を引き継いで、新しいクラス（**子クラス**または**派生クラス**と呼びます）を作成する仕組みです。これにより、共通の機能を何度も書く必要がなくなり、コードの重複を避けられます。

例えば、「動物」という大まかなクラスがあり、その特徴を引き継いで「犬」や「猫」といった具体的なクラスを作ることができます。「犬」も「猫」も「動物」が持つ「食べる」という共通の機能を持っていますよね。

C++では、クラス名の後に `: public 親クラス名` と書くことで継承を表現します。

```cpp:inheritance_basic.cpp
#include <iostream>
#include <string>

// 親クラス (基底クラス)
class Animal {
public:
    std::string name;

    void eat() {
        std::cout << name << " is eating." << std::endl;
    }
};

// 子クラス (派生クラス)
// Animalクラスのpublicメンバを引き継ぐ
class Dog : public Animal {
public:
    void bark() {
        std::cout << name << " says Woof!" << std::endl;
    }
};

int main() {
    Dog my_dog;
    my_dog.name = "Pochi";

    // 親クラスから継承したメンバ変数・メンバ関数
    my_dog.eat();

    // Dogクラス独自のメンバ関数
    my_dog.bark();

    return 0;
}
```

```cpp-exec:inheritance_basic.cpp
Pochi is eating.
Pochi says Woof!
```

この例では、`Dog`クラスは`Animal`クラスを継承しています。そのため、`Dog`クラスのオブジェクト `my_dog` は、`Animal`クラスで定義されたメンバ変数 `name` やメンバ関数 `eat()` を、まるで自分のものであるかのように利用できます。
