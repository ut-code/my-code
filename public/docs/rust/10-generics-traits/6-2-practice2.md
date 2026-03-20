---
id: rust-generics-traits-practice2
title: '問題 2: 最大値を探す'
level: 3
question:
  - ジェネリックなスライス `&[T]` を受け取るとありますが、これは `vec!` と何が違うのですか？
  - >-
    比較を行うために `PartialOrd` が、スライスから値を取り出して返すために `Copy`
    が必要とありますが、それぞれのトレイトがなぜ必要なのか理由を教えてください。
  - スライスの中から最大値を探すための具体的なロジックが思いつきません。どのようなアルゴリズムを使えば良いですか？
---

### 問題 2: 最大値を探す

ジェネリックなスライス `&[T]` を受け取り、その中の最大値を返す関数 `largest` を作成してください。
比較を行うためには `T` にどのようなトレイト境界が必要か考えてください（ヒント：比較には `std::cmp::PartialOrd` が必要です。また、スライスから値を取り出して返すには `Copy` があると簡単です）。

```rust:practice11_2.rs



fn main() {
    let number_list = vec![34, 50, 25, 100, 65];
    let result = largest(&number_list);
    println!("The largest number is {}", result);

    let char_list = vec!['y', 'm', 'a', 'q'];
    let result = largest(&char_list);
    println!("The largest char is {}", result);
}
```

```rust-exec:practice_solutions.rs
The largest number is 100
The largest char is y
```
