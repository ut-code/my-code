---
id: cpp-classes-basics-5-destructor
title: デストラクタ (Destructor)
level: 3
---

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
