---
id: rust-collections-strings-10-api
title: エントリ API による更新
level: 3
---

### エントリ API による更新

「キーが存在しなければ値を挿入し、存在すれば何もしない（あるいは値を更新する）」というパターンは非常に一般的です。Rustでは `entry` APIを使うとこれを簡潔に書けます。

```rust:hashmap_update.rs
use std::collections::HashMap;

fn main() {
    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);

    // 上書き（同じキーでinsertすると値は上書きされる）
    scores.insert(String::from("Blue"), 25);
    println!("Blue updated: {:?}", scores);

    // キーがない場合のみ挿入 (or_insert)
    scores.entry(String::from("Yellow")).or_insert(50);
    scores.entry(String::from("Blue")).or_insert(50); // 既に25があるので無視される
    println!("Entry check: {:?}", scores);

    // 既存の値に基づいて更新（単語の出現回数カウントなど）
    let text = "hello world wonderful world";
    let mut map = HashMap::new();

    for word in text.split_whitespace() {
        // or_insertは挿入された値への可変参照(&mut V)を返す
        let count = map.entry(word).or_insert(0);
        *count += 1; // 参照外ししてインクリメント
    }

    println!("Word count: {:?}", map);
}
```

```rust-exec:hashmap_update.rs
Blue updated: {"Blue": 25}
Entry check: {"Blue": 25, "Yellow": 50}
Word count: {"world": 2, "hello": 1, "wonderful": 1}
```
