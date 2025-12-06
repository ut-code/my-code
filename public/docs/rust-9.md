# 第9章: 一般的なコレクションと文字列

これまでの章では、配列やタプルといった固定長のデータ構造を扱ってきました。これらはスタックに格納されるため高速ですが、コンパイル時にサイズが決まっている必要があります。

本章では、Rustの標準ライブラリが提供する、**ヒープ領域**にデータを格納する動的なコレクションについて学びます。これらは実行時にサイズを変更可能です。特に、他の言語経験者が躓きやすい「Rustにおける文字列（UTF-8）の扱い」には重点を置いて解説します。

主に以下の3つを扱います。

1.  **ベクタ (`Vec<T>`)**: 可変長のリスト。
2.  **文字列 (`String`)**: UTF-8エンコードされたテキスト。
3.  **ハッシュマップ (`HashMap<K, V>`)**: キーと値のペア。

## ベクタ (`Vec<T>`)：可変長配列

ベクタは、同じ型の値をメモリ上に連続して配置するデータ構造です。C++の `std::vector` や Javaの `ArrayList`、Pythonのリストに近いものです。

### ベクタの作成と更新

`Vec::new()` 関数または `vec!` マクロを使用して作成します。要素を追加するには `push` メソッドを使いますが、ベクタを変更するためには `mut` で可変にする必要があります。

```rust:vector_basics.rs
fn main() {
    // 空のベクタを作成（型注釈が必要な場合がある）
    let mut v: Vec<i32> = Vec::new();
    v.push(5);
    v.push(6);
    v.push(7);

    // vec!マクロを使うと型推論が効くため記述が楽
    let mut v2 = vec![1, 2, 3];
    v2.push(4);

    println!("v: {:?}", v);
    println!("v2: {:?}", v2);
    
    // popで末尾の要素を削除して取得（Optionを返す）
    let last = v2.pop();
    println!("Popped: {:?}", last);
    println!("v2 after pop: {:?}", v2);
}
```

```rust-exec:vector_basics.rs
v: [5, 6, 7]
v2: [1, 2, 3, 4]
Popped: Some(4)
v2 after pop: [1, 2, 3]
```

### 要素へのアクセス

要素へのアクセスには「インデックス記法 `[]`」と「`get` メソッド」の2通りの方法があります。安全性において大きな違いがあります。

  * `&v[i]`: 存在しないインデックスにアクセスすると**パニック**を起こします。
  * `v.get(i)`: `Option<&T>` を返します。範囲外の場合は `None` になるため、安全に処理できます。

<!-- end list -->

```rust:vector_access.rs
fn main() {
    let v = vec![10, 20, 30, 40, 50];

    // 方法1: インデックス（確実に存在するとわかっている場合に使用）
    let third: &i32 = &v[2];
    println!("3番目の要素は {}", third);

    // 方法2: getメソッド（範囲外の可能性がある場合に使用）
    match v.get(100) {
        Some(third) => println!("101番目の要素は {}", third),
        None => println!("101番目の要素はありません"),
    }

    // イテレーション
    // &v とすることで所有権を移動させずに参照でループする
    print!("要素: ");
    for i in &v {
        print!("{} ", i);
    }
    println!();
    
    // 値を変更しながらイテレーション
    let mut v_mut = vec![1, 2, 3];
    for i in &mut v_mut {
        *i += 50; // 参照外し演算子(*)を使って値を書き換える
    }
    println!("変更後: {:?}", v_mut);
}
```

```rust-exec:vector_access.rs
3番目の要素は 30
101番目の要素はありません
要素: 10 20 30 40 50 
変更後: [51, 52, 53]
```

## 文字列 (`String`) と UTF-8

Rustにおける文字列は、他の言語経験者にとって最も混乱しやすい部分の一つです。
Rustの文字列は、**UTF-8エンコードされたバイトのコレクション**として実装されています。

### `String` と `&str` の違い（復習）

  * **`String`**: 所有権を持つ、伸長可能な、ヒープ上の文字列（`Vec<u8>` のラッパー）。
  * **`&str` (文字列スライス)**: どこか（バイナリ領域やヒープ領域）にある文字列データへの参照。

### 文字列の操作

`String` は `Vec` と同様に `push_str` や `+` 演算子で結合できます。

```rust:string_ops.rs
fn main() {
    let mut s = String::from("foo");
    s.push_str("bar"); // 文字列スライスを追加
    s.push('!');       // 1文字追加
    println!("{}", s);

    let s1 = String::from("Hello, ");
    let s2 = String::from("World!");
    
    // + 演算子を使用。
    // s1はムーブされ、以降使用できなくなることに注意
    // シグネチャは fn add(self, s: &str) -> String に近いため
    let s3 = s1 + &s2; 
    
    println!("{}", s3);
    // println!("{}", s1); // コンパイルエラー：s1はムーブ済み
    
    // format!マクロを使うと所有権を奪わず、読みやすく結合できる
    let s4 = String::from("tic");
    let s5 = String::from("tac");
    let s6 = String::from("toe");
    
    let s_all = format!("{}-{}-{}", s4, s5, s6);
    println!("{}", s_all);
}
```

```rust-exec:string_ops.rs
foobar!
Hello, World!
tic-tac-toe
```

### なぜインデックスアクセスができないのか？

多くの言語では `s[0]` で1文字目を取得できますが、Rustでは**コンパイルエラー**になります。

Rustの文字列はUTF-8です。ASCII文字は1バイトですが、日本語のような文字は3バイト（またはそれ以上）を使用します。

  * `"A"` -\> `[0x41]` (1バイト)
  * `"あ"` -\> `[0xE3, 0x81, 0x82]` (3バイト)

もし `"あ"` という文字列に対して `s[0]` で1バイト目を取得できたとしても、それは `0xE3` という意味のないバイト値であり、プログラマが期待する「あ」ではありません。Rustはこの誤解を防ぐために、インデックスアクセスを禁止しています。

文字列の中身を見るには、「バイトとして見る」か「文字（スカラ値）として見る」かを明示する必要があります。

```rust:string_utf8.rs
fn main() {
    let s = "こんにちは"; // UTF-8で各文字3バイト

    // NG: s[0] はコンパイルエラー

    // 文字（char）として反復処理
    // RustのcharはUnicodeスカラ値（4バイト）
    print!("Chars: ");
    for c in s.chars() {
        print!("{} ", c);
    }
    println!();

    // バイトとして反復処理
    print!("Bytes: ");
    for b in s.bytes() {
        print!("{:x} ", b); // 16進数で表示
    }
    println!();
    
    // 部分文字列（スライス）の取得には範囲指定が必要
    // ただし、文字の境界に合わないバイトを指定すると実行時にパニックする
    let s_slice = &s[0..3]; // 最初の3バイト＝「こ」
    println!("Slice: {}", s_slice);
}
```

```rust-exec:string_utf8.rs
Chars: こ ん に ち は 
Bytes: e3 81 93 e3 82 93 e3 81 ab e3 81 a1 e3 81 8a 
Slice: こ
```

## ハッシュマップ (`HashMap<K, V>`)

ハッシュマップは、キーと値をマッピングしてデータを格納します。Pythonの `dict`、JavaScriptの `Map` やオブジェクト、Rubyの `Hash` に相当します。標準ライブラリの `std::collections` モジュールからインポートする必要があります。

### 基本的な操作

```rust:hashmap_demo.rs
use std::collections::HashMap;

fn main() {
    let mut scores = HashMap::new();

    // 挿入
    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);

    // 値の取得（getはOption<&V>を返す）
    let team_name = String::from("Blue");
    if let Some(score) = scores.get(&team_name) {
        println!("{}: {}", team_name, score);
    }

    // 反復処理（順序は保証されない）
    for (key, value) in &scores {
        println!("{}: {}", key, value);
    }
}
```

```rust-exec:hashmap_demo.rs
Blue: 10
Yellow: 50
Blue: 10
```

### 所有権の移動

`HashMap` にキーや値を挿入すると、`String` のような所有権を持つ型はマップ内に**ムーブ**されます（`i32` のような `Copy` トレイトを持つ型はコピーされます）。挿入後に元の変数を使おうとするとエラーになります。

### エントリ API による更新

「キーが存在しなければ値を挿入し、存在すれば何もしない（あるいは値を更新する）」というパターンは非常に一般的です。Rustでは `entry` APIを使うとこれを簡潔に書けます。

```rust:hashmap_update.rs
use std::collections::HashMap;

fn main() {
    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10);

    // 上書き（同じキーでinsertすると値は上書きされる）
    scores.insert(String::from("Blue"), 25);
    println!("Blue updated: {:?}", scores);

    // キーがない場合のみ挿入 (or_insert)
    scores.entry(String::from("Yellow")).or_insert(50);
    scores.entry(String::from("Blue")).or_insert(50); // 既に25があるので無視される
    println!("Entry check: {:?}", scores);

    // 既存の値に基づいて更新（単語の出現回数カウントなど）
    let text = "hello world wonderful world";
    let mut map = HashMap::new();

    for word in text.split_whitespace() {
        // or_insertは挿入された値への可変参照(&mut V)を返す
        let count = map.entry(word).or_insert(0);
        *count += 1; // 参照外ししてインクリメント
    }

    println!("Word count: {:?}", map);
}
```

```rust-exec:hashmap_update.rs
Blue updated: {"Blue": 25}
Entry check: {"Blue": 25, "Yellow": 50}
Word count: {"world": 2, "hello": 1, "wonderful": 1}
```

## この章のまとめ

  * **`Vec<T>`**: 同じ型の要素を可変長で保持します。範囲外アクセスには注意し、必要なら `get` メソッドを使用します。
  * **`String`**: UTF-8エンコードされたバイト列のラッパーです。インデックス `[i]` によるアクセスは禁止されており、文字として扱うには `.chars()` を、バイトとして扱うには `.bytes()` を使用します。
  * **`HashMap<K, V>`**: キーバリューストアです。`entry` APIを使用すると、「存在確認してから挿入・更新」という処理を効率的かつ安全に記述できます。

### 練習問題1：整数のリスト分析

整数のベクタ `vec![1, 10, 5, 2, 10, 5, 20, 5]` が与えられたとき、以下の3つを計算して表示するプログラムを作成してください。

1.  **平均値 (Mean)**
2.  **中央値 (Median)**: リストをソートしたときに真ん中に来る値。
3.  **最頻値 (Mode)**: 最も頻繁に出現する値（ヒント：ハッシュマップを使って出現回数を数えます）。

```rust:practice9_1.rs
fn main() {
    let numbers = vec![1, 10, 5, 2, 10, 5, 20, 5];


}
```
```rust-exec:practice9_1.rs
平均値: 7.25
中央値: 5
最頻値: 5
```

### 問題2：ピッグ・ラテン (Pig Latin) 変換

文字列を「ピッグ・ラテン」と呼ばれる言葉遊びに変換する関数を作成してください。ルールは以下の通りです。

1.  単語が**母音** (a, i, u, e, o) で始まる場合、単語のお尻に `-hay` を追加します。
      * 例: `apple` -\> `apple-hay`
2.  単語が**子音**で始まる場合、最初の文字を単語のお尻に移動し、`-ay` を追加します。
      * 例: `first` -\> `irst-fay`

アルファベットのみ、小文字のみの想定で構いません。

```rust:practice9_2.rs
fn pig_latin(word: &str) -> String {
    // ここに変換ロジックを実装
    

}
fn main() {
    println!("{}", pig_latin("apple"));
    println!("{}", pig_latin("first"));
}
```
```rust-exec:practice9_2.rs
apple-hay
irst-fay
```
