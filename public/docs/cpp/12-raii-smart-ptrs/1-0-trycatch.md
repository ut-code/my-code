---
id: cpp-raii-smart-ptrs-trycatch
title: '例外処理: try, catch を使ったエラーハンドリング'
level: 2
---

## 例外処理: try, catch を使ったエラーハンドリング

プログラムでは、ファイルの読み込み失敗やメモリ確保の失敗など、予期せぬエラーが発生することがあります。C++では、このような状況を処理するために**例外 (Exception)** という仕組みが用意されています。

例外処理は、以下の3つのキーワードで構成されます。

  * `throw`: 例外的な状況が発生したことを知らせるために、例外オブジェクトを「投げる」。
  * `try`: 例外が発生する可能性のあるコードブロックを囲む。
  * `catch`: `try` ブロック内で投げられた例外を「捕まえて」処理する。

基本的な構文を見てみましょう。

```cpp:exception_basic.cpp
#include <iostream>
#include <stdexcept> // std::runtime_error のために必要

// 0で割ろうとしたら例外を投げる関数
double divide(int a, int b) {
    if (b == 0) {
        // エラー内容を示す文字列を渡して例外オブジェクトを作成し、投げる
        throw std::runtime_error("Division by zero!");
    }
    return static_cast<double>(a) / b;
}

int main() {
    int a = 10;
    int b = 0;

    try {
        // 例外が発生する可能性のあるコード
        std::cout << "Trying to divide..." << std::endl;
        double result = divide(a, b);
        std::cout << "Result: " << result << std::endl; // この行は実行されない
    } catch (const std::runtime_error& e) {
        // std::runtime_error 型の例外をここで捕まえる
        std::cerr << "Caught an exception: " << e.what() << std::endl;
    }

    std::cout << "Program finished." << std::endl;
    return 0;
}
```

```cpp-exec:exception_basic.cpp
Trying to divide...
Caught an exception: Division by zero!
Program finished.
```

`divide` 関数内で `b` が0だった場合に `throw` が実行され、関数の実行は即座に中断されます。制御は呼び出し元の `catch` ブロックに移り、そこでエラー処理が行われます。これにより、エラーが発生してもプログラム全体がクラッシュすることなく、安全に処理を続行できます。
