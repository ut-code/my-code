# 第6章: 構造体とメソッド構文

他のオブジェクト指向言語（C++、Java、Pythonなど）の経験がある方にとって、Rustの**構造体（Struct）**は「クラス」に似ているように見えますが、決定的な違いがいくつかあります。

最も大きな違いは以下の2点です：

1.  **クラス継承が存在しない**: Rustには`extends`や親クラスという概念がありません（コードの再利用には、後述する「トレイト」や「コンポジション」を使用します）。
2.  **データと振る舞いの分離**: データ定義（`struct`）とメソッド定義（`impl`）は明確に分かれています。

この章では、関連するデータをグループ化し、それに対する操作を定義する方法を学びます。

## 構造体の定義とインスタンス化

構造体は、異なる型の値を一つにまとめて名前を付けたカスタムデータ型です。

### 基本的な定義

C言語の `struct` や、メソッドを持たないクラスのようなものです。フィールド名と型を定義します。

```rust:user_struct.rs
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}

fn main() {
    // インスタンス化
    // フィールドの順番は定義と異なっても構いません
    let mut user1 = User {
        email: String::from("someone@example.com"),
        username: String::from("someusername123"),
        active: true,
        sign_in_count: 1,
    };

    // ドット記法でフィールドにアクセス
    user1.email = String::from("another@example.com");

    println!("User: {}, Email: {}", user1.username, user1.email);
}
```

```rust-exec:user_struct.rs
User: someusername123, Email: another@example.com
```

> **注意**: Rustでは、インスタンス全体が可変（`mut`）か不変かのどちらかになります。特定のフィールドだけを可変（`mut`）にすることはできません。

### フィールド初期化省略記法

関数引数や変数の名前がフィールド名と同じ場合、記述を省略できます。これはJavaScriptのオブジェクト定義に似ています。

```rust
fn build_user(email: String, username: String) -> User {
    User {
        email,      // email: email と同じ
        username,   // username: username と同じ
        active: true,
        sign_in_count: 1,
    }
}
```

### 構造体更新記法

既存のインスタンスの値を元に、一部だけ変更した新しいインスタンスを作成する場合、`..` 構文を使用できます。

```rust
// user1のデータを元に、emailだけ変更したuser2を作成
let user2 = User {
    email: String::from("another@example.com"),
    ..user1 // 残りのフィールドはuser1と同じ値が入る
};
```

## タプル構造体とユニット様構造体

名前付きフィールドを持たない構造体も定義できます。

### タプル構造体 (Tuple Structs)

フィールドに名前がなく、型だけが並んでいる構造体です。「型」として区別したい場合に便利です。例えば、同じ `(i32, i32, i32)` でも、「色」と「座標」は計算上混ぜるべきではありません。

```rust:tuple_structs.rs
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);

    // black と origin は構造が同じでも、型としては別物なので
    // 関数に渡す際などにコンパイラが区別してくれます。
    
    // 中身へのアクセスはタプル同様にインデックスを使用
    println!("Origin X: {}", origin.0);
}
```

```rust-exec:tuple_structs.rs
Origin X: 0
```

### ユニット様構造体 (Unit-like Structs)

フィールドを全く持たない構造体です。`struct AlwaysEqual;` のように定義します。これらは、データを持たずに振る舞い（トレイト）だけを実装したい場合に役立ちますが、詳細は後の章で扱います。

## 所有権と構造体

構造体における所有権の扱いは非常に重要です。

1.  **所有するデータ**: `String`や`Vec`のような所有権を持つ型をフィールドにすると、その構造体のインスタンスがデータの所有者になります。構造体がドロップされると、フィールドのデータもドロップされます。
2.  **参照**: 構造体に「参照（\&strなど）」を持たせることも可能ですが、これには**ライフタイム（第12章）の指定が必要になります。そのため、現段階では構造体には（参照ではなく）`String`などの所有権のある型**を使うことを推奨します。

<!-- end list -->

```rust
// 推奨（現段階）
struct User {
    username: String, // Userがデータを所有する
}

// 非推奨（ライフタイムの知識が必要になるためコンパイルエラーになる）
// struct User {
//     username: &str, 
// }
```

## impl ブロック：メソッドと関連関数

ここが、他言語のクラスにおける「メソッド定義」に相当する部分です。データ（`struct`）とは別に、`impl`（implementation）ブロックを使って振る舞いを定義します。

### メソッドの定義

メソッドは、最初の引数が必ず `self` （自分自身のインスタンス）になる関数です。

  * `&self`: データを読み取るだけ（借用・不変）。最も一般的。
  * `&mut self`: データを書き換える（借用・可変）。
  * `self`: 所有権を奪う（ムーブ）。メソッド呼び出し後に元の変数は使えなくなる。変換処理などで使う。

<!-- end list -->

```rust:rectangle.rs
#[derive(Debug)] // print!で{:?}を使ってデバッグ表示するために必要
struct Rectangle {
    width: u32,
    height: u32,
}

// Rectangle型に関連する関数やメソッドを定義
impl Rectangle {
    // メソッド：面積を計算する（読み取りのみなので &self）
    fn area(&self) -> u32 {
        self.width * self.height
    }

    // メソッド：他の四角形を含めるか判定する
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}

fn main() {
    let rect1 = Rectangle { width: 30, height: 50 };
    let rect2 = Rectangle { width: 10, height: 40 };

    // メソッド呼び出し（自動参照外し機能により、rect1.area() と書ける）
    println!("The area of the rectangle is {} pixels.", rect1.area());

    if rect1.can_hold(&rect2) {
        println!("rect1 can hold rect2");
    }
}
```

```rust-exec:rectangle.rs
The area of the rectangle is 1500 pixels.
rect1 can hold rect2
```

### 関連関数 (Associated Functions)

`impl`ブロックの中で、第1引数に `self` を取らない関数も定義できます。これらはインスタンスではなく、型そのものに関連付けられた関数です。
他言語での「静的メソッド（Static Method）」に相当します。

最も一般的な用途は、コンストラクタのような役割を果たす初期化関数の作成です。Rustには `new` というキーワードはありませんが、慣習として `new` という名前の関連関数をよく作ります。

```rust:associated_fn.rs
#[derive(Debug)]
struct Circle {
    radius: f64,
}

impl Circle {
    // 関連関数（selfがない）
    // コンストラクタのように振る舞う
    fn new(radius: f64) -> Circle {
        Circle { radius }
    }
    
    // メソッド（selfがある）
    fn area(&self) -> f64 {
        3.14159 * self.radius * self.radius
    }
}

fn main() {
    // 関連関数の呼び出しは :: を使う
    let c = Circle::new(2.0);
    
    println!("Circle radius: {}, area: {}", c.radius, c.area());
}
```

```rust-exec:associated_fn.rs
Circle radius: 2, area: 12.56636
```

## この章のまとめ

  * **構造体 (`struct`)** は関連するデータをまとめるカスタム型です。
  * **タプル構造体** は名前付きフィールドを持たない構造体で、特定の型を区別するのに便利です。
  * **メソッド** は `impl` ブロック内に定義し、第1引数に `self` を取ります。
  * **関連関数** は `self` を取らず、`型名::関数名` で呼び出します（コンストラクタ `new` など）。
  * Rustには継承がないため、データ構造とメソッドの組み合わせのみでオブジェクト指向的な設計を行います。

次章では、Rustの強力な機能の一つである「列挙型（Enum）」と、フロー制御の要である「パターンマッチ」について学びます。

### 練習問題1: RPGのキャラクター

以下の要件を満たす `Character` 構造体と `impl` ブロックを作成してください。

1.  フィールド:
      * `name`: キャラクター名 (`String`)
      * `hp`: 現在のヒットポイント (`i32`)
      * `attack_power`: 攻撃力 (`i32`)
2.  関連関数 `new`:
      * 名前を受け取り、hpを100、attack\_powerを10で初期化したインスタンスを返す。
3.  メソッド `take_damage`:
      * ダメージ量 (`i32`) を受け取り、`hp` から引く。ただし、`hp` は0未満にならないようにする（0で止める）。
      * このメソッドは `hp` を変更するため、`&mut self` が必要です。

```rust:practice6_1.rs
// ここにCharacter構造体とimplブロックを実装してください


fn main() {
    let mut hero = Character::new(String::from("Hero"));
    println!("{} has {} HP.", hero.name, hero.hp);
    
    hero.take_damage(30);
    println!("After taking damage, {} has {} HP.", hero.name, hero.hp);
    
    hero.take_damage(80);
    println!("After taking more damage, {} has {} HP.", hero.name, hero.hp);
}
```
```rust-exec:practice6_1.rs
Hero has 100 HP.
After taking damage, Hero has 70 HP.
After taking more damage, Hero has 0 HP.
```

### 練習問題2: 座標計算

2次元座標を表すタプル構造体 `Point(f64, f64)` を作成し、以下を実装してください。

1.  関連関数 `origin`: 原点 `(0.0, 0.0)` を持つ `Point` を返す。
2.  メソッド `distance_to`: 別の `Point` への参照を受け取り、2点間の距離を計算して返す `f64`。
      * ヒント: 距離の公式は sqrt((x₂ - x₁)² + (y₂ - y₁)²) です。平方根は `f64`型の値に対して `.sqrt()` メソッドで計算できます。

```rust:practice6_2.rs
// ここにPointタプル構造体とimplブロックを実装してください


fn main() {
    let p1 = Point::origin();
    let p2 = Point(3.0, 4.0);
    
    let distance = p1.distance_to(&p2);
    println!("Distance from origin to p2 is {}", distance);
}
```
```rust-exec:practice6_2.rs
Distance from origin to p2 is 5.0
```
