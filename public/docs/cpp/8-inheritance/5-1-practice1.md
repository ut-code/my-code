---
id: cpp-inheritance-practice1
title: '練習問題1:乗り物の階層構造'
level: 3
---

### 練習問題1:乗り物の階層構造

`Vehicle` という親クラスを作成し、`move()` というメンバ関数を持たせましょう。次に、`Vehicle` を継承して `Car` クラスと `Motorcycle` クラスを作成し、それぞれが独自の `move()` の振る舞いをするようにオーバーライドしてください。

`main` 関数では、`Vehicle` のポインタの配列を作成し、`Car` と `Motorcycle` のオブジェクトを格納して、ループでそれぞれの `move()` を呼び出してください。

```cpp:practice9_1.cpp
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

```cpp-exec:practice9_1.cpp
```
