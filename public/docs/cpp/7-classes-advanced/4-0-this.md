---
id: cpp-classes-advanced-this
title: thisポインタ
level: 2
---

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
