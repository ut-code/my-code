---
id: rust-error-handling-3-result
title: 基本的な Result の処理
level: 3
---

### 基本的な `Result` の処理

他の言語での `try-catch` の代わりに、Rustでは `match` 式を使って成功と失敗を分岐させるのが基本です。

```rust:result_basic.rs
fn divide(numerator: f64, denominator: f64) -> Result<f64, String> {
    if denominator == 0.0 {
        // 失敗時は Err でラップして返す
        return Err(String::from("0で割ることはできません"));
    }
    // 成功時は Ok でラップして返す
    Ok(numerator / denominator)
}

fn main() {
    let inputs = vec![(10.0, 2.0), (5.0, 0.0)];

    for (num, den) in inputs {
        let result = divide(num, den);

        match result {
            Ok(val) => println!("{} / {} = {}", num, den, val),
            Err(e) => println!("エラー: {}", e),
        }
    }
}
```

```rust-exec:result_basic.rs
10 / 2 = 5
エラー: 0で割ることはできません
```

この明示的な分岐により、プログラマはエラー処理を「忘れる」ことができなくなります（コンパイラが `Result` を無視すると警告を出したり、使おうとすると型エラーになるため）。
