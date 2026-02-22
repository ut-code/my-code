---
id: rust-collections-strings-13-2-pig-latin
title: 問題2：ピッグ・ラテン (Pig Latin) 変換
level: 3
---

### 問題2：ピッグ・ラテン (Pig Latin) 変換

文字列を「ピッグ・ラテン」と呼ばれる言葉遊びに変換する関数を作成してください。ルールは以下の通りです。

1.  単語が**母音** (a, i, u, e, o) で始まる場合、単語のお尻に `-hay` を追加します。
      * 例: `apple` -\> `apple-hay`
2.  単語が**子音**で始まる場合、最初の文字を単語のお尻に移動し、`-ay` を追加します。
      * 例: `first` -\> `irst-fay`

アルファベットのみ、小文字のみの想定で構いません。

```rust:practice9_2.rs
fn pig_latin(word: &str) -> String {
    // ここに変換ロジックを実装
    

}
fn main() {
    println!("{}", pig_latin("apple"));
    println!("{}", pig_latin("first"));
}
```
```rust-exec:practice9_2.rs
apple-hay
irst-fay
```
