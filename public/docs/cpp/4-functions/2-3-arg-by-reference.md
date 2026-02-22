---
id: cpp-functions-arg-by-reference
title: 3. 参照渡し (Pass by Reference)
level: 3
---

### 3\. 参照渡し (Pass by Reference)

C++の真骨頂です。**「参照（Reference）」**とは、既存の変数に別の名前（エイリアス）をつける機能です。引数の型に `&` を付けるだけで宣言できます。

  * **メリット:** コピーが発生しない。**構文は「値渡し」と同じように書ける**（`*`や`&`を呼び出し側で意識しなくていい）。`nullptr` になることがないため安全性が高い。
  * **デメリット:** 関数内で値を変更すると、呼び出し元も変わる（意図しない変更に注意）。

<!-- end list -->

```cpp:pass_by_ref.cpp
#include <iostream>

// 参照渡し：引数に & をつける
// ref は呼び出し元の変数の「別名」となる
void updateByRef(int& ref) {
    ref = 300; // 普通の変数のように扱えるが、実体は呼び出し元
}

int main() {
    int num = 10;
    
    // 値渡しと同じように呼び出せる（&num と書かなくていい！）
    updateByRef(num);
    
    std::cout << "参照渡し後: " << num << std::endl;
    return 0;
}
```

```cpp-exec:pass_by_ref.cpp
参照渡し後: 300
```
