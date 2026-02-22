---
id: rust-ownership-7-move
title: Move（移動）：ヒープデータの場合
level: 3
---

### Move（移動）：ヒープデータの場合

`String`型のようにヒープにメモリを確保する型を見てみましょう。

```rust
let s1 = String::from("hello");
let s2 = s1; 
```

C++などの経験があると、これは「ポインタのコピー（浅いコピー）」あるいは「ディープコピー」のどちらかだと思うかもしれません。
しかしRustでは、これは**所有権の移動（Move）**とみなされます。

1.  `s1` はヒープ上の "hello" を指すポインタ、長さ、容量をスタックに持っています。
2.  `s2 = s1` を実行すると、スタック上のデータ（ポインタ等）のみが `s2` にコピーされます。
3.  **重要:** この瞬間、Rustは `s1` を**無効**とみなします。

なぜなら、もし `s1` も有効なままだと、スコープを抜けた時に `s1` と `s2` が同じヒープメモリを2回解放しようとしてしまう（二重解放エラー）からです。

以下のコードを実行して確認してみましょう。

```rust:move_error_demo.rs
fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // 所有権が s1 から s2 へ移動（ムーブ）

    // s1 はもう無効なので、以下の行はコンパイルエラーになる
    // println!("{}, world!", s1); 

    println!("s1 is moved.");
    println!("s2 is: {}", s2);
}
```

```rust-exec:move_error_demo.rs
s1 is moved.
s2 is: hello
```

もし `println!("{}", s1)` のコメントアウトを外すと、`value borrowed here after move` という有名なコンパイルエラーが発生します。
