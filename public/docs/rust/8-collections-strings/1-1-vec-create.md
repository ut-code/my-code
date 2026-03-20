---
id: rust-collections-strings-vec-create
title: ベクタの作成と更新
level: 3
question:
  - Vec::new()とvec!マクロはどちらを使うのが一般的ですか？
  - 型注釈Vec<i32>が「必要な場合がある」とは、どんな時ですか？
  - ベクタを変更する際にmutが必要なのはなぜですか？
  - popメソッドがOptionを返すのはなぜですか？Noneが返されるのはどんな時ですか？
  - println!マクロの{:?}という記号は何ですか？
---

### ベクタの作成と更新

`Vec::new()` 関数または `vec!` マクロを使用して作成します。要素を追加するには `push` メソッドを使いますが、ベクタを変更するためには `mut` で可変にする必要があります。

```rust:vector_basics.rs
fn main() {
    // 空のベクタを作成（型注釈が必要な場合がある）
    let mut v: Vec<i32> = Vec::new();
    v.push(5);
    v.push(6);
    v.push(7);

    // vec!マクロを使うと型推論が効くため記述が楽
    let mut v2 = vec![1, 2, 3];
    v2.push(4);

    println!("v: {:?}", v);
    println!("v2: {:?}", v2);
    
    // popで末尾の要素を削除して取得（Optionを返す）
    let last = v2.pop();
    println!("Popped: {:?}", last);
    println!("v2 after pop: {:?}", v2);
}
```

```rust-exec:vector_basics.rs
v: [5, 6, 7]
v2: [1, 2, 3, 4]
Popped: Some(4)
v2 after pop: [1, 2, 3]
```
