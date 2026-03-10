---
id: cpp-project-build-include-guard-by-define
title: 伝統的なインクルードガード
level: 3
question:
  - '`#ifndef` の `ifndef` は何かの略ですか？'
  - '`MATH_UTILS_H` のようなマクロ名は、自分で自由に決めても良いのですか？ 命名規則はありますか？'
  - この `#ifndef` から `#endif` までの間に、ヘッダファイルの中身以外のものを書いても大丈夫ですか？
---

### 伝統的なインクルードガード

プリプロセッサディレクティブである `#ifndef`, `#define`, `#endif` を使います。

```cpp
#ifndef MATH_UTILS_H // もし MATH_UTILS_H が未定義なら
#define MATH_UTILS_H // MATH_UTILS_H を定義する

// --- ヘッダファイルの中身 ---
int add(int a, int b);
// -------------------------

#endif // MATH_UTILS_H
```

  * **最初のインクルード**: `MATH_UTILS_H` は未定義なので、`#define` が実行され、中身が読み込まれます。
  * **2回目以降のインクルード**: `MATH_UTILS_H` は既に定義されているため、`#ifndef` から `#endif` までのすべてが無視されます。

マクロ名 (`MATH_UTILS_H`) は、ファイル名に基づいて一意になるように命名するのが慣習です。
