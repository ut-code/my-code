# 第7章: 継承とポリモーフィズム

オブジェクト指向プログラミング(OOP)の真の力を解放する時が来ました！💪 この章では、OOPの強力な柱である「**継承 (Inheritance)**」と「**ポリモーフィズム (Polymorphism) / 多態性**」を学びます。これらの概念をマスターすることで、コードの再利用性を高め、柔軟で拡張性の高いプログラムを設計できるようになります。

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

## オーバーライド (override)

先ほどの例で `override` というキーワードが登場しましたね。これはC++11から導入されたもので、子クラスの関数が**親クラスの仮想関数を上書き（オーバーライド）する意図があることを明示する**ためのものです。

`override` を付けておくと、もし親クラスに対応する仮想関数が存在しない場合（例えば、関数名をタイプミスした場合など）に、コンパイラがエラーを検出してくれます。

```cpp
class Dog : public Animal {
public:
    // もし親クラスのspeakがvirtualでなかったり、
    // speek() のようにタイプミスしたりすると、コンパイルエラーになる。
    void speak() override {
        std::cout << "Woof!" << std::endl;
    }
};
```

意図しないバグを防ぐために、仮想関数をオーバーライドする際は必ず `override` を付ける習慣をつけましょう。

## 抽象クラス

時には、「具体的な実装を持たず、子クラスに実装を強制するための設計図」としてのみ機能するクラスを定義したい場合があります。これが**抽象クラス (Abstract Class)** です。

抽象クラスは、**純粋仮想関数 (pure virtual function)** を1つ以上持つクラスです。純粋仮想関数は、末尾に `= 0` を付けて宣言します。

```cpp
virtual void function_name() = 0; // これが純粋仮想関数
```

抽象クラスは以下の特徴を持ちます。

  * インスタンス化（オブジェクトの作成）ができない。
  * 抽象クラスを継承した子クラスは、全ての純粋仮想関数をオーバーライド（実装）しなければならない。さもなければ、その子クラスもまた抽象クラスとなる。

```cpp:abstract_class_example.cpp
#include <iostream>

// Shapeは純粋仮想関数 draw() を持つため、抽象クラスとなる
class Shape {
public:
    // 純粋仮想関数
    // このクラスを継承するクラスは、必ず draw() を実装しなければならない
    virtual void draw() = 0;

    // 仮想デストラクタ (継承を扱う際は重要。詳しくは今後の章で)
    virtual ~Shape() {}
};

class Circle : public Shape {
public:
    void draw() override {
        std::cout << "Drawing a circle: ○" << std::endl;
    }
};

class Square : public Shape {
public:
    void draw() override {
        std::cout << "Drawing a square: □" << std::endl;
    }
};

int main() {
    // Shape my_shape; // エラー！抽象クラスはインスタンス化できない

    Circle circle;
    Square square;

    Shape* shape1 = &circle;
    Shape* shape2 = &square;

    shape1->draw();
    shape2->draw();

    return 0;
}
```

```cpp-exec:abstract_class_example.cpp
Drawing a circle: ○
Drawing a square: □
```

`Shape` クラスは「図形なら描画できるはずだ」というインターフェース（契約）を定義し、具体的な描画方法は子クラスである `Circle` や `Square` に任せています。このように、抽象クラスはプログラムの骨格となる設計を強制するのに非常に役立ちます。

## この章のまとめ

  * **継承**: 既存のクラスの機能を引き継ぎ、コードの再利用性を高める仕組みです。`(子クラス) : public (親クラス)` のように書きます。
  * **ポリモーフィズム**: 「同じ指示でも、オブジェクトの種類によって異なる振る舞いをさせる」性質です。
  * **仮想関数 (`virtual`)**: ポリモーフィズムを実現するための鍵です。親クラスの関数に `virtual` を付けると、ポインタや参照経由で呼び出した際に、オブジェクトの実際の型に応じた関数が実行されます。
  * **オーバーライド (`override`)**: 子クラスで親クラスの仮想関数を上書きする意図を明示します。コンパイラがチェックしてくれるため、安全性が向上します。
  * **抽象クラス**: 1つ以上の**純粋仮想関数 (`virtual ... = 0;`)** を持つクラスです。インスタンス化できず、継承されるための設計図として機能します。

### 練習問題1:乗り物の階層構造

`Vehicle` という親クラスを作成し、`move()` というメンバ関数を持たせましょう。次に、`Vehicle` を継承して `Car` クラスと `Motorcycle` クラスを作成し、それぞれが独自の `move()` の振る舞いをするようにオーバーライドしてください。

`main` 関数では、`Vehicle` のポインタの配列を作成し、`Car` と `Motorcycle` のオブジェクトを格納して、ループでそれぞれの `move()` を呼び出してください。

```cpp:practice7_1.cpp
#include <iostream>
#include <string>


// ここに Vehicle, Car, Motorcycle クラスを定義してください


int main() {
    // Vehicleのポインタの配列を作成
    Vehicle* vehicles[2];

    Car my_car;
    Motorcycle my_motorcycle;

    vehicles[0] = &my_car;
    vehicles[1] = &my_motorcycle;

    // それぞれのmove()を呼び出す
    for (int i = 0; i < 2; ++i) {
        vehicles[i]->move();
    }

    return 0;
}
```

```cpp-exec:practice7_1.cpp
```

### 問題2: 従業員の給与計算

`Employee` という抽象クラスを定義してください。このクラスは、従業員の名前を保持し、給与を計算するための純粋仮想関数 `calculate_salary()` を持ちます。

次に、`Employee` を継承して、`FullTimeEmployee`（月給制）と `PartTimeEmployee`（時給制）の2つのクラスを作成します。それぞれのクラスで `calculate_salary()` を具体的に実装してください。

`main` 関数で、それぞれのクラスのインスタンスを作成し、給与が正しく計算されることを確認してください。

```cpp:practice7_2.cpp
#include <iostream>
#include <string>

// ここに Employee, FullTimeEmployee, PartTimeEmployee クラスを定義してください


int main() {
    FullTimeEmployee full_time_emp("Alice", 3000); // 月給3000ドル
    PartTimeEmployee part_time_emp("Bob", 20, 80); // 時給20ドル、80時間勤務

    std::cout << full_time_emp.get_name() << "'s Salary: $" << full_time_emp.calculate_salary() << std::endl;
    std::cout << part_time_emp.get_name() << "'s Salary: $" << part_time_emp.calculate_salary() << std::endl;

    return 0;
}
```

```cpp-exec:practice7_2.cpp
Alice's Salary: $3000
Bob's Salary: $1600
```
