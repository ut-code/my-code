---
id: cpp-classes-basics-practice1
title: '練習問題1: 長方形クラス'
level: 3
question:
  - privateで定義したメンバ変数を、コンストラクタで初期化するにはどうすればよいですか？
  - 面積と周の長さを計算して返すメソッドは、具体的にどのようなコードになりますか？
  - main関数で複数のRectangleインスタンスを生成する具体的な方法が知りたいです。
---

### 練習問題1: 長方形クラス

幅(`width`)と高さ(`height`)をメンバ変数として持つ`Rectangle`クラスを作成してください。

  - メンバ変数は`private`で定義してください。
  - コンストラクタで幅と高さを初期化できるようにしてください。
  - 面積を計算して返す`getArea()`メソッドと、周の長さを計算して返す`getPerimeter()`メソッドを`public`で実装してください。
  - `main`関数で`Rectangle`クラスのインスタンスをいくつか生成し、面積と周の長さを表示するプログラムを作成してください。

```cpp:practice7_1.cpp
#include <iostream>
#include <string>
// ここにRectangleクラスを定義してください

int main() {
    // ここでRectangleクラスのインスタンスを生成し、面積と周の長さを表示してください

    return 0;
}
```

```cpp-exec:practice7_1.cpp
```
