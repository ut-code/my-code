---
id: rust-enums-pattern-option-match
title: Option<T> と match
level: 3
question:
  - OptionのSome(i)からiを取り出すのは、matchのパターンマッチングでどのように行われているのですか？
  - plus_one関数はOption<i32>を受け取ってOption<i32>を返していますが、これは一般的なパターンですか？
---

### Option\<T\> と match

`Option` の中身を取り出す際も `match` がよく使われます。

```rust:match_option.rs
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}

fn main() {
    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);

    println!("Five: {:?}", five);
    println!("Six: {:?}", six);
    println!("None: {:?}", none);
}
```

```rust-exec:match_option.rs
Five: Some(5)
Six: Some(6)
None: None
```
