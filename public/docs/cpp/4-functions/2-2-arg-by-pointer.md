---
id: cpp-functions-arg-by-pointer
title: 2. ポインタ渡し (Pass by Pointer)
level: 3
---

### 2\. ポインタ渡し (Pass by Pointer)

C言語からある手法です。第4章で学んだポインタ（アドレス）を渡します。

  * **メリット:** コピーが発生しない（アドレス値のコピーのみ）。呼び出し元のデータを変更できる。
  * **デメリット:** 呼び出す際に `&` を付ける必要がある。関数内で `*` や `->` を使う必要があり、構文が汚れる。`nullptr` チェックが必要になることがある。

<!-- end list -->

```cpp:pass_by_pointer.cpp
#include <iostream>

// ポインタ渡し：アドレスを受け取る
void updateByPointer(int* ptr) {
    if (ptr != nullptr) {
        *ptr = 200; // アドレスの指す先を書き換える
    }
}

int main() {
    int num = 10;
    
    // アドレスを渡す
    updateByPointer(&num);
    
    std::cout << "ポインタ渡し後: " << num << std::endl;
    return 0;
}
```

```cpp-exec:pass_by_pointer.cpp
ポインタ渡し後: 200
```
