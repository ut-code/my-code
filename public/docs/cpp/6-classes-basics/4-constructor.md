---
id: cpp-classes-basics-4-constructor
title: コンストラクタ (Constructor)
level: 3
---

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
