---
id: cpp-classes-advanced-operator-overload
title: 演算子のオーバーロード
level: 2
---

## 演算子のオーバーロード

C++では、`+`, `-`, `==`, `<<` などの組み込み演算子を、自作のクラスで使えるように**再定義（オーバーロード）**できます。これにより、クラスのインスタンスをあたかも組み込み型（`int`や`double`など）のように直感的に扱えるようになります。

例えば、2次元ベクトルを表す `Vector2D` クラスがあるとします。`v3 = v1 + v2;` のように、ベクトル同士の足し算を自然に記述できると便利ですよね。

演算子のオーバーロードは、メンバ関数または非メンバ関数（グローバル関数）として定義します。

| 演算子 | メンバ関数での定義 | 非メンバ関数での定義 |
| :--- | :--- | :--- |
| 二項演算子 (`+`, `==` etc.) | `T operator+(const U& rhs);` | `T operator+(const T& lhs, const U& rhs);` |
| 単項演算子 (`-`, `!` etc.) | `T operator-();` | `T operator-(const T& obj);` |

`Vector2D` クラスで `+`（加算）、`==`（等価比較）、`<<`（ストリーム出力）をオーバーロードしてみましょう。

```cpp:operator_overloading.cpp
#include <iostream>

class Vector2D {
public:
    double x, y;

    Vector2D(double x = 0.0, double y = 0.0) : x(x), y(y) {}

    // メンバ関数として + 演算子をオーバーロード
    Vector2D operator+(const Vector2D& rhs) const {
        return Vector2D(this->x + rhs.x, this->y + rhs.y);
    }

    // メンバ関数として == 演算子をオーバーロード
    bool operator==(const Vector2D& rhs) const {
        return (this->x == rhs.x) && (this->y == rhs.y);
    }
};

// 非メンバ関数として << 演算子をオーバーロード
// 第1引数が std::ostream& なので、メンバ関数にはできない
std::ostream& operator<<(std::ostream& os, const Vector2D& v) {
    os << "(" << v.x << ", " << v.y << ")";
    return os;
}

int main() {
    Vector2D v1(1.0, 2.0);
    Vector2D v2(3.0, 4.0);

    // operator+ が呼ばれる
    Vector2D v3 = v1 + v2;
    std::cout << "v1: " << v1 << std::endl; // operator<<
    std::cout << "v2: " << v2 << std::endl; // operator<<
    std::cout << "v3 = v1 + v2: " << v3 << std::endl; // operator<<

    // operator== が呼ばれる
    if (v1 == Vector2D(1.0, 2.0)) {
        std::cout << "v1 is equal to (1.0, 2.0)" << std::endl;
    }

    return 0;
}
```

```cpp-exec:operator_overloading.cpp
v1: (1, 2)
v2: (3, 4)
v3 = v1 + v2: (4, 6)
v1 is equal to (1.0, 2.0)
```

`operator<<` は、左辺のオペランドが `std::ostream` 型（`std::cout` など）であるため、`Vector2D` のメンバ関数としては定義できません。そのため、非メンバ関数として定義するのが一般的です。
