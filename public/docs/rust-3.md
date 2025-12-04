# 第3章：関数と制御フロー

他の言語での経験がある皆さんなら、関数やループの基本的な概念はすでにご存知でしょう。しかし、Rustには「すべてが式である」という強力な設計思想があり、これが制御フローの書き方にも大きく影響しています。

この章では、Rust特有の「文（Statement）と式（Expression）」の違いを理解し、それを踏まえた関数の定義方法と、柔軟な制御フローについて学びます。

## 関数と「式」指向

Rustの関数定義は `fn` キーワードを使用し、変数や関数の命名規則にはスネークケース（`snake_case`）を採用するのが慣例です。

### 引数と戻り値

Rustは静的型付け言語であるため、関数の定義では**各引数の型を必ず宣言**する必要があります。戻り値がある場合は、矢印 `->` の後に型を記述します。

### 文（Statement）と式（Expression）

Rustを理解する上で最も重要な概念の一つがこれです。

  * **文 (Statement):** 何らかの操作を行い、値を返さないもの（例: `let y = 6;`）。
  * **式 (Expression):** 評価されて結果の値を返すもの（例: `5 + 6`、`{ code_block }`、関数呼び出し）。

他の多くの言語と異なり、Rustでは**ブロックの最後の式がそのブロックの戻り値**になります。`return` キーワードを使うこともできますが、一般的には「最後の行のセミコロンを省略する」スタイルが好まれます。

以下のコードで確認してみましょう。

```rust:functions_demo.rs
fn main() {
    let x = 5;
    let y = 10;

    // 値を返す関数呼び出し
    let result = add(x, y);
    println!("{} + {} = {}", x, y, result);

    // 文と式の違いを示すブロック
    let z = {
        let a = 3;
        a + 1 // セミコロンがないので、この式が評価されzに代入される
    };

    println!("zの値: {}", z);
}

// 引数を取り、i32型を返す関数
fn add(a: i32, b: i32) -> i32 {
    // 最後の行にセミコロンがないため、この式の計算結果が戻り値となる
    // "return a + b;" と書くのと同じ意味だが、こちらがRustらしい書き方
    a + b
}
```

```rust-exec:functions_demo.rs
5 + 10 = 15
zの値: 4
```

> **注意:** もし `a + 1` の後ろにセミコロンをつけて `a + 1;` とすると、それは「文」となり、値を返さなくなります（正確には空のタプル `()` を返します）。コンパイルエラーの原因になりやすいため注意してください。

## 制御フロー

Rustの制御フロー（`if`, `loop`, `while`, `for`）もまた「式」として扱うことができます。

### if 式

Rustの `if` は式です。つまり、条件分岐の結果を変数に代入することができます。
三項演算子（`condition ? a : b`）のような専用の構文はRustにはありませんが、`if` がその役割を果たします。

重要なルールとして、**条件式は必ず `bool` 型でなければなりません**。JavaScriptやC++のように、数値を自動的に `true/false` に変換することはありません。

```rust:if_expression.rs
fn main() {
    let condition = true;
    
    // ifの結果を変数に束縛できる
    // ifブロックとelseブロックが返す型は同じである必要がある
    let number = if condition {
        5
    } else {
        6
    };

    println!("numberの値: {}", number);
}
```

```rust-exec:if_expression.rs
numberの値: 5
```

### ループ構造

Rustには3種類のループがあります。

1.  `loop`: 無限ループ
2.  `while`: 条件付きループ
3.  `for`: コレクションや範囲に対するループ

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

#### for ループ

Rustで最も安全かつ頻繁に使用されるのが `for` ループです。配列の要素を走査したり、特定の回数だけ処理を行ったりする場合、インデックス管理が不要な `for` が推奨されます。

数値の範囲を指定する場合は `Range` 型（`start..end`）を使用します。

```rust:for_loop.rs
fn main() {
    let a = [10, 20, 30, 40, 50];

    // 配列のイテレータを使ったループ
    println!("--- 配列の走査 ---");
    for element in a.iter() {
        println!("値: {}", element);
    }

    // Rangeを使ったループ (1から3まで。4は含まない)
    println!("--- 範囲指定 ---");
    for number in 1..4 {
        println!("カウント: {}", number);
    }
}
```

```rust-exec:for_loop.rs
--- 配列の走査 ---
値: 10
値: 20
値: 30
値: 40
値: 50
--- 範囲指定 ---
カウント: 1
カウント: 2
カウント: 3
```

## この章のまとめ

  * **関数:** パラメータの型と戻り値の型を明示する。
  * **文と式:** Rustは式指向であり、セミコロンのない最後の式がブロックの戻り値となる。
  * **if式:** `if` は値を返すことができる。条件は必ず `bool` でなければならない。
  * **ループ:** `loop`（無限・値返し可能）、`while`（条件付き）、`for`（イテレータ・範囲）があり、特に `for` が推奨される。

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

### 練習問題 2: フィボナッチ数列

第 `n` 番目のフィボナッチ数を求める関数 `fib` を実装してください。
制御フロー（`if` または ループ）を使用してください。
（定義: 第0項=0, 第1項=1, 第n項 = 第n-1項 + 第n-2項）

```rust:practice3_2.rs
fn main() {
    let n = 10;
    println!("フィボナッチ数列の第 {} 項は {} です", n, fib(n));
}

// ここに関数を実装してください

```

```rust-exec:practice3_2.rs
フィボナッチ数列の第 10 項は 55 です
```
