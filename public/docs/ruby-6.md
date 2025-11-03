# 第6章: ブロックとイテレータ - Rubyの最重要機能

Rubyの学習において、**ブロック (Block)** は最も重要で強力な機能の一つです。他言語の経験者にとって、これはラムダ式や無名関数、クロージャに似た概念ですが、Rubyではこれが言語構文の核に深く組み込まれています。

この章では、ブロックの使い方と、ブロックを活用する「イテレータ」と呼ばれるメソッドを学びます。

## ブロック構文： do...end と {}

ブロックとは、メソッド呼び出しに渡すことができる**コードの塊**です。メソッド側は、受け取ったそのコードの塊を好きなタイミングで実行できます。

ブロックには2種類の書き方があります。

1.  **`{ ... }` (波括弧)**: 通常、1行で完結する場合に使われます。
2.  **`do ... end`**: 複数行にわたる処理を書く場合に使われます。

どちらも機能的にはほぼ同じです。最も簡単な例は、指定した回数だけブロックを実行する `times` メソッドです。

```ruby-repl:1
irb(main):001:0> 3.times { puts "Hello!" }
Hello!
Hello!
Hello!
=> 3

irb(main):002:0> 3.times do
irb(main):003:1* puts "Ruby is fun!"
irb(main):004:1> end
Ruby is fun!
Ruby is fun!
Ruby is fun!
=> 3
```

`3.times` というメソッド呼び出しの後ろに `{ ... }` や `do ... end` で囲まれたコードブロックを渡しています。`times` メソッドは、そのブロックを3回実行します。

## 代表的なイテレータ

Rubyでは、コレクション（配列やハッシュなど）の各要素に対して処理を行うメソッドを**イテレータ (Iterator)** と呼びます。イテレータは通常、ブロックを受け取って動作します。

代表的なイテレータを見ていきましょう。

### each

`each` は、コレクションの各要素を順番に取り出してブロックを実行します。他言語の `foreach` ループに最も近いものです。

`|n|` の部分は**ブロック引数**と呼ばれ、イテレータが取り出した要素（この場合は配列の各要素）を受け取ります。

```ruby-repl:2
irb(main):001:0> numbers = [1, 2, 3]
=> [1, 2, 3]

irb(main):002:0> numbers.each do |n|
irb(main):003:1* puts "Current number is #{n}"
irb(main):004:1> end
Current number is 1
Current number is 2
Current number is 3
=> [1, 2, 3]
```

> **Note:** `each` メソッドの戻り値は、元の配列 (`[1, 2, 3]`) 自身です。`each` はあくまで「繰り返すこと」が目的であり、ブロックの実行結果は利用しません。

### map (collect)

`map` は、各要素に対してブロックを実行し、その**ブロックの戻り値**を集めた**新しい配列**を返します。

```ruby-repl:3
irb(main):005:0> numbers = [1, 2, 3]
=> [1, 2, 3]

irb(main):006:0> doubled = numbers.map { |n| n * 2 }
=> [2, 4, 6]

irb(main):007:0> puts doubled.inspect
[2, 4, 6]
=> nil

irb(main):008:0> puts numbers.inspect # 元の配列は変更されない
[1, 2, 3]
=> nil
```

`map` は、元の配列を変換した新しい配列が欲しい場合に非常に便利です。

### select (filter)

`select` は、各要素に対してブロックを実行し、ブロックの戻り値が**真 (true)** になった要素だけを集めた**新しい配列**を返します。

```ruby-repl:4
irb(main):009:0> numbers = [1, 2, 3, 4, 5, 6]
=> [1, 2, 3, 4, 5, 6]

irb(main):010:0> evens = numbers.select { |n| n.even? } # n.even? は n % 2 == 0 と同じ
=> [2, 4, 6]
```

### find (detect)

`find` は、ブロックの戻り値が**真 (true)** になった**最初の要素**を返します。見つからなければ `nil` を返します。

```ruby-repl:5
irb(main):011:0> numbers = [1, 2, 3, 4, 5, 6]
=> [1, 2, 3, 4, 5, 6]

irb(main):012:0> first_even = numbers.find { |n| n.even? }
=> 2

irb(main):013:0> over_10 = numbers.find { |n| n > 10 }
=> nil
```

## for ループとの比較

他言語経験者の方は、`for` ループを使いたくなるかもしれません。

```c
// C や Java の for ループ
for (int i = 0; i < 3; i++) {
    printf("Hello\n");
}
```

Rubyにも `for` 構文は存在します。

```ruby-repl:6
irb(main):014:0> numbers = [1, 2, 3]
=> [1, 2, 3]

irb(main):015:0> for num in numbers
irb(main):016:1* puts num
irb(main):017:1> end
1
2
3
=> [1, 2, 3]
```

しかし、Rubyの世界では `for` ループは**ほとんど使われません**。なぜなら、`for` は内部的に `each` メソッドを呼び出しているに過ぎないからです。

Rubyプログラマは、`for` よりも `each` などのイテレータをブロックと共に使うことを圧倒的に好みます。イテレータの方が、何をしているか（単なる繰り返し、変換、選択など）がメソッド名 (`each`, `map`, `select`) から明確であり、コードが読みやすくなるためです。

## ブロック引数とブロックの戻り値

すでに出てきたように、ブロックは `| ... |` を使って引数を受け取ることができます。

```ruby-repl:7
irb(main):018:0> ["Alice", "Bob"].each do |name|
irb(main):019:1* puts "Hello, #{name}!"
irb(main):020:1> end
Hello, Alice!
Hello, Bob!
=> ["Alice", "Bob"]
```

また、ブロックも（Rubyのすべての式と同様に）戻り値を持ちます。ブロックの戻り値とは、**ブロック内で最後に評価された式の値**です。

  * `each` はブロックの戻り値を**無視**します。
  * `map` はブロックの戻り値を**集めて新しい配列**にします。
  * `select` はブロックの戻り値が**真か偽か**を判定に使います。

```ruby-repl:8
irb(main):021:0> result = [1, 2].map do |n|
irb(main):022:1* m = n * 10       # mは 10, 20
irb(main):023:1* m + 5            # ブロックの戻り値 (15, 25)
irb(main):024:1> end
=> [15, 25]
```

## yield：ブロックを受け取るメソッド

では、どうすればブロックを受け取るメソッドを自分で作れるのでしょうか？
それには `yield` というキーワードを使います。

メソッド内で `yield` が呼び出されると、そのメソッドに渡されたブロックが実行されます。

```ruby:yield_basic.rb
def simple_call
  puts "メソッド開始"
  yield # ここでブロックが実行される
  puts "メソッド終了"
end

simple_call do
  puts "ブロック内の処理です"
end
```

```ruby-exec:yield_basic.rb
メソッド開始
ブロック内の処理です
メソッド終了
```

`yield` はブロックに引数を渡すこともできます。

```ruby:yield_with_args.rb
def call_with_name(name)
  puts "メソッド開始"
  yield(name) # ブロックに "Alice" を渡す
  yield("Bob") # ブロックに "Bob" を渡す
  puts "メソッド終了"
end

call_with_name("Alice") do |n|
  puts "ブロックが #{n} を受け取りました"
end
```

```ruby-exec:yield_with_args.rb
メソッド開始
ブロックが Alice を受け取りました
ブロックが Bob を受け取りました
メソッド終了
```

`each` や `map` のようなイテレータは、内部でこの `yield` を使って、コレクションの各要素をブロックに渡しながら実行しているのです。

## この章のまとめ

  * **ブロック**は、メソッドに渡せるコードの塊で、`{}`（1行）または `do...end`（複数行）で記述します。
  * **イテレータ**は、ブロックを受け取り、要素の繰り返し処理を行うメソッドです（`each`, `map`, `select` など）。
  * Rubyでは `for` ループよりもイテレータが好まれます。
  * ブロックは `|arg|` で引数を受け取ることができ、ブロックの最後の式の値が戻り値となります。
  * 自作メソッド内で `yield` を使うと、渡されたブロックを実行できます。

### 練習問題1

数値の配列 `[1, 2, 3, 4, 5]` があります。`map` イテレータとブロックを使って、各要素を文字列に変換し（例: `1` → `"1"`）、 `"1"`, `"2"`, `"3"`, `"4"`, `"5"` という文字列の配列を作成してください。

```ruby:practice6_1.rb
array = [1, 2, 3, 4, 5]

```

```ruby-exec:practice6_1.rb
```

### 練習問題2
文字列の配列 `["apple", "banana", "cherry", "date"]` があります。`select` イテレータとブロックを使って、文字数が5文字以上の果物だけを抽出した新しい配列（`["apple", "banana", "cherry"]`）を作成してください。

```ruby:practice6_2.rb
array = ["apple", "banana", "cherry", "date"]

```

```ruby-exec:practice6_2.rb
```
