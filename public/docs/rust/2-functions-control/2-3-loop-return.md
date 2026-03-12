---
id: rust-functions-control-loop-return
title: loop と値の戻り
level: 4
question:
  - breakの後に値を置くことでループから値を返す機能は、他の言語にはあまりないように感じます。どんな時に特に便利ですか？
  - ループ内でbreak文が実行されなかった場合、loop式は何を返しますか？
  - counter * 2の後にセミコロンがないのは、これも式として扱われるからですか？
---

#### loop と値の戻り

`loop` キーワードは、明示的に `break` するまで永遠に繰り返します。面白い機能として、`break` の後に値を置くことで、ループ全体の結果としてその値を返すことができます。

```rust:loop_return.rs
fn main() {
    let mut counter = 0;

    // ループの結果を変数resultに代入
    let result = loop {
        counter += 1;

        if counter == 10 {
            // カウンタが10になったら、counter * 2 の値を返して終了
            break counter * 2;
        }
    };

    println!("ループの結果: {}", result);
}
```

```rust-exec:loop_return.rs
ループの結果: 20
```
