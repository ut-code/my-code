---
id: cpp-functions-arg-by-value
title: 1. 値渡し (Pass by Value)
level: 3
---

### 1\. 値渡し (Pass by Value)

特に何も指定しない場合のデフォルトです。変数の**コピー**が作成され、関数に渡されます。

  * **メリット:** 安全。関数内で値を変更しても、呼び出し元の変数には影響しない。
  * **デメリット:** コストが高い。巨大な配列やオブジェクトを渡す際、丸ごとコピーするためメモリと時間を浪費する。

<!-- end list -->

```cpp:pass_by_value.cpp
#include <iostream>

// 値渡し：xは呼び出し元のコピー
void attemptUpdate(int x) {
    x = 100; // コピーを変更しているだけ
    std::cout << "関数内: " << x << " (アドレス: " << &x << ")" << std::endl;
}

int main() {
    int num = 10;
    std::cout << "呼び出し前: " << num << " (アドレス: " << &num << ")" << std::endl;
    
    attemptUpdate(num);
    
    // numは変わっていない
    std::cout << "呼び出し後: " << num << std::endl;
    return 0;
}
```

```cpp-exec:pass_by_value.cpp
呼び出し前: 10 (アドレス: 0x7ff...)
関数内: 100 (アドレス: 0x7ff...)  <-- アドレスが違う＝別の領域（コピー）
呼び出し後: 10
```
