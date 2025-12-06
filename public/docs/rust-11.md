# 第11章: ジェネリクスとトレイト

Rustチュートリアルの第11章へようこそ。
この章では、Rustにおける抽象化とコード再利用の核心である「ジェネリクス」と「トレイト」について解説します。

他のプログラミング言語での経験がある方にとって、ジェネリクスは馴染み深い概念かもしれませんが、トレイトはクラス継承とは異なるアプローチをとります。これらを理解することで、柔軟かつ高速なRustコードが書けるようになります。

## 他言語との違い：Rustのアプローチ

Rustのジェネリクスとトレイトは、C++のテンプレートやHaskellの型クラスに近い性質を持っています。JavaやPythonなどのオブジェクト指向言語（OOP）出身の方が特に意識すべき違いは以下の通りです。

1.  **継承の欠如:** Rustにはクラス継承（`extends`）がありません。代わりに**トレイト（Trait）**を使用して共通の振る舞いを定義し、構造体（Struct）や列挙型（Enum）に実装します。これは「継承よりコンポジション（構成）」を好む現代的な設計思想を言語レベルで強制するものです。
2.  **ダックタイピングとの違い:** Pythonなどの動的型付け言語では「アヒルのように歩き、アヒルのように鳴くなら、それはアヒルだ」というダックタイピングが一般的ですが、Rustではコンパイル時に厳密に型チェックを行います。「アヒルのように鳴く」能力があることを**トレイト境界**で明示する必要があります。
3.  **静的ディスパッチと単相化（Monomorphization）:** Rustのジェネリクスは、コンパイル時に具体的な型ごとにコードを生成（展開）します。これを単相化と呼びます。
      * **メリット:** 実行時のオーバーヘッドがゼロ（C++のテンプレートと同様）。仮想関数テーブル（vtable）を参照する動的ディスパッチのようなコストがかかりません。
      * **デメリット:** バイナリサイズが若干大きくなる可能性があります。

## ジェネリックなデータ型と関数

ジェネリクスを使用すると、具体的なデータ型に依存しないコードを書くことができます。Rustでは慣習として `T` （Typeの略）などの短い大文字識別子を使用します。

### ジェネリックな関数

もっとも単純な例として、型 `T` の引数をそのまま返す関数を考えてみましょう。

```rust:generic_function.rs
fn inspect<T>(value: T) {
    // 実際にはここで何か処理を行うが、
    // Tが何であるか（DisplayやDebug等）を知らないと
    // プリントすらできないため、ここでは単純にスコープを抜ける
}

fn main() {
    inspect(10);        // i32
    inspect(3.14);      // f64
    inspect("Hello");   // &str
    println!("Compilation successful.");
}
```

```rust-exec:generic_function.rs
Compilation successful.
```

これだけではあまり役に立ちませんが、構文としては `fn 関数名<型パラメータ>(引数)` という形になります。

### ジェネリックな構造体

構造体のフィールドの型をジェネリックにすることも可能です。

```rust:generic_struct.rs
// T型のxとyを持つPoint構造体
struct Point<T> {
    x: T,
    y: T,
}

// 異なる型を持たせたい場合は複数のパラメータを使う
struct MixedPoint<T, U> {
    x: T,
    y: U,
}

fn main() {
    let integer = Point { x: 5, y: 10 };
    let float = Point { x: 1.0, y: 4.0 };
    
    // 以下の行はコンパイルエラーになる（xとyが同じTである必要があるため）
    // let error = Point { x: 5, y: 4.0 }; 

    let mixed = MixedPoint { x: 5, y: 4.0 };

    println!("Int Point: x = {}, y = {}", integer.x, integer.y);
    println!("Mixed Point: x = {}, y = {}", mixed.x, mixed.y);
}
```

```rust-exec:generic_struct.rs
Int Point: x = 5, y = 10
Mixed Point: x = 5, y = 4
```

## トレイトの定義と実装

トレイトは、**「特定の型がどのような機能を持っているか」**を定義するものです。JavaやC\#の「インターフェース」に非常に近い概念です。

### トレイトの定義

ここでは、「情報を要約できる」という振る舞いを表す `Summary` トレイトを定義してみましょう。

```rust
pub trait Summary {
    fn summarize(&self) -> String; // メソッドのシグネチャのみ定義
}
```

### トレイトの実装

定義したトレイトを具体的な型に実装するには、`impl トレイト名 for 型名` ブロックを使用します。

```rust:trait_impl.rs
// トレイトの定義
trait Summary {
    fn summarize(&self) -> String;
    
    // デフォルト実装を持たせることも可能
    fn greeting(&self) -> String {
        String::from("(Read more below...)")
    }
}

struct NewsArticle {
    headline: String,
    location: String,
    author: String,
}

// NewsArticleにSummaryトレイトを実装
impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.author, self.location)
    }
}

struct Tweet {
    username: String,
    content: String,
}

// TweetにSummaryトレイトを実装
impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
    // greetingはデフォルト実装を使用するため記述しない
}

fn main() {
    let article = NewsArticle {
        headline: String::from("Rust 1.0 Released"),
        location: String::from("Internet"),
        author: String::from("Core Team"),
    };

    let tweet = Tweet {
        username: String::from("horse_ebooks"),
        content: String::from("of course, as you probably already know, people"),
    };

    println!("Article: {}", article.summarize());
    println!("Tweet: {} {}", tweet.summarize(), tweet.greeting());
}
```

```rust-exec:trait_impl.rs
Article: Rust 1.0 Released, by Core Team (Internet)
Tweet: horse_ebooks: of course, as you probably already know, people (Read more below...)
```

## トレイト境界（Trait Bounds）

ジェネリック関数を作る際、型 `T` に対して「どんな型でもいい」のではなく、「特定の機能（トレイト）を持っている型だけ受け付けたい」という場合がほとんどです。これを制約するのが**トレイト境界**です。

### 基本的な構文

以下の関数は、引数 `item` が `Summary` トレイトを実装していることを要求します。

```rust
// 糖衣構文（Syntactic Sugar）
fn notify(item: &impl Summary) {
    println!("Breaking news! {}", item.summarize());
}

// 正式なトレイト境界の構文
fn notify_formal<T: Summary>(item: &T) {
    println!("Breaking news! {}", item.summarize());
}
```

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

## 代表的な標準トレイト

Rustには、すべてのRustプログラマが知っておくべき標準トレイトがいくつかあります。これらはしばしば `#[derive(...)]` 属性を使って自動的に実装されます。

1.  **`Debug`**: `{:?}` でフォーマット出力するためのトレイト。開発中のデバッグ出力に必須です。
2.  **`Display`**: `{}` でフォーマット出力するためのトレイト。ユーザー向けの表示に使います。自動導出（derive）はできず、手動実装が必要です。
3.  **`Clone`**: `.clone()` メソッドで明示的にディープコピー（またはそれに準ずる複製）を作成するためのトレイト。
4.  **`Copy`**: 値がビット単位のコピーで複製できることを示すマーカートレイト。これが実装されている型（`i32`など）は、代入しても所有権が移動（Move）せず、コピーされます。

<!-- end list -->

```rust:std_traits.rs
// Debug, Clone, Copyを自動導出
#[derive(Debug, Clone, Copy)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p1 = Point { x: 10, y: 20 };
    
    // Copyトレイトがあるので、p1はmoveされない。コピーされる。
    let p2 = p1; 

    // Debugトレイトがあるので {:?} が使える
    println!("p1: {:?}", p1); 
    println!("p2: {:?}", p2);

    // Cloneトレイトがあるので明示的に呼ぶこともできる（Copyがある場合、動作はCopyと同じになることが多い）
    let p3 = p1.clone();
    println!("p3: {:?}", p3);
}
```

```rust-exec:std_traits.rs
p1: Point { x: 10, y: 20 }
p2: Point { x: 10, y: 20 }
p3: Point { x: 10, y: 20 }
```

> **注意:** `String` や `Vec<T>` などのヒープ領域へのポインタを持つ型は、所有権のルール上、安易に `Copy` を実装できません（二重解放エラーになるため）。それらは `Clone` のみを実装します。

# この章のまとめ

  * **ジェネリクス**: 型をパラメータ化し、コードの重複を減らします。コンパイル時に単相化されるため、実行時コストがかかりません。
  * **トレイト**: 共通の振る舞いを定義します。インターフェースに似ていますが、継承ではなくコンポジションを促進します。
  * **トレイト境界**: ジェネリクス型 `T` に対して、「特定のトレイトを実装している型のみ」を受け入れるよう制約を課します。
  * **標準トレイト**: `Debug`, `Display`, `Clone`, `Copy` など、Rustの基本動作を支える重要なトレイトが存在します。

これらを使いこなすことで、Rustコンパイラに安全性を保証させつつ、再利用性の高いライブラリのようなコードを書くことができるようになります。

### 練習問題 1: ジェネリックなペア

2つの異なる型 `T` と `U` を保持できる構造体 `Pair<T, U>` を作成してください。
そして、その構造体にメソッド `new` （インスタンス作成）と、デバッグ出力をするメソッド `print_pair` を実装してください。
（ヒント：`print_pair` 内で `T` と `U` を表示するには、それぞれの型に `Debug` トレイトの制約が必要です）

```rust:practice11_1.rs



fn main() {
    let pair = Pair::new(10, "Hello");
    pair.print_pair();
}
```
```rust-exec:practice11_1.rs
10 and "Hello"
```

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
