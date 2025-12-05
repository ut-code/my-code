# 第8章：モジュールシステムとパッケージ管理

これまでの章では、関数や構造体を使ってコードを整理する方法を学びました。プログラムの規模が大きくなると、コードをさらに大きな単位で整理し、詳細を隠蔽（カプセル化）し、再利用性を高める必要が出てきます。

他の言語（C++のnamespace、Javaのpackage、Pythonのmoduleなど）での経験があれば、Rustのモジュールシステムも直感的に理解できる部分が多いですが、\*\*「デフォルトで非公開（private）」\*\*というRust特有の哲学や、ファイルシステムとの対応関係には注意が必要です。

この章では、Rustのコード整理の仕組みである「モジュールシステム」と、外部ライブラリを活用するための「パッケージ管理」について学びます。

## パッケージ、クレート、モジュール

Rustのモジュールシステムは、以下の3つの概念で構成されています。

1.  **パッケージ (Package):** `Cargo.toml` ファイルを持ち、1つ以上のクレートをビルドするための機能です。通常 `cargo new` で作成されるプロジェクト全体を指します。
2.  **クレート (Crate):** 木構造状のモジュール群からなるコンパイル単位です。
      * **バイナリクレート:** 実行可能な形式（`src/main.rs` がルート）。
      * **ライブラリクレート:** 他のプロジェクトから利用される形式（`src/lib.rs` がルート）。
3.  **モジュール (Module):** クレート内のコードをグループ化し、可視性（公開/非公開）を制御する仕組みです。

### モジュールの基本定義 (`mod`)

モジュールは `mod` キーワードを使って定義します。モジュールの中に、さらにモジュール（サブモジュール）を入れることも可能です。

まずは、1つのファイル内でモジュールを定義して、その構造を見てみましょう。

```rust:simple_module.rs
// "restaurant" という名前のモジュールを定義
mod restaurant {
    // モジュール内に関数を定義
    // 注意: デフォルトでは親モジュールからアクセスできません（後述）
    fn make_coffee() {
        println!("コーヒーを淹れます");
    }

    // サブモジュール
    mod front_of_house {
        fn add_to_waitlist() {
            println!("順番待ちリストに追加しました");
        }
    }
}

fn main() {
    // restaurant::make_coffee();
    // restaurant::front_of_house::add_to_waitlist();
}
```

```rust-exec:simple_module.rs
```

このコードはコンパイルに通りますが、`main` 関数から `make_coffee` などを呼び出そうとするとエラーになります。それは**可視性**の問題があるからです。

## 可視性と `pub` キーワード

Rustのモジュールシステムの最大の特徴は、\*\*「すべてのアイテム（関数、構造体、モジュールなど）は、デフォルトで非公開（private）」\*\*であるという点です。

  * **非公開:** 定義されたモジュール自身と、その子モジュールからのみアクセス可能。親モジュールからは見えません。
  * **公開 (`pub`):** 親モジュールや外部からアクセス可能になります。

親モジュール（この場合は `main` 関数がいるルート）から子モジュールの中身を使うには、明示的に `pub` をつける必要があります。

```rust:simple_module_with_pub.rs
mod restaurant {
    // pubがないので、restaurantモジュール内からしか呼べない
    fn make_coffee() {
        println!("コーヒーを淹れます");
    }

    // pubをつけてサブモジュールも公開
    pub mod front_of_house {
        // ここも公開関数にする
        pub fn add_to_waitlist() {
            println!("順番待ちリストに追加しました");
        }
    }
}
fn main() {
    // これで呼び出せるようになる
    restaurant::front_of_house::add_to_waitlist();

    // restaurant::make_coffee();
}
```

```rust-exec:simple_module_with_pub.rs
順番待ちリストに追加しました
```

### 構造体の可視性

構造体に `pub` をつけた場合、**構造体そのものは公開されますが、フィールドはデフォルトで非公開のまま**です。フィールドごとに `pub` を決める必要があります。

```rust:struct_visibility.rs
mod kitchen {
    pub struct Breakfast {
        pub toast: String,      // 公開フィールド
        seasonal_fruit: String, // 非公開フィールド
    }

    impl Breakfast {
        // コンストラクタ（これがないと外部からインスタンスを作れない）
        pub fn summer(toast: &str) -> Breakfast {
            Breakfast {
                toast: String::from(toast),
                seasonal_fruit: String::from("peaches"),
            }
        }
    }
}

fn main() {
    // コンストラクタ経由でインスタンス作成
    let mut meal = kitchen::Breakfast::summer("ライ麦パン");
    
    // 公開フィールドは変更・参照可能
    meal.toast = String::from("食パン");
    println!("トースト: {}", meal.toast);

    // 非公開フィールドにはアクセスできない
    // meal.seasonal_fruit = String::from("blueberries"); // エラー！
}
```

```rust-exec:struct_visibility.rs
トースト: 食パン
```

## use キーワードとパス

モジュールの階層が深くなると、毎回 `restaurant::front_of_house::add_to_waitlist()` のようにフルパスを書くのは面倒です。
`use` キーワードを使うと、パスをスコープに持ち込み、短い名前で呼び出せるようになります。これは他言語の `import` に相当します。

### 絶対パスと相対パス

パスの指定方法には2種類あります。

1.  **絶対パス:** クレートのルート（`crate`）から始まるパス。
2.  **相対パス:** 現在のモジュール（`self`）や親モジュール（`super`）から始まるパス。

```rust:use_paths.rs
mod sound {
    pub mod instrument {
        pub fn clarinet() {
            println!("クラリネットの音色♪");
        }
    }
}

// 絶対パスで持ち込む
use crate::sound::instrument;

// 相対パスの場合（このファイル内であれば以下も同じ意味）
// use self::sound::instrument;

fn main() {
    // useのおかげで、直接 instrument を使える
    instrument::clarinet();
    instrument::clarinet();
}
```

```rust-exec:use_paths.rs
クラリネットの音色♪
```

> **慣習:** 関数を持ち込むときは、親モジュールまでを `use` して `親::関数()` と呼び出すのが一般的です（関数の出処が明確になるため）。一方、構造体やEnumは完全なパスを指定して直接名前だけで使えるようにすることが多いです。

## モジュールのファイル分割

これまでは説明のために1つのファイルにすべてのモジュールを書いてきましたが、実際の開発ではファイルを分割します。

Rustでは\*\*「ファイルシステム上の構造」**と**「モジュール階層」\*\*が対応します。

例えば、`main.rs` と `front_of_house.rs` がある場合：

```rust:main.rs
// ファイルの中身をモジュールとして宣言
// これにより、コンパイラは front_of_house.rs を探しに行きます
mod front_of_house; 

pub use crate::front_of_house::hosting;

fn main() {
    hosting::add_to_waitlist();
}
```

```rust:front_of_house.rs
// ここには "mod front_of_house { ... }" の枠は書かない
pub mod hosting {
    pub fn add_to_waitlist() {
        println!("リストに追加しました");
    }
}
```

```rust-exec:main.rs
リストに追加しました
```

さらに `front_of_house` の中にサブモジュールを作りたい場合は、ディレクトリを作成します。

  * `src/main.rs`
  * `src/front_of_house/` (ディレクトリ)
      * `mod.rs` (または `front_of_house.rs` と同義。ディレクトリのエントリーポイント)
      * `hosting.rs`

このように、Rustはファイルやディレクトリの存在だけで自動的にモジュールを認識するのではなく、**親となるファイルで `mod xxx;` と宣言されたものだけ**をコンパイル対象として認識します。これがC\#やJavaなどの「フォルダにあるものは全部パッケージに含まれる」言語との大きな違いです。

## 外部クレートの利用

Rustのパッケージ管理システムであるCargoを使うと、外部ライブラリ（クレート）を簡単に利用できます。

### Cargo.toml への追加

`Cargo.toml` の `[dependencies]` セクションに、使いたいクレートの名前とバージョンを記述します。例えば、乱数を生成する `rand` クレートを使う場合：

```toml
[dependencies]
rand = "0.8.5"
```

### コードでの利用

外部クレートも、プロジェクト内のモジュールと同じように `use` でスコープに持ち込んで使用します。

```rust
use std::collections::HashMap; // 標準ライブラリも 'std' という外部クレートのような扱い

// 外部クレート rand を使用する想定のコード
use rand::Rng;

fn main() {
    let mut scores = HashMap::new();
    scores.insert("Blue", 10);
    scores.insert("Yellow", 50);

    println!("スコア: {:?}", scores);
    
    let secret_number = rand::thread_rng().gen_range(1..101);
    println!("乱数: {}", secret_number);
}
```

標準ライブラリ（`std`）はデフォルトで利用可能ですが、それ以外のクレートは crates.io （Rustの公式パッケージレジストリ）から自動的にダウンロード・ビルドされます。

> 注: my.code(); のオンライン実行環境では外部クレートは使用できません。

## 第8章のまとめ

  * **パッケージとクレート:** `cargo new` で作るのがパッケージ、生成されるバイナリやライブラリがクレートです。
  * **モジュール:** コードを整理する箱です。`mod` で定義します。
  * **可視性:** すべてのアイテムはデフォルトで**非公開 (private)** です。公開するには `pub` をつけます。
  * **パスとuse:** `use` キーワードでモジュールへのパスを省略（インポート）できます。絶対パス（`crate::`）と相対パス（`self::`, `super::`）があります。
  * **ファイル分割:** `mod filename;` と宣言することで、別ファイルのコードをサブモジュールとして読み込みます。

この章の内容を理解することで、大規模なアプリケーション開発への準備が整いました。

### 練習問題1：ライブラリの設計

以下の仕様に従って、架空の図書館システムモジュールを作成してください。

1.  `library` という親モジュールを作成する。
2.  その中に `books` というサブモジュールを作成する。
3.  `books` モジュールの中に `Book` 構造体を作成する。フィールドは `title` (String, 公開) と `isbn` (String, 非公開) とする。
4.  `Book` 構造体に、新しい本を作成するコンストラクタ `new(title: &str)` を実装する（ISBNは内部で適当な文字列を設定する）。
5.  `main` 関数から `library::books::Book` を使って本を作成し、タイトルを表示するコードを書く。

<!-- end list -->

```rust:practice8_1.rs

fn main() {
    let my_book = library::books::Book::new("Rust入門");
    println!("本のタイトル: {}", my_book.title);
}
```
```rust:library/mod.rs
```
```rust:library/books.rs
```

```rust-exec:practice8_1.rs
本のタイトル: Rust入門
```

### 練習問題2：パスと可視性の修正

以下のコードは可視性の設定とパスの指定が誤っているためコンパイルできません。修正して正常に「ネットワーク接続完了」と表示されるようにしてください。

```rust:practice8_2.rs
mod network {
    fn connect() {
        println!("ネットワーク接続完了");
    }
    
    mod server {
        fn start() {
            // 親モジュールのconnectを呼びたい
            connect(); // ここが間違っている
        }
    }
}

fn main() {
    // ネットワークモジュールのconnectを呼びたい
    connect(); // ここも間違っている
}
```

```rust-exec:practice8_2.rs
```
