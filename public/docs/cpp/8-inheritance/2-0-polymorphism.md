---
id: cpp-inheritance-polymorphism
title: 仮想関数 (virtual) とポリモーフィズム
level: 2
---

## 仮想関数 (virtual) とポリモーフィズム

継承の最も強力な側面は、**ポリモーフィズム（多態性）**を実現できることです。ポリモーフィズムとは、ギリシャ語で「多くの形を持つ」という意味で、プログラミングにおいては「**同じインターフェース（指示）で、オブジェクトの種類に応じて異なる振る舞いをさせる**」ことを指します。

これを実現するのが **仮想関数 (virtual function)** です。親クラスの関数宣言の前に `virtual` キーワードを付けると、その関数は仮想関数になります。

親クラスのポインタや参照は、子クラスのオブジェクトを指すことができます。このとき、呼び出された仮想関数は、ポインタが指している**オブジェクトの実際の型**に基づいて決定されます。

言葉だけでは難しいので、コードで見てみましょう。

```cpp:polymorphism_example.cpp
#include <iostream>
#include <string>

class Animal {
public:
    // speak() を仮想関数として宣言
    virtual void speak() {
        std::cout << "Some generic animal sound..." << std::endl;
    }
};

class Dog : public Animal {
public:
    // 親クラスの仮想関数を上書き (オーバーライド)
    void speak() override { // overrideキーワードについては後述
        std::cout << "Woof!" << std::endl;
    }
};

class Cat : public Animal {
public:
    // 親クラスの仮想関数を上書き (オーバーライド)
    void speak() override {
        std::cout << "Meow!" << std::endl;
    }
};

// Animalへのポインタを受け取る関数
void make_animal_speak(Animal* animal) {
    animal->speak(); // ポインタが指す先の実際のオブジェクトに応じて、適切な speak() が呼ばれる
}

int main() {
    Animal generic_animal;
    Dog dog;
    Cat cat;

    std::cout << "Calling through function:" << std::endl;
    make_animal_speak(&generic_animal);
    make_animal_speak(&dog); // Dogオブジェクトを渡す
    make_animal_speak(&cat); // Catオブジェクトを渡す

    return 0;
}
```

```cpp-exec:polymorphism_example.cpp
Calling through function:
Some generic animal sound...
Woof!
Meow!
```

`make_animal_speak` 関数は `Animal*` 型の引数を取りますが、`Dog`オブジェクトや`Cat`オブジェクトのアドレスを渡すことができています。そして、`animal->speak()` を呼び出すと、`animal` ポインタが実際に指しているオブジェクトの `speak()` が実行されます。これがポリモーフィズムです。もし `Animal`クラスの `speak()` に `virtual` が付いていなければ、どのオブジェクトを渡しても `Animal` の `speak()` が呼ばれてしまいます。
