---
id: rust-modules-practice1
title: 練習問題1：ライブラリの設計
level: 3
question:
  - '`isbn`を非公開にするのは、どのような意図がありますか？'
  - '`Book`構造体の`new`関数は、なぜ`self`ではなく`Book`を返すのですか？'
  - ISBNを内部で適当な文字列に設定するとありますが、実際にはどのように生成すれば良いですか？
---

### 練習問題1：ライブラリの設計

以下の仕様に従って、架空の図書館システムモジュールを作成してください。

1.  `library` という親モジュールを作成する。
2.  その中に `books` というサブモジュールを作成する。
3.  `books` モジュールの中に `Book` 構造体を作成する。フィールドは `title` (String, 公開) と `isbn` (String, 非公開) とする。
4.  `Book` 構造体に、新しい本を作成するコンストラクタ `new(title: &str)` を実装する（ISBNは内部で適当な文字列を設定する）。
5.  `main` 関数から `library::books::Book` を使って本を作成し、タイトルを表示するコードを書く。

<!-- end list -->

```rust:practice8_1.rs

fn main() {
    let my_book = library::books::Book::new("Rust入門");
    println!("本のタイトル: {}", my_book.title);
}
```
```rust:library/mod.rs
```
```rust:library/books.rs
```

```rust-exec:practice8_1.rs
本のタイトル: Rust入門
```
