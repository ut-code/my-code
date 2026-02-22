---
id: rust-enums-pattern-7-optiont-match
title: 'Option<T> と match'
level: 3
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
