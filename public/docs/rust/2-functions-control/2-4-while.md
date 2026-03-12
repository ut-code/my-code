---
id: rust-functions-control-while
title: while
level: 4
question:
  - whileループと、ifとbreakを組み合わせたloopループは、どのように使い分けるべきですか？
---

#### while

`while` は他の言語とほぼ同じです。条件が真である限り実行されます。

```rust
// 例（実行不要）
let mut number = 3;
while number != 0 {
    println!("{}!", number);
    number -= 1;
}
```
