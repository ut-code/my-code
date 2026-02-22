---
id: rust-generics-traits-9-where
title: 複数のトレイト境界と where 句
level: 3
---

### 複数のトレイト境界と `where` 句

複数のトレイトが必要な場合（例えば「表示可能」かつ「要約可能」であってほしい場合）、`+` でつなぎます。制約が多くなりシグネチャが長くなる場合は、`where` 句を使って整理できます。

```rust:trait_bounds.rs
use std::fmt::Display;

trait Summary {
    fn summarize(&self) -> String;
}

struct Book {
    title: String,
    author: String,
}

impl Summary for Book {
    fn summarize(&self) -> String {
        format!("{} by {}", self.title, self.author)
    }
}

// Displayトレイトは標準ライブラリで定義されている（println!等で使用）
impl Display for Book {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Book({})", self.title)
    }
}

// itemはSummaryとDisplayの両方を実装している必要がある
fn notify<T>(item: &T)
where
    T: Summary + Display,
{
    println!("Notify: {}", item.summarize());
    println!("Display format: {}", item);
}

fn main() {
    let b = Book {
        title: String::from("The Rust Book"),
        author: String::from("Steve Klabnik"),
    };

    notify(&b);
}
```

```rust-exec:trait_bounds.rs
Notify: The Rust Book by Steve Klabnik
Display format: Book(The Rust Book)
```
