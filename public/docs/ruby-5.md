# 第5章: コレクション (Array, Hash, Range)

Rubyの強力な機能の一つに、柔軟で直感的なコレクション（データを集めて格納するオブジェクト）があります。他の言語でのListやMap、Dictionaryに相当するものを学びましょう。この章では、`Array`（配列）、`Hash`（ハッシュ）、そして `Range`（範囲）を扱います。

## 配列 (Array)

Rubyの `Array` は、他の言語における動的配列やリストに似ています。順序付けられた要素のコレクションであり、異なるデータ型の要素を混在させることができます。

### 生成と操作

配列は `[]` (角括弧) を使って生成します。

```ruby-repl:1
irb(main):001:0> numbers = [1, 2, 3, 4, 5]
=> [1, 2, 3, 4, 5]
irb(main):002:0> mixed = [1, "hello", true, 3.14] # 型の混在が可能
=> [1, "hello", true, 3.14]
irb(main):003:0> empty_array = []
=> []
```

要素へのアクセスは `[index]` を使います。Rubyのインデックスは0から始まり、**負のインデックス**（末尾からのアクセス）をサポートしているのが特徴です。

```ruby-repl:2
irb(main):004:0> numbers[0]  # 最初の要素
=> 1
irb(main):005:0> numbers[-1] # 末尾の要素
=> 5
irb(main):006:0> numbers[-2] # 末尾から2番目の要素
=> 4
```

### 要素の追加と削除

要素の追加には `<<` (shovel演算子) や `push` メソッドを使います。 `pop` は末尾の要素を削除し、それを返します。

```ruby-repl:3
irb(main):007:0> fruits = ["apple", "banana"]
=> ["apple", "banana"]
irb(main):008:0> fruits << "cherry"  # << (shovel) は高速で一般的
=> ["apple", "banana", "cherry"]
irb(main):009:0> fruits.push("orange")
=> ["apple", "banana", "cherry", "orange"]
irb(main):010:0> last_fruit = fruits.pop
=> "orange"
irb(main):011:0> fruits
=> ["apple", "banana", "cherry"]
```

### 便利なメソッド

`Array` には非常に多くの便利なメソッドが用意されています。

```ruby-repl:4
irb(main):012:0> fruits.length # 要素数
=> 3
irb(main):013:0> fruits.include?("banana") # 要素が含まれているか
=> true
irb(main):014:0> fruits.sort # ソートされた新しい配列を返す
=> ["apple", "banana", "cherry"]
irb(main):015:0> fruits.first # 最初の要素
=> "apple"
irb(main):016:0> fruits.last # 最後の要素
=> "cherry"
```

## ハッシュ (Hash)

`Hash` は、キーと値のペアを格納するコレクションです。他の言語のMap、Dictionary、連想配列に相当します。

### 2種類のシンタックス

Rubyのハッシュには2つの主要な記法があります。

#### 1\. 旧シンタックス (Rocket Syntax)

`=>`（ハッシュロケット）を使う記法です。キーには**任意のオブジェクト**（文字列、数値、シンボルなど）を使用できます。

```ruby-repl:5
irb(main):001:0> # キーが文字列の場合
irb(main):002:0> user_profile = { "name" => "Alice", "age" => 30 }
=> {"name"=>"Alice", "age"=>30}
irb(main):003:0> user_profile["name"]
=> "Alice"
```

#### 2\. 新シンタックス (JSON-like Syntax)

Ruby 1.9から導入された、より簡潔な記法です。JavaScriptのオブジェクトリテラルに似ています。

> **注意:** この記法を使うと、**キーは自動的にシンボル (Symbol) になります**。

```ruby-repl:6
irb(main):004:0> # 新シンタックス (キーはシンボルになる)
irb(main):005:0> user_profile_new = { name: "Bob", age: 25 }
=> {:name=>"Bob", :age=>25}
irb(main):006:0> # アクセス時もシンボル (:name) を使う
irb(main):007:0> user_profile_new[:name]
=> "Bob"
```

現在では、キーが固定されている場合は、シンボルを使った新シンタックスが好まれます。

## 範囲 (Range)

`Range` は、連続する値のシーケンスを表すオブジェクトです。`for` ループや `case` 文での条件分岐によく使われます。

範囲の作成には `(start..end)` と `(start...end)` の2つの形式があります。

### `..` (終端を含む)

`..`（ドット2つ）は、終端の値を含む範囲を作成します。

```ruby-repl:9
irb(main):001:0> inclusive_range = (1..10) # 1から10まで (10を含む)
=> 1..10
irb(main):002:0> inclusive_range.to_a # to_aで配列に変換できる
=> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
irb(main):003:0> inclusive_range.include?(10)
=> true
```

### `...` (終端を含まない)

`...`（ドット3つ）は、終端の値を含まない（未満の）範囲を作成します。

```ruby-repl:10
irb(main):004:0> exclusive_range = (1...10) # 1から10まで (10を含まない)
=> 1...10
irb(main):005:0> exclusive_range.to_a
=> [1, 2, 3, 4, 5, 6, 7, 8, 9]
irb(main):006:0> exclusive_range.include?(10)
=> false
```

### 範囲の活用例

`Range` は `case` 文と組み合わせると非常に強力です。

```ruby:grade_checker.rb
def assign_grade(score)
  case score
  when (90..100)
    "A"
  when (80...90) # 80は含むが90は含まない (80-89)
    "B"
  when (60...80)
    "C"
  else
    "F"
  end
end

puts "Score 95: #{assign_grade(95)}"
puts "Score 90: #{assign_grade(90)}"
puts "Score 89: #{assign_grade(89)}"
puts "Score 60: #{assign_grade(60)}"
puts "Score 59: #{assign_grade(59)}"
```

```ruby-exec:grade_checker.rb
Score 95: A
Score 90: A
Score 89: B
Score 60: C
Score 59: F
```

## この章のまとめ

  * **Array**: `[]` で作成する順序付きリスト。`<<` で追加、`pop` で取り出し、`[-1]` で末尾にアクセスできます。
  * **Hash**: `{}` で作成するキー/バリューペア。
  * **Symbol**: `:name` のようにコロンで始まる識別子。イミュータブルで高速なため、ハッシュのキーに最適です。
  * **Hashのシンタックス**: キーがシンボルの場合、`{ key: "value" }` というモダンな記法が使えます。
  * **Range**: `(1..10)`（含む）と `(1...10)`（含まない）があり、連続したシーケンスを表現します。

### 練習問題1: ショッピングカートの管理

あなたのショッピングカートを表現する配列 `cart` があります。
`cart` は、商品情報を表すハッシュの配列です。
以下の操作を行ってください。

1.  `cart` に `{ name: "Orange", price: 120 }` を追加する。
2.  `cart` の最初の商品の名前 (`"Apple"`) を表示する。

```ruby:practice5_1.rb
cart = [{ name: "Apple", price: 100 }, { name: "Banana", price: 80 }]
```

```ruby-exec:practice5_1.rb
```

### 練習問題2: ハッシュの操作

ユーザーの設定を保存するハッシュ `settings` を作成してください。

* キーにはシンボルを使用します (`:theme`, `:notifications`)。
* `:theme` の初期値は `:light`、`:notifications` の初期値は `true` とします。
* `settings` を作成した後、`:theme` の値を `:dark` に更新してください。

```ruby:practice5_2.rb
settings =
```

```ruby-exec:practice5_2.rb
```
