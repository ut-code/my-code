# 第12章: ライフタイム（Lifetimes）

ようこそ、Rustの学習における「最難関」とも呼ばれる章へ。
これまで所有権や借用（第4章、第5章）を学んできましたが、**ライフタイム（Lifetimes）** はそれらを支えるコンパイラのロジックそのものです。

他の言語（C/C++）では、メモリが解放された後にその場所を指し続ける「ダングリングポインタ」がバグの温床でした。JavaやPythonのようなガベージコレクション（GC）を持つ言語では、これを自動で管理しますが、パフォーマンスのコストがかかります。

Rustは**「コンパイル時に参照の有効性を厳密にチェックする」**ことで、GCなしでメモリ安全性を保証します。そのための仕組みがライフタイムです。

## ライフタイムとは何か

ライフタイムとは、簡単に言えば**「その参照が有効である期間（スコープ）」**のことです。

実は、これまでの章でもあなたは無意識にライフタイムを使用してきました。通常、コンパイラが自動的に推論してくれるため、明示する必要がなかっただけです。しかし、コンパイラが「参照の有効期間が不明瞭だ」と判断した場合、プログラマが明示的に注釈（アノテーション）を加える必要があります。

### ダングリング参照を防ぐ

ライフタイムの主な目的は、無効なデータを指す参照を作らせないことです。

以下のコードを見てください（これはコンパイルエラーになります）。

```rust
{
    let r;                // ---------+-- rのライフタイム
                          //          |
    {                     //          |
        let x = 5;        // -+-- xのライフタイム
        r = &x;           //  |       |
    }                     // -+       |
                          //          |
    println!("r: {}", r); //          |
}                         // ---------+
```

ここで、`r` は `x` を参照しようとしています。しかし、内側のブロック `{}` が終わった時点で `x` は破棄されます。その後に `r` を使おうとすると、`r` は「解放されたメモリ」を指していることになります。

Rustのコンパイラ（**借用チェッカー**）は、このスコープのズレを検知し、「`x` の寿命が短すぎる」としてエラーを出します。

## 関数のライフタイム注釈

最も頻繁にライフタイム注釈が必要になるのは、**「引数として参照を受け取り、戻り値として参照を返す関数」**です。

2つの文字列スライスを受け取り、長い方を返す関数 `longest` を考えてみましょう。

```rust:longest_fail.rs
fn longest(x: &str, y: &str) -> &str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let string1 = String::from("abcd");
    let string2 = "xyz";

    let result = longest(string1.as_str(), string2);
    println!("The longest string is {}", result);
}
```

このコードをコンパイルしようとすると、以下のようなエラーが出ます。

```rust-exec:longest_fail.rs
error[E0106]: missing lifetime specifier
   |
1  | fn longest(x: &str, y: &str) -> &str {
   |               ----     ----     ^ expected named lifetime parameter
   |
   = help: this function's return type contains a borrowed value, but the signature does not say whether it is borrowed from `x` or `y`
```

**なぜエラーになるのか？**
コンパイラには、`longest` 関数が `x` を返すのか `y` を返すのか実行時まで分かりません。そのため、**戻り値の参照がいつまで有効であれば安全なのか（xの寿命に合わせるべきか、yの寿命に合わせるべきか）** を判断できないのです。

### ライフタイム注釈の構文

ここで**ジェネリックなライフタイム注釈**が登場します。
構文は `'a` のようにアポストロフィから始まる名前を使います。通常は `'a`（a, b, c...）が使われます。

注釈のルールは以下の通りです：

  * 関数名の後に `<'a>` でライフタイムパラメータを宣言する。
  * 引数と戻り値の参照に `&'a str` のように付与する。

修正したコードがこちらです。

```rust:longest_success.rs
// 'a というライフタイムを宣言し、
// 「引数x、引数y、そして戻り値は、すべて少なくとも 'a と同じ期間だけ生きている」
// という制約をコンパイラに伝える。
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let string1 = String::from("long string is long");
    let result;
    {
        let string2 = String::from("xyz");
        // resultのライフタイムは、string1とstring2のうち「短い方」の寿命に制約される
        result = longest(string1.as_str(), string2.as_str());
        println!("The longest string is '{}'", result);
    }
    // ここで string2 がドロップされるため、result も無効になる。
    // もしここで result を使おうとするとコンパイルエラーになる（安全！）。
    // println!("The longest string is '{}'", result);
}
```

```rust-exec:longest_success.rs
The longest string is 'long string is long'
```

**重要なポイント:**
ライフタイム注釈 `'a` は、変数の寿命を**延ばすものではありません**。
「複数の参照の寿命の関係性」をコンパイラに説明し、**「渡された参照の中で最も寿命が短いもの」** に戻り値の寿命を合わせるように制約するものです。

## ライフタイム省略ルール

「待ってください。第4章で書いた `fn first_word(s: &str) -> &str` は注釈なしで動きましたよ？」

鋭い質問です。初期のRustではすべての参照に明示的なライフタイムが必要でした。しかし、あまりにも頻出するパターン（例えば「引数が1つなら、戻り値のライフタイムもそれと同じ」など）があったため、Rustチームはそれらを自動推論する**「ライフタイム省略ルール（Lifetime Elision Rules）」**をコンパイラに組み込みました。

コンパイラは以下の3つのルールを順番に適用します。それでもライフタイムが決まらない場合のみ、エラーを出して人間に注釈を求めます。

1.  **各引数に独自のライフタイムを割り当てる**
      * `fn foo(x: &str, y: &str)` → `fn foo<'a, 'b>(x: &'a str, y: &'b str)`
2.  **入力ライフタイムが1つだけなら、そのライフタイムをすべての出力（戻り値）に割り当てる**
      * `fn foo<'a>(x: &'a str) -> &'a str`
      * これが `first_word` 関数で注釈が不要だった理由です。
3.  **メソッド（`&self` または `&mut self` を含む）の場合、`self` のライフタイムをすべての出力に割り当てる**
      * これにより、構造体のメソッドを書く際にいちいち注釈を書かずに済みます。

## 構造体定義におけるライフタイム注釈

これまでの章では、構造体には `String` や `i32` などの「所有される型」を持たせてきました。
しかし、構造体に**参照**を持たせたい場合もあります。その場合、**「構造体そのものよりも、中の参照先が長生き（あるいは同等の寿命）である」**ことを保証しなければなりません。

```rust:struct_lifetime.rs
// ImportantExcerpt構造体は、'a という期間だけ生きる文字列スライスを保持する
struct ImportantExcerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    
    // 最初の文（ピリオドまで）を取得
    let first_sentence = novel.split('.').next().expect("Could not find a '.'");
    
    // 構造体のインスタンスを作成
    // part は novel の一部を参照している。
    // novel が有効である限り、i も有効であることが保証される。
    let i = ImportantExcerpt {
        part: first_sentence,
    };

    println!("Novel start: {}", i.part);
}
```

```rust-exec:struct_lifetime.rs
Novel start: Call me Ishmael
```

もし `User` 構造体のような定義で `<'a>` を忘れると、「参照を持たせるならライフタイムを指定せよ」というエラーになります。これは、構造体が生きている間に参照先のデータが消えてしまうのを防ぐためです。

## 静的ライフタイム ('static)

特別なライフタイムとして `'static` があります。
これは、**「参照がプログラムの実行期間全体にわたって有効である」**ことを意味します。

すべての文字列リテラルは `'static` ライフタイムを持っています。なぜなら、それらはプログラムのバイナリ自体に埋め込まれており、メモリ上の位置が固定されているからです。

```rust
let s: &'static str = "I have a static lifetime.";
```

**注意点:**
エラーメッセージで「`'static` が必要です」と提案されることがありますが、安易に `'static` を使って解決しようとしないでください。多くの場合、それは「参照ではなく所有権を持つべき」か「ライフタイムの関係を正しく記述すべき」場面であり、本当にプログラム終了までデータを保持し続けたいケースは稀です。

## この章のまとめ

  * **ライフタイム**は、参照が有効なスコープの長さを表す概念です。
  * Rustの**借用チェッカー**は、ライフタイムを比較してダングリング参照（無効なメモリへのアクセス）を防ぎます。
  * 関数で複数の参照を扱い、戻り値がそれらに依存する場合、`<'a>` のような**ジェネリックライフタイム注釈**が必要です。
  * **構造体**に参照を持たせる場合も、ライフタイム注釈が必要です。
  * **省略ルール**のおかげで、一般的なケースでは注釈を省略できます。

ライフタイムの記法は最初は「ノイズ」に見えるかもしれませんが、これは「メモリ安全性をコンパイラとプログラマが対話するための言語」です。これを理解すれば、C++のような複雑なメモリ管理の落とし穴を完全に回避できます。

### 練習問題 1: 参照を持つ構造体とメソッド

以下の要件を満たすコードを作成してください。

1.  `Book` という構造体を定義してください。
2.  この構造体は `title` というフィールドを持ち、それは `String` ではなく文字列スライス `&str` です（ライフタイム注釈が必要です）。
3.  `main` 関数で `String` 型の変数（例: `"The Rust Programming Language"`）を作成し、`Book` のインスタンスにその参照を渡してください。
4.  `Book` のインスタンスを表示してください（`Debug` トレイを導出(`#[derive(Debug)]`)して構いません）。

```rust:practice12_1.rs
// ここにBookの定義を書いてください


fn main() {
    let book_title = String::from("The Rust Programming Language");
    let my_book = Book {
        title: &book_title,
    };

    println!("Book details: {:?}", my_book);
}
```

```rust-exec:practice12_1.rs
Book details: Book { title: "The Rust Programming Language" }
```

### 練習問題 2: 最初の単語を返す関数（ライフタイム付き）

以下の要件を満たすコードを作成してください。

1.  2つの文字列スライス `str1`, `str2` を受け取る関数 `first_word_of_longer` を作成してください。
2.  この関数は、2つの文字列のうち**長い方**を選び、その文字列の**最初の単語**（スペースまで）をスライスとして返します。
      * 例: "Hello World" と "Hi" なら、"Hello" を返す。
3.  引数と戻り値に適切なライフタイム注釈 `'a` を付けてください。
4.  `main` 関数で動作確認をしてください。

*(ヒント: 単語の切り出しは `s.split_whitespace().next()` などが使えますが、戻り値のライフタイムが引数と紐付いていることが重要です)*

```rust:practice12_2.rs
// ここにfirst_word_of_longer関数を書いてください


fn main() {
    let string1 = String::from("Hello World from Rust");
    let string2 = String::from("Hi");

    let first_word = first_word_of_longer(string1.as_str(), string2.as_str());
    println!("The first word of the longer string is: '{}'", first_word);
}
```

```rust-exec:practice12_2.rs
The first word of the longer string is: 'Hello'
```
