# 第7章: 列挙型（Enum）とパターンマッチ

Rustチュートリアル第7章へようこそ。
これまでの章では、構造体を使って関連するデータをまとめる方法を学びました。この章では、**列挙型（Enum）と、それに関連する強力な制御フロー構造であるパターンマッチ**について学びます。

他の言語（C、C++、Javaなど）でのEnumは、単に「名前付き定数のリスト」であることが多いですが、RustのEnumは「代数的データ型（Algebraic Data Types）」に近い性質を持っており、はるかに強力です。

## Enumの定義と値の保持

最も基本的なEnumの使い方は、C言語などと同様に「ありうる値の列挙」です。しかし、RustのEnumの真価は、**各バリアント（選択肢）にデータを持たせることができる**点にあります。

例えば、IPアドレスを表現する場合を考えてみましょう。IPアドレスにはV4とV6があり、それぞれ異なる形式のデータを持ちます。

```rust:ip_address.rs
#[derive(Debug)]
enum IpAddr {
    V4(u8, u8, u8, u8), // 4つのu8を持つ
    V6(String),         // Stringを持つ
}

fn main() {
    let home = IpAddr::V4(127, 0, 0, 1);
    let loopback = IpAddr::V6(String::from("::1"));

    println!("Home: {:?}", home);
    println!("Loopback: {:?}", loopback);
}
```

```rust-exec:ip_address.rs
Home: V4(127, 0, 0, 1)
Loopback: V6("::1")
```

### 構造体との違い

これを構造体で実装しようとすると、「種類（kind）」フィールドと「データ」フィールドを持つ必要がありますが、V4の場合にV6用のフィールドが無駄になったり、型安全性が下がったりします。
RustのEnumを使うと、**「V4なら必ず4つの数値がある」「V6なら文字列がある」**ということが型レベルで保証されます。

### あらゆる種類のデータを埋め込める

Enumの各バリアントには、名前付きフィールドを持つ構造体のような形や、タプルのような形など、自由に定義できます。

```rust:message_enum.rs
#[derive(Debug)]
enum Message {
    Quit,                       // データなし
    Move { x: i32, y: i32 },    // 名前付きフィールド（構造体風）
    Write(String),              // 単一のString（タプル風）
    ChangeColor(i32, i32, i32), // 3つのi32（タプル風）
}

impl Message {
    // Enumにもメソッドを定義できる
    fn call(&self) {
        println!("メッセージを処理します: {:?}", self);
    }
}

fn main() {
    let m1 = Message::Write(String::from("hello"));
    let m2 = Message::Move { x: 10, y: 20 };
    let m3 = Message::Quit;

    m1.call();
    m2.call();
    m3.call();
}
```

```rust-exec:message_enum.rs
メッセージを処理します: Write("hello")
メッセージを処理します: Move { x: 10, y: 20 }
メッセージを処理します: Quit
```

## Option\<T\> 型（Null安全性の核心）

Rustには、他の多くの言語にある **Null（ヌル）が存在しません**。
その代わり、標準ライブラリで定義された `Option<T>` というEnumを使用します。これは「値が存在するかもしれないし、しないかもしれない」ことを表現します。

`Option<T>` は以下のように定義されています（概念図）：

```rust
enum Option<T> {
    Some(T), // 値がある場合。Tは任意の型。
    None,    // 値がない場合。
}
```

### なぜこれが安全なのか？

`Option<T>` 型と `T` 型（例えば `i32`）は異なる型です。そのため、**「値がないかもしれないもの」を、チェックせずにそのまま計算に使うことがコンパイラレベルで禁止されます。**

```rust:option_intro.rs
fn main() {
    let some_number = Some(5);
    let some_string = Some("a string");

    // Noneの場合は型推論できないため、明示的に型を指定する必要がある
    let absent_number: Option<i32> = None;

    let x: i8 = 5;
    let y: Option<i8> = Some(5);

    // 以下の行はコンパイルエラーになります。
    // i8 と Option<i8> は足し算できません。
    // let sum = x + y; 

    println!("x: {}", x);
    // 値を取り出すには明示的な処理が必要（後述のmatchなどを使う）
    println!("y is: {:?}", y);
    println!("absent is: {:?}", absent_number);
}
```

```rust-exec:option_intro.rs
x: 5
y is: Some(5)
absent is: None
```

値を使うためには、`Option<T>` から `T` を取り出す処理（Nullチェックに相当）を必ず書かなければなりません。これにより、「うっかりNullを参照してクラッシュ」という事故を防げます。

## match フロー制御演算子

`match` は、Enumの値を処理するための最も強力なツールです。C言語やJavaの `switch` に似ていますが、より表現力が高く、コンパイラによる**網羅性チェック（Exhaustiveness Check）**があります。

### 網羅性チェック

`match` は、あり得るすべてのパターンをカバーしなければなりません。一つでも漏れているとコンパイルエラーになります。

```rust:match_shapes.rs
enum Shape {
    Circle(f64),             // 半径
    Rectangle(f64, f64),     // 幅, 高さ
    Triangle(f64, f64, f64), // 3辺の長さ（簡略化のためヘロンの公式用）
}

fn calculate_area(shape: Shape) -> f64 {
    match shape {
        // パターンマッチで中のデータを取り出す（バインディング）
        Shape::Circle(radius) => {
            std::f64::consts::PI * radius * radius
        },
        Shape::Rectangle(w, h) => {
            w * h
        },
        Shape::Triangle(a, b, c) => {
            let s = (a + b + c) / 2.0;
            (s * (s - a) * (s - b) * (s - c)).sqrt()
        }
    }
}

fn main() {
    let c = Shape::Circle(10.0);
    let r = Shape::Rectangle(3.0, 4.0);

    println!("円の面積: {:.2}", calculate_area(c));
    println!("長方形の面積: {:.2}", calculate_area(r));
}
```

```rust-exec:match_shapes.rs
円の面積: 314.16
長方形の面積: 12.00
```

### Option\<T\> と match

`Option` の中身を取り出す際も `match` がよく使われます。

```rust:match_option.rs
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}

fn main() {
    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);

    println!("Five: {:?}", five);
    println!("Six: {:?}", six);
    println!("None: {:?}", none);
}
```

```rust-exec:match_option.rs
Five: Some(5)
Six: Some(6)
None: None
```

### `_` プレースホルダー

全ての値を個別に書きたくない場合、`_`（アンダースコア）を使って「その他すべて」にマッチさせることができます。これは `switch` 文の `default` に相当します。

```rust
let dice_roll = 9;
match dice_roll {
    3 => println!("3が出ました"),
    7 => println!("7が出ました"),
    _ => println!("それ以外が出ました"), // 3, 7 以外はここに来る
}
```

## if let 記法

`match` は強力ですが、**「ある1つのパターンだけ処理して、他は全部無視したい」**という場合には記述が長くなりがちです。
そのような場合に `if let` が便利です。

これは以下の `match` のシンタックスシュガー（糖衣構文）です。

```rust
// matchを使う場合（冗長）
let config = Some("config_value");
match config {
    Some(val) => println!("設定値: {}", val),
    _ => (), // 何もしない
}
```

これと同じことを `if let` で書くと以下のようになります。

```rust:if_let_demo.rs
fn main() {
    let config = Some("config_value");
    let missing: Option<&str> = None;

    // 「もし config が Some(val) というパターンにマッチするならブロックを実行」
    if let Some(val) = config {
        println!("設定値があります: {}", val);
    }

    // else も使えます
    if let Some(val) = missing {
        println!("設定値: {}", val);
    } else {
        println!("設定値がありません");
    }
}
```

```rust-exec:if_let_demo.rs
設定値があります: config_value
設定値がありません
```

`if let` を使うとコードが短くなりますが、`match` が強制する「網羅性チェック」の恩恵は失われます。状況に応じて使い分けましょう。

## この章のまとめ

  * **Enum（列挙型）**: RustのEnumは、異なる型や量のデータを各バリアントに持たせることができる（代数的データ型）。
  * **Option\<T\>**: `Some(T)` と `None` によって、Null安全を実現する。値を使うには `Option` の皮を剥く処理が必須となる。
  * **match**: パターンマッチングを行う制御フロー。コンパイラが全てのケースを網羅しているかチェックしてくれる。
  * **if let**: 単一のパターンだけを扱いたい場合の簡潔な記法。

### 練習問題 1: コインの分類機

アメリカの硬貨を表すEnum `Coin` を定義してください。

  * バリアント: `Penny` (1セント), `Nickel` (5セント), `Dime` (10セント), `Quarter` (25セント)
  * `Quarter` バリアントには、`UsState` というEnum（各州の名前を持つ）をデータとして持たせてください（例: `Quarter(UsState::Alaska)`）。
  * `Coin` を受け取り、その価値（セント単位）を文字列で返す関数 `value_in_cents` を `match` を使って実装してください。Quarterの場合は、その州の名前も同時に返してください。

```rust:practice7_1.rs
// UsState, Coin, value_in_cents を作成してください

fn main() {
    let coin1 = Coin::Penny;
    let coin2 = Coin::Quarter(UsState::California);

    println!("Coin1 value: {}", value_in_cents(coin1));
    println!("Coin2 value: {}", value_in_cents(coin2));
}
```

```rust-exec:practice7_1.rs
Coin1 value: 1 cent
Coin2 value: 25 cents from California
```

### 練習問題 2: 簡易計算機

2つの数値に対する操作を表すEnum `Operation` を定義し、計算を行ってください。

1.  Enum `Operation` を定義します。
      * `Add`: 2つの `i32` を持つ
      * `Subtract`: 2つの `i32` を持つ
      * `Multiply`: 2つの `i32` を持つ
      * `Divide`: 2つの `i32` を持つ
2.  関数 `calculate(op: Operation) -> Option<i32>` を実装してください。
      * `match` を使用して計算結果を返します。
      * 割り算の場合、0での除算（ゼロ除算）を防ぐため、分母が0なら `None` を返し、計算できるなら `Some(結果)` を返してください。他の演算は常に `Some` で返します。
3.  `main` 関数でいくつかのパターンを試し、結果を表示してください。

```rust:practice7_2.rs
// Operation enum と calculate 関数を実装してください

fn main() {
    let add = Operation::Add(5, 3);
    let subtract = Operation::Subtract(10, 4);
    let multiply = Operation::Multiply(6, 7);
    let divide = Operation::Divide(20, 4);
    let divide_by_zero = Operation::Divide(10, 0);

    println!("5 + 3 = {:?}", calculate(add));
    println!("10 - 4 = {:?}", calculate(subtract));
    println!("6 * 7 = {:?}", calculate(multiply));
    println!("20 / 4 = {:?}", calculate(divide));
    println!("10 / 0 = {:?}", calculate(divide_by_zero));
}
```

```rust-exec:practice7_2.rs
5 + 3 = Some(8)
10 - 4 = Some(6)
6 * 7 = Some(42)
20 / 4 = Some(5)
10 / 0 = None
```
