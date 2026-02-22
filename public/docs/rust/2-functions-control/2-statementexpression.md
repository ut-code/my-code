---
id: rust-functions-control-2-statementexpression
title: 文（Statement）と式（Expression）
level: 3
---

### 文（Statement）と式（Expression）

Rustを理解する上で最も重要な概念の一つがこれです。

  * **文 (Statement):** 何らかの操作を行い、値を返さないもの（例: `let y = 6;`）。
  * **式 (Expression):** 評価されて結果の値を返すもの（例: `5 + 6`、`{ code_block }`、関数呼び出し）。

他の多くの言語と異なり、Rustでは**ブロックの最後の式がそのブロックの戻り値**になります。`return` キーワードを使うこともできますが、一般的には「最後の行のセミコロンを省略する」スタイルが好まれます。

以下のコードで確認してみましょう。

```rust:functions_demo.rs
fn main() {
    let x = 5;
    let y = 10;

    // 値を返す関数呼び出し
    let result = add(x, y);
    println!("{} + {} = {}", x, y, result);

    // 文と式の違いを示すブロック
    let z = {
        let a = 3;
        a + 1 // セミコロンがないので、この式が評価されzに代入される
    };

    println!("zの値: {}", z);
}

// 引数を取り、i32型を返す関数
fn add(a: i32, b: i32) -> i32 {
    // 最後の行にセミコロンがないため、この式の計算結果が戻り値となる
    // "return a + b;" と書くのと同じ意味だが、こちらがRustらしい書き方
    a + b
}
```

```rust-exec:functions_demo.rs
5 + 10 = 15
zの値: 4
```

> **注意:** もし `a + 1` の後ろにセミコロンをつけて `a + 1;` とすると、それは「文」となり、値を返さなくなります（正確には空のタプル `()` を返します）。コンパイルエラーの原因になりやすいため注意してください。
