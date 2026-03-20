---
id: rust-functions-control-practice1
title: '練習問題 1: 摂氏・華氏変換'
level: 2
question:
  - 摂氏を華氏に変換する関数で、浮動小数点数を扱う際の注意点はありますか？
  - この関数の戻り値の型は何にするのが適切ですか？
---

## 練習問題 1: 摂氏・華氏変換

摂氏（Celsius）を華氏（Fahrenheit）に変換する関数 `c_to_f` を作成してください。
公式: F = C × 1.8 + 32

```rust:practice3_1.rs
fn main() {
    let celsius_temp = 25.0;
    let fahrenheit_temp = c_to_f(celsius_temp);
    println!("{}°C は {}°F です", celsius_temp, fahrenheit_temp);
}

// ここに関数を実装してください

```

```rust-exec:practice3_1.rs
25°C は 77°F です
```
