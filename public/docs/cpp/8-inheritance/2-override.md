---
id: cpp-inheritance-2-override
title: オーバーライド (override)
level: 2
---

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
