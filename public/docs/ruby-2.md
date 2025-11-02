# 第2章: 基本構文とデータ型 - Rubyの「書き方」

Rubyへようこそ！他の言語の経験がある皆さんなら、Rubyの柔軟で読みやすい構文にすぐに慣れるでしょう。この章では、Rubyの基本的な構成要素を見ていきます。

## 💎 変数、定数、スコープ

Rubyの変数は型宣言を必要としませんが、変数の「スコープ（可視範囲）」は名前の付け方によって決まります。これは他の言語と大きく異なる点です。

  * **ローカル変数**: `my_var`
      * 小文字または `_` で始まります。定義されたスコープ（メソッド定義、ブロック、ファイルのトップレベルなど）でのみ有効です。
  * **インスタンス変数**: `@my_var`
      * `@` で始まります。特定のオブジェクトのインスタンスに属し、そのオブジェクトのメソッド内からアクセスできます。（クラスの章で詳述します）
  * **クラス変数**: `@@my_var`
      * `@@` で始まります。クラス全体とそのサブクラスで共有されます。（クラスの章で詳述します）
  * **グローバル変数**: `$my_var`
      * `$` で始まります。プログラムのどこからでもアクセス可能ですが、グローバルな状態を持つため、使用は最小限に抑えるべきです。
  * **定数**: `MY_CONSTANT`
      * 大文字で始まります。一度定義すると変更すべきではない値を示します（技術的には変更可能ですが、Rubyが警告を出します）。

```ruby-repl:1
irb(main):001> local_var = "I am local"
=> "I am local"
irb(main):002> @instance_var = "I belong to an object"
=> "I belong to an object"
irb(main):003> $global_var = "Available everywhere"
=> "Available everywhere"
irb(main):004> MY_CONSTANT = 3.14
=> 3.14
irb(main):005> MY_CONSTANT = 3.14159 # 警告が出ます
(irb):5: warning: already initialized constant MY_CONSTANT
(irb):4: warning: previous definition of MY_CONSTANT was here
=> 3.14159
```

## 🔢 Rubyの基本データ型

Rubyには多くの組み込みデータ型がありますが、まずは基本的なものを押さえましょう。

  * **Integer (整数)**: `1`, `100`, `-5`, `1_000_000` ( `_` は読みやすさのためのもので、無視されます)
  * **Float (浮動小数点数)**: `1.5`, `3.14`, `-0.001`
  * **String (文字列)**: `"Hello"`, `'World'`
  * **Boolean (真偽値)**: `true`, `false`
  * **NilClass (nil)**: `nil` (何も存在しないことを示す唯一の値)
  * **Array (配列)**: `[1, "apple", true]`
  * **Hash (ハッシュ)**: `{"key1" => "value1", :key2 => "value2"}`
  * **Symbol (シンボル)**: `:my_symbol` (後述します)

Rubyでは、これらすべてが「オブジェクト」であり、メソッドを持っています。

```ruby-repl:2
irb(main):001> 100.class
=> Integer
irb(main):002> "Hello".class
=> String
irb(main):003> 3.14.class
=> Float
irb(main):004> true.class
=> TrueClass
irb(main):005> nil.class
=> NilClass
irb(main):006> [1, 2].class
=> Array
irb(main):007> {a: 1}.class
=> Hash
irb(main):008> :symbol.class
=> Symbol
```

## 🚫 重要： nil と false の扱い

Rubyの条件分岐（`if`文など）において、**偽 (falsey) として扱われるのは `nil` と `false` の2つだけ**です。

これは非常に重要です。C言語やJavaScriptなどの `0`、空文字列 `""`、空配列 `[]` が偽として扱われる言語とは異なります。Rubyでは、これらはすべて**真 (truthy)** として扱われます。

```ruby:truthy_check.rb
def check_truthy(label, value)
  if value
    puts "[#{label}] は真 (truthy) です。"
  else
    puts "[#{label}] は偽 (falsey) です。"
  end
end

check_truthy("false", false)
check_truthy("nil", nil)
puts "---"
check_truthy("true", true)
check_truthy("0 (Integer)", 0)
check_truthy("1 (Integer)", 1)
check_truthy("空文字列 \"\"", "")
check_truthy("文字列 \"abc\"", "abc")
check_truthy("空配列 []", [])
check_truthy("空ハッシュ {}", {})
```

```ruby-exec:truthy_check.rb
[false] は偽 (falsey) です。
[nil] は偽 (falsey) です。
---
[true] は真 (truthy) です。
[0 (Integer)] は真 (truthy) です。
[1 (Integer)] は真 (truthy) です。
[空文字列 ""] は真 (truthy) です。
[文字列 "abc"] は真 (truthy) です。
[空配列 []] は真 (truthy) です。
[空ハッシュ {}] は真 (truthy) です。
```

## 💬 重要： シンボル (Symbol) とは何か？

シンボルは、他の言語の経験者にとってRubyの最初の「つまずきポイント」かもしれません。

シンボルはコロン ( `:` ) で始まります（例: `:name`, `:status`）。

**文字列 (String) とシンボル (Symbol) の違い:**

1.  **イミュータブル (Immutable)**:
      * シンボルは一度作成されると変更できません。`"hello"[0] = "H"` は可能ですが、 `:hello` に対してこのような操作はできません。
2.  **一意性 (Identity)**:
      * 同じ内容の文字列は、作成されるたびに異なるオブジェクトID（メモリ上の場所）を持つことがあります。
      * 同じ内容のシンボルは、プログラム全体で**常に同一のオブジェクト**を指します。
3.  **パフォーマンス**:
      * シンボルは内部的に整数として扱われるため、文字列の比較よりも高速です。

**主な用途**:

  * **ハッシュのキー**: パフォーマンスとメモリ効率のため、シンボルはハッシュのキーとして非常によく使われます。
      * `user = { name: "Alice", age: 30 }` (これは `{ :name => "Alice", :age => 30 }` のシンタックスシュガーです)
  * **メソッド名や状態の識別子**: `status = :pending`, `status = :completed` のように、固定された「名前」や「状態」を表すのに使われます。

```ruby-repl:3
irb(main):001> "hello".object_id  # 実行ごとに変わる
=> 60
irb(main):002> "hello".object_id  # 異なるID
=> 80
irb(main):003> :hello.object_id  # 常に同じ
=> 1084828
irb(main):004> :hello.object_id  # 同一のID
=> 1084828
irb(main):005> "status".to_sym  # 文字列とシンボルの変換
=> :status
irb(main):006> :status.to_s
=> "status"
```

シンボルは「名前」そのもの、文字列は「データ」そのもの、と考えると分かりやすいかもしれません。

## 🚀 メソッド呼び出し（括弧の省略記法）

Rubyでは、メソッドを呼び出す際の括弧 `()` を省略できます（ただし、曖昧さが生じない場合に限ります）。

```ruby-repl:4
irb(main):001> puts("Hello, World!") # 括弧あり (推奨されることが多い)
Hello, World!
=> nil
irb(main):002> puts "Hello, World!" # 括弧なし (DSLや単純な呼び出しでよく使われる)
Hello, World!
=> nil
irb(main):003> 5.+(3) # '+' も実はメソッド呼び出し
=> 8
irb(main):004> 5 + 3  # これは 5.+(3) のシンタックスシュガー
=> 8
```

括弧を省略するとコードが読みやすくなる場合がありますが、メソッドチェーンが続く場合や、引数が複雑な場合は括弧を付けた方が明確です。

## 📜 文字列操作と式展開

Rubyの文字列は強力で、特に「式展開」は頻繁に使われます。

  * **シングルクォート (`'...'`)**: ほぼそのまま文字列として扱います。`\n`（改行）などのエスケープシーケンスや式展開は解釈**されません**（`\'` と `\\` を除く）。
  * **ダブルクォート (`"..."`)**: エスケープシーケンス（`\n`, `\t` など）を解釈し、**式展開 (Interpolation)** を行います。

式展開は `#{...}` という構文を使い、`...` の部分でRubyのコードを実行し、その結果を文字列に埋め込みます。

```ruby-repl:5
irb(main):001> name = "Alice"
=> "Alice"
irb(main):002> puts 'Hello, #{name}\nWelcome!'  # シングルクォート
Hello, #{name}\nWelcome!
=> nil
irb(main):003> puts "Hello, #{name}\nWelcome!"  # ダブルクォート
Hello, Alice
Welcome!
=> nil
irb(main):004> puts "1 + 2 = #{1 + 2}"  # 式展開内では計算も可能
1 + 2 = 3
=> nil
irb(main):005> "Ruby" + " " + "Rocks"  # 文字列の連結と繰り返し
=> "Ruby Rocks"
irb(main):006> "Go! " * 3
=> "Go! Go! Go! "
```

## 📝 この章のまとめ

  * Rubyの変数は、先頭の記号 (`@`, `@@`, `$`) によってスコープが決まる。
  * `false` と `nil` のみが偽 (falsey) であり、`0` や `""` も真 (truthy) として扱われる。
  * シンボル (`:name`) はイミュータブルで一意な「名前」を表し、主にハッシュのキーや識別子として使われる。
  * メソッド呼び出しの括弧は、曖昧さがない限り省略できる。
  * ダブルクォート文字列 (`"..."`) は式展開 `#{...}` をサポートする。

### 練習問題1: 式展開とデータ型

ユーザーの名前（`name`）と年齢（`age`）を変数に代入してください。
次に、`"#{...}"`（式展開）を使い、「（名前）さんの年齢は（年齢）歳です。5年後は（5年後の年齢）歳になります。」という文字列を出力するスクリプトを作成してください。

```ruby:practice2_1.rb
```

```ruby-exec:practice2_1.rb
```
