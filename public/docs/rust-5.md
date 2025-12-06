# 第5章: 借用（Borrowing）とスライス

前章では「所有権（Ownership）」というRust独自のメモリ管理システムについて学びました。「所有権は一度に1つの変数しか持てない」というルールは強力ですが、関数に値を渡すたびに所有権が移動（ムーブ）してしまうと、毎回値を返り値として受け取らなければならず不便です。

そこで登場するのが**「参照（Reference）」**と**「借用（Borrowing）」**です。これを使うことで、所有権を渡さずに値にアクセスすることが可能になります。

## 5.1 参照と借用（& と \&mut）

**参照（Reference）**とは、所有権を持たずにデータへアクセスするためのポインタのようなものです。他の言語のポインタと似ていますが、Rustの参照は「常に有効なデータを指していること」が保証されています。

関数の引数として参照を渡すことを、Rustでは**「借用（Borrowing）」**と呼びます。誰かから本を借りても、それを捨てたり（メモリ解放）、転売したり（所有権の譲渡）できないのと同じです。

### 不変参照（Immutable Reference）

デフォルトでは、参照は**不変**です。借りた値を読むことはできますが、変更することはできません。参照を作成するには `&` を使います。

```rust:calculate_length.rs
fn main() {
    let s1 = String::from("hello");

    // &s1 で s1 への参照を渡す（所有権は移動しない）
    let len = calculate_length(&s1);

    // 所有権は移動していないので、ここで s1 をまだ使える！
    println!("The length of '{}' is {}.", s1, len);
}

// 引数の型が &String になっていることに注目
fn calculate_length(s: &String) -> usize {
    s.len()
} // ここで s がスコープを抜けるが、所有権を持っていないのでメモリは解放されない
```

```rust-exec:calculate_length.rs
The length of 'hello' is 5.
```

### 可変参照（Mutable Reference）

借りた値を変更したい場合は、**可変参照**を使用します。これには `&mut` を使い、元の変数も `mut` である必要があります。

```rust:mutable_borrow.rs
fn main() {
    let mut s = String::from("hello");

    change(&mut s); // 可変参照を渡す

    println!("Result: {}", s);
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
```

```rust-exec:mutable_borrow.rs
Result: hello, world
```

## 5.2 借用のルール

Rustには、メモリ安全性とデータ競合（Data Race）を防ぐための非常に重要なルールがあります。これを**「借用のルール」**と呼びます。

> **【借用の鉄則】**
> ある特定のスコープにおいて、以下の**どちらか一方**しか満たすことはできません：
>
> 1.  **1つの**可変参照（`&mut T`）を持つ。
> 2.  **任意の数の**不変参照（`&T`）を持つ。

### なぜ可変参照は1つだけなのか？

もし「同じデータに対する可変参照」が同時に2つ存在したらどうなるでしょうか？
Aさんがデータを書き換えている最中に、Bさんも書き換えようとすると、データが破損する可能性があります。Rustはこの可能性をコンパイル時に排除します。

### 不変参照と可変参照の共存禁止

同様に、「誰かがデータを読んでいる最中（不変参照）に、誰かがデータを書き換える（可変参照）」ことも禁止されています。読んでいる最中にデータが変わると困るからです。

以下のコードはコンパイルエラーになります（概念を示すための例です）。

```rust
let mut s = String::from("hello");

let r1 = &s; // 問題なし
let r2 = &s; // 問題なし
let r3 = &mut s; // 大問題！不変参照が存在している間に可変参照は作れない

println!("{}, {}, and {}", r1, r2, r3);
```

しかし、**スコープ**を利用すれば、この制限をクリアできます。直前の参照が使用されなくなった（スコープを抜けた）後であれば、新しい参照を作ることができます。

```rust:borrow_scope.rs
fn main() {
    let mut s = String::from("hello");

    {
        let r1 = &mut s;
        r1.push_str(" world");
        // r1 はここでスコープを抜ける
    } 

    // r1 はもういないので、新しい不変参照を作れる
    let r2 = &s;
    println!("Final string: {}", r2);
}
```

```rust-exec:borrow_scope.rs
Final string: hello world
```

## 5.3 ダングリングポインタの防止

C++などの言語では、メモリが解放された後の場所を指し続けるポインタ（ダングリングポインタ）を作ってしまうことがあり、これが重大なバグの原因になります。
Rustでは、**コンパイラがこれを絶対に許可しません**。

以下のコードは、「関数内で作成した変数の参照」を返そうとしていますが、これはエラーになります。

```rust
// コンパイルエラーになる例
fn dangle() -> &String {
    let s = String::from("hello");
    &s // sの参照を返す
} // ここでsはスコープを抜け、メモリが解放される。参照先が消滅する！
```

Rustコンパイラは「データのライフタイム（生存期間）が、その参照よりも短い」と判断し、エラーを出してくれます。この場合は、参照ではなく値を返して所有権を移動させるのが正解です。

## 5.4 スライス型（Slice）

参照の特殊な形として**「スライス（Slice）」**があります。スライスは、コレクション（配列や文字列など）の**一部分**への参照です。所有権を持たない点は通常の参照と同じです。

### 文字列スライス（`&str`）

特に重要なのが文字列スライスです。`String` の一部を切り出して参照します。
書き方は `[開始インデックス..終了インデックス]` です。

```rust:string_slices.rs
fn main() {
    let s = String::from("Hello Rust World");

    let hello = &s[0..5]; // 0番目から4番目まで（5は含まない）
    let rust = &s[6..10]; // 6番目から9番目まで

    println!("Slice 1: {}", hello);
    println!("Slice 2: {}", rust);

    // 省略記法
    let len = s.len();
    let start = &s[0..5];
    let start_short = &s[..5]; // 0は省略可能

    let end = &s[6..len];
    let end_short = &s[6..];   // 末尾も省略可能

    let all = &s[..];          // 全体
    
    println!("Full: {}", all);
}
```

```rust-exec:string_slices.rs
Slice 1: Hello
Slice 2: Rust
Full: Hello Rust World
```

### 文字列リテラルはスライスである

これまで何気なく使っていた文字列リテラルですが、実はこれこそがスライスです。

```rust
let s = "Hello, world!";
```

ここで `s` の型は `&str` です。これはバイナリの静的領域に格納されている文字列データへのスライス（参照）なのです。

### 引数としての `&str`

関数で文字列を受け取る際、`&String` よりも `&str` を使う方が柔軟性が高まります。なぜなら、`&str` を引数にすれば、`String` も `&str`（リテラルなど）も両方受け取れるからです。

```rust
// この定義の方が汎用的
fn first_word(s: &str) -> &str {
    // 実装...
    &s[..] // 仮の実装
}
```

## 5.5 その他のスライス

スライスは文字列だけでなく、配列に対しても使えます。

```rust:array_slice.rs
fn main() {
    let a = [10, 20, 30, 40, 50];

    // 配列の一部を借用する
    let slice = &a[1..3]; // [20, 30]

    // assert_eq! は値が等しいか確認するマクロ
    assert_eq!(slice, &[20, 30]);
    
    println!("Slice elements: {:?}", slice);
}
```

```rust-exec:array_slice.rs
Slice elements: [20, 30]
```

## この章のまとめ

  * **参照（`&`）**: 所有権を移動させずに値にアクセスする仕組み。
  * **借用**: 関数の引数として参照を渡すこと。
  * **借用のルール**:
    1.  不変参照（`&T`）は同時にいくつでも作れる。
    2.  可変参照（`&mut T`）は同時に1つしか作れない。
    3.  不変参照と可変参照は同時に存在できない。
  * **スライス**: コレクションの一部分を参照するビュー。`&str` は文字列の一部への不変参照。

Rustのコンパイラ（ボローチェッカー）は厳格ですが、それはバグのない安全なコードを書くための強力なパートナーです。慣れてくれば、コンパイルが通った時点でロジックの正しさに自信が持てるようになります。

## 練習問題 1: 参照渡しへの書き換え

以下のコードは動作しますが、`calculate_area` 関数が所有権を奪ってしまうため、再度 `rect1` を使おうとするとエラーになります。
`calculate_area` が `Rectangle` の**不変参照**を受け取るように修正し、`main` 関数で `rect1` を再利用できるようにしてください。

```rust:practice5_1.rs
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect1 = Rectangle { width: 30, height: 50 };

    let area = calculate_area(rect1); // ここを修正
    
    // 現在のコードだと、ここで rect1 を使うとエラーになる
    // println!("rect1 is {:?}", rect1); 
    
    println!("The area is {}", area);
}

fn calculate_area(rect: Rectangle) -> u32 { // ここを修正
    rect.width * rect.height
}
```

```rust-exec:practice5_1.rs
```

### 問題 2: スライスの活用

Eメールアドレスを表す文字列を受け取り、**「@」より前のユーザー名部分だけを文字列スライス（`&str`）として返す**関数 `extract_username` を作成してください。もし「@」が含まれていない場合は、文字列全体を返してください。

ヒント: 文字列をバイト配列として扱い、ループで `@` を探します。

```rust:practice5_2.rs
fn main() {
    let email = String::from("user@example.com");
    let username = extract_username(&email);
    println!("Username: {}", username); // "user" と出力されるべき

    let simple = String::from("admin");
    let simple_name = extract_username(&simple);
    println!("Username: {}", simple_name); // "admin" と出力されるべき
}

fn extract_username(s: &str) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        // ここにコードを書く

    }

    // 「@」が含まれていない場合は、文字列全体を返す

}
```

```rust-exec:practice5_2.rs
Username: user
Username: admin
```
