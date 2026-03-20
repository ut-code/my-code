---
id: rust-lifetimes-practice1
title: '練習問題 1: 参照を持つ構造体とメソッド'
level: 3
question:
  - '`Book` 構造体の定義で、どこに `''a` を記述すれば良いのですか？'
  - '`Book` の `title` フィールドを `String` ではなく `&str` にするメリットは何ですか？'
  - '`# [derive(Debug)]` は、なぜ必要なのでしょうか？'
---

### 練習問題 1: 参照を持つ構造体とメソッド

以下の要件を満たすコードを作成してください。

1.  `Book` という構造体を定義してください。
2.  この構造体は `title` というフィールドを持ち、それは `String` ではなく文字列スライス `&str` です（ライフタイム注釈が必要です）。
3.  `main` 関数で `String` 型の変数（例: `"The Rust Programming Language"`）を作成し、`Book` のインスタンスにその参照を渡してください。
4.  `Book` のインスタンスを表示してください（`Debug` トレイを導出(`#[derive(Debug)]`)して構いません）。

```rust:practice12_1.rs
// ここにBookの定義を書いてください


fn main() {
    let book_title = String::from("The Rust Programming Language");
    let my_book = Book {
        title: &book_title,
    };

    println!("Book details: {:?}", my_book);
}
```

```rust-exec:practice12_1.rs
Book details: Book { title: "The Rust Programming Language" }
```
