---
id: cpp-project-build-include-guard
title: インクルードガード
level: 2
---

## インクルードガード

複数のファイルから同じヘッダファイルがインクルードされる状況はよくあります。例えば、`A.h`が`B.h`をインクルードし、ソースファイルが`A.h`と`B.h`の両方をインクルードするような場合です。

もしヘッダファイルに何の対策もしていないと、同じ内容（クラス定義や関数宣言）が複数回読み込まれ、「再定義」としてコンパイルエラーが発生してしまいます。

```cpp:A.h
#include "B.h" // B.hをインクルード

// A.hの内容
```

```cpp:B.h
class B {
    // Bクラスの内容
};
```

```cpp:bad_include_app.cpp
#include "A.h"
#include "B.h" // B.hが二重にインクルードされる

int main() {
    [[maybe_unused]] B b; // Bクラスを使う

    return 0;
}
```

```cpp-exec:bad_include_app.cpp
In file included from bad_include_app.cpp:2:
B.h:1:7: error: redefinition of 'class B'
    1 | class B {
      |       ^
In file included from A.h:1,
                 from bad_include_app.cpp:1:
B.h:1:7: note: previous definition of 'class B'
    1 | class B {
      |       ^
```

この問題を解決するのが**インクルードガード**です。インクルードガードは、ヘッダファイルの内容が1つの翻訳単位（ソースファイル）内で一度しか読み込まれないようにするための仕組みです。
