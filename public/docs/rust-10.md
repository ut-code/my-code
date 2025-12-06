# 第10章：エラーハンドリング

ようこそ、第10章へ。ここまでRustの所有権や型システムについて学んできましたが、この章では実用的なアプリケーション開発において避けては通れない「エラーハンドリング」について解説します。

他の多くの言語（Java, Python, C++など）とRustが最も大きく異なる点の一つが、**「例外（Exception）」が存在しない**ことです。

Rustでは、エラーは「誰かがキャッチしてくれることを祈って投げるもの」ではなく、**「戻り値として明示的に処理すべき値」**として扱われます。この設計思想により、予期せぬクラッシュを防ぎ、堅牢なソフトウェアを構築することができます。

## エラーの分類

Rustでは、エラーを大きく2つのカテゴリーに分類します。

1.  **回復不可能なエラー (Unrecoverable Errors):**
      * バグ、配列の範囲外アクセス、メモリ不足など。
      * プログラムは即座に停止すべき状況。
      * 手段: `panic!`
2.  **回復可能なエラー (Recoverable Errors):**
      * ファイルが見つからない、パースの失敗、ネットワーク切断など。
      * 呼び出し元で対処（リトライやエラーメッセージ表示）が可能な状況。
      * 手段: `Result<T, E>`

## 回復不可能なエラー (`panic!`)

プログラムが続行不可能な状態に陥った場合、Rustはパニック（panic）を起こします。これはデフォルトでスタックを巻き戻し（unwind）、データを掃除してからプログラムを終了させます。

もっとも単純な方法は `panic!` マクロを呼ぶことです。

```rust:panic_demo.rs
fn main() {
    println!("処理を開始します...");

    // 何か致命的なことが起きたと仮定
    panic!("ここで致命的なエラーが発生しました！");

    // 以下の行は実行されません
    println!("この行は表示されません");
}
```

```rust-exec:panic_demo.rs
処理を開始します...
thread 'main' panicked at panic_demo.rs:5:5:
ここで致命的なエラーが発生しました！
```

**ポイント:**

  * `panic!` は、基本的に「プログラムのバグ」や「どうしようもない状況」でのみ使用します。
  * 通常の制御フロー（入力値のバリデーション失敗など）には使用しません。

## 回復可能なエラー (`Result<T, E>`)

Rustのエラーハンドリングの主役は `Result` 列挙型です。以前の章で学んだ `Option` に似ていますが、失敗した場合に「なぜ失敗したか（エラー内容）」を持つ点が異なります。

定義は以下のようになっています（標準ライブラリに含まれています）。

```rust
enum Result<T, E> {
    Ok(T),  // 成功時：値 T を含む
    Err(E), // 失敗時：エラー E を含む
}
```

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

## `unwrap` と `expect` の使い所

毎回 `match` で分岐を書くのは冗長な場合があります。「失敗したらプログラムをクラッシュさせていい」という場合や、「ここでは絶対に失敗しない」と確信がある場合のために、ヘルパーメソッドが用意されています。

### `unwrap`

`Result` が `Ok` なら中身を返し、`Err` なら即座に `panic!` します。手っ取り早いですが、エラーメッセージは一般的で詳細が含まれません。

### `expect`

`unwrap` と同じ挙動ですが、パニック時に表示するメッセージを指定できます。**デバッグのしやすさから、通常は `unwrap` よりも `expect` が推奨されます。**

```rust:unwrap_expect.rs
fn main() {
    let valid_str = "100";
    let invalid_str = "hello";

    // 1. unwrap: 成功時は値を返す
    let n: i32 = valid_str.parse().unwrap();
    println!("パース成功: {}", n);

    // 2. expect: 失敗時は指定したメッセージと共に panic! する
    // 以下の行を実行するとクラッシュします
    let _m: i32 = invalid_str.parse().expect("数値のパースに失敗しました");
}
```

```rust-exec:unwrap_expect.rs
thread 'main' panicked at unwrap_expect.rs:11:35:
数値のパースに失敗しました: ParseIntError { kind: InvalidDigit }
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

**使い所のヒント:**

  * **プロトタイピング・実験:** `unwrap` を多用してロジックを素早く組む。
  * **テストコード:** テスト中に失敗したらテスト自体を落としたいので `unwrap` が有用。
  * **「絶対に失敗しない」ロジック:** 理論上エラーにならない場合でも、型合わせのために `unwrap` が必要な場合があります。

## エラーの伝播（`?` 演算子）

関数内でエラーが発生した際、その場で処理せずに呼び出し元へエラーを返したいことがよくあります。これを「エラーの伝播（propagation）」と呼びます。

Rustにはこれを劇的に短く書くための **`?` 演算子** があります。

  * `Result` 値の後ろに `?` を置く。
  * 値が `Ok` なら、中身を取り出して処理を続行。
  * 値が `Err` なら、**その関数から即座に `return Err(...)` する。**

<!-- end list -->

```rust:error_propagation.rs
use std::num::ParseIntError;

// 文字列を受け取り、最初の文字を切り出して数値に変換し、10倍して返す
fn get_first_digit_scaled(text: &str) -> Result<i32, String> {
    // 1. 文字列が空の場合のエラー処理
    let first_char = text.chars().next().ok_or("空の文字列です".to_string())?;

    // 2. 文字を数値にパース（失敗したらエラー伝播）
    // ParseIntError を String に変換するために map_err を使用しています
    // (?演算子はFromトレイトを使って自動変換を行いますが、ここでは単純化のため手動変換します)
    let num: i32 = first_char.to_string()
        .parse()
        .map_err(|_| format!("'{}' は数値ではありません", first_char))?;

    Ok(num * 10)
}

fn main() {
    match get_first_digit_scaled("5 apples") {
        Ok(v) => println!("計算結果: {}", v),
        Err(e) => println!("エラー発生: {}", e),
    }

    match get_first_digit_scaled("banana") {
        Ok(v) => println!("計算結果: {}", v),
        Err(e) => println!("エラー発生: {}", e),
    }
}
```

```rust-exec:error_propagation.rs
計算結果: 50
エラー発生: 'b' は数値ではありません
```

`?` 演算子を使うことで、`match` のネスト地獄（右方向へのドリフト）を防ぎ、コードの流れを「成功ルート」を中心に記述できます。

## カスタムエラー型の定義

ライブラリや大規模なアプリケーションを作る場合、`String` 型のエラーでは情報が不足します。Rustでは `std::error::Error` トレイトを実装した独自の型（通常は Enum）を定義するのが一般的です。

Rustのエコシステムでは、ボイラープレート（定型コード）を減らすために **`thiserror`** というクレートが非常に人気ですが、ここでは仕組みを理解するために標準機能だけで実装してみます。

```rust:custom_error.rs
use std::fmt;

// 1. 独自のエラー型を定義
#[derive(Debug)]
enum MyToolError {
    IoError(String),
    ParseError(String),
    LogicError,
}

// 2. Display トレイトの実装（ユーザー向けのエラーメッセージ）
impl fmt::Display for MyToolError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            MyToolError::IoError(msg) => write!(f, "IOエラー: {}", msg),
            MyToolError::ParseError(msg) => write!(f, "解析エラー: {}", msg),
            MyToolError::LogicError => write!(f, "ロジックエラーが発生しました"),
        }
    }
}

// 3. Error トレイトの実装（これを実装することで、Rustのエラーエコシステムと統合される）
impl std::error::Error for MyToolError {}

// 使用例
fn dangerous_operation(input: i32) -> Result<String, MyToolError> {
    match input {
        0 => Err(MyToolError::IoError("ディスク書き込み失敗".into())),
        1 => Err(MyToolError::ParseError("不正なヘッダ".into())),
        2 => Err(MyToolError::LogicError),
        _ => Ok("成功！".into()),
    }
}

fn main() {
    let results = [dangerous_operation(0), dangerous_operation(3)];
    
    for res in results {
        match res {
            Ok(s) => println!("結果: {}", s),
            Err(e) => println!("失敗: {}", e), // Displayの実装が使われる
        }
    }
}
```

```rust-exec:custom_error.rs
失敗: IOエラー: ディスク書き込み失敗
結果: 成功！
```

**補足:** `thiserror` クレートを使うと、上記の `impl fmt::Display` などをマクロで自動生成でき、以下のように簡潔に書けます（参考情報）。

```rust
// thiserrorを使った場合のイメージ
#[derive(thiserror::Error, Debug)]
enum MyToolError {
    #[error("IOエラー: {0}")]
    IoError(String),
    // ...
}
```

## この章のまとめ

  * **例外はない**: Rustは戻り値 `Result<T, E>` でエラーを表現する。
  * **Panic**: 回復不可能なエラーには `panic!` を使うが、乱用しない。
  * **Result処理**: 基本は `match` で処理する。
  * **便利メソッド**: `unwrap` は強制取り出し（失敗時パニック）、`expect` はメッセージ付きパニック。
  * **?演算子**: エラーが発生したら即座に呼び出し元へ `Err` を返すショートカット。
  * **型安全性**: コンパイラがエラー処理の漏れを指摘してくれるため、堅牢なコードになる。

### 練習問題 1: 安全な割り算

2つの `f64` を受け取り、割り算の結果を返す関数 `safe_div` を作成してください。

  * 戻り値は `Result<f64, String>` としてください。
  * 0で割ろうとした場合は、「Division by zero」というエラーメッセージを含む `Err` を返してください。
  * `main` 関数で、正常なケースとエラーになるケースの両方を呼び出し、結果を表示してください。

<!-- end list -->

```rust:practice10_1.rs
fn safe_div(a: f64, b: f64) -> Result<f64, String> {
    // ここにコードを書いてください
    
}

fn main() {
    let test_cases = vec![(10.0, 2.0), (5.0, 0.0)];

    for (a, b) in test_cases {
        match safe_div(a, b) {
            Ok(result) => println!("{} / {} = {}", a, b, result),
            Err(e) => println!("エラー: {}", e),
        }
    }
}
```

```rust-exec:practice10_1.rs
10 / 2 = 5
エラー: Division by zero
```

### 練習問題 2: データ処理チェーン（エラー伝播）

文字列形式の数値（例: "10,20,30"）を受け取り、カンマ区切りの最初の数値を2倍にして返す関数 `process_csv_data` を作成してください。

  * 以下の手順を行い、途中でエラーがあれば `?` 演算子などを使って伝播させてください。
    1.  文字列をカンマ `,` で分割し( `split` メソッド)、最初の要素を取得する（要素がない場合はエラー）。
    2.  取得した文字列を `i32` にパースする( `parse` メソッド)（パース失敗はエラー）。
    3.  数値を2倍して返す。
  * 関数の戻り値は `Result<i32, String>` とします（エラー型の変換が必要な場合は `map_err` を活用してください）。

<!-- end list -->

```rust:practice10_2.rs
fn process_csv_data(csv: &str) -> Result<i32, String> {


}

fn main() {
    let inputs = ["10,20,30", "abc,20", "", "  ,50"];

    for input in inputs {
        print!("Input: {:<10} => ", format!("\"{}\"", input));
        match process_csv_data(input) {
            Ok(n) => println!("結果: {}", n),
            Err(e) => println!("エラー: {}", e),
        }
    }
}
```

```rust-exec:practice10_2.rs
Input: "10,20,30" => 結果: 20
Input: "abc,20"   => エラー: 'abc' は数値ではありません
Input: ""         => エラー: 要素が空です
Input: "  ,50"    => エラー: 要素が空です
```

