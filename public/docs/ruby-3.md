# 第3章: 制御構造とメソッド定義

Rubyの制御構造は、他の多くの言語と似ていますが、Rubyの「すべてが式である」という哲学と、読みやすさを重視した構文（`unless`など）に特徴があります。また、メソッド（関数）の定義は非常に柔軟で、強力な引数の扱いや例外処理の仕組みを備えています。

## 条件分岐

Rubyの条件分岐は、`if`、`unless`、`case`が基本です。`if`や`case`は文（Statement）ではなく**式（Expression）**であるため、それ自体が値を返します。

### if, else, elsif

基本的な構文は他言語と同様ですが、`else if`は `elsif`（`e`が1つ）と綴る点に注意してください。

`if`は値を返すため、結果を変数に代入できます。

```ruby-repl:1
irb(main):001:0> score = 85
=> 85
irb(main):002:0> grade = if score > 90
irb(main):003:1* "A"
irb(main):004:1* elsif score > 80 # "else if" ではない
irb(main):005:1* "B"
irb(main):006:1* else
irb(main):007:1* "C"
irb(main):008:1* end
=> "B"
irb(main):009:0> puts "あなたの成績は#{grade}です"
あなたの成績はBです
=> nil
```

### unless

`unless`は `if !`（もし～でなければ）の糖衣構文（Syntactic Sugar）です。条件が**偽 (false)** の場合にブロックが実行されます。

```ruby-repl:2
irb(main):010:0> logged_in = false
=> false
irb(main):011:0> unless logged_in
irb(main):012:1* puts "ログインしてください"
irb(main):013:1* end
ログインしてください
=> nil
```

> **補足:** `unless` に `else` を付けることも可能ですが、多くの場合 `if` を使った方が可読性が高くなります。

### case

C言語やJavaの `switch` 文に似ていますが、より強力です。`when` 節では、複数の値、範囲（Range）、正規表現、さらにはクラスを指定することもできます。`break` は不要です。

```ruby:case_example.rb
def analyze_input(input)
  puts "Input: #{input.inspect}"
  result = case input
           when 0
             "ゼロ"
           when 1..9
             "一桁の数字"
           when "admin", "guest"
             "特定のユーザー"
           when String
             "その他の文字列"
           when /Error/
             "エラーメッセージ"
           else
             "不明な型"
           end
  puts "Result: #{result}"
end

analyze_input(5)
analyze_input("guest")
analyze_input("Some value")
analyze_input(nil)
```

```ruby-exec:case_example.rb
Input: 5
Result: 一桁の数字
Input: "guest"
Result: 特定のユーザー
Input: "Some value"
Result: その他の文字列
Input: nil
Result: 不明な型
```

## 繰り返し処理

Rubyでは、後の章で学ぶイテレータ（`each`など）が繰り返し処理の主流ですが、C言語スタイルの `while` や `until` も利用可能です。

### while

条件が**真 (true)** の間、ループを続けます。

```ruby-repl:3
irb(main):001:0> i = 0
=> 0
irb(main):002:0> while i < 3
irb(main):003:1* print i, " " # printは改行しません
irb(main):004:1* i += 1 # Rubyに i++ はありません
irb(main):005:1* end
0 1 2 => nil
```

### until

`while !` と同じです。条件が**偽 (false)** の間、ループを続けます。

```ruby-repl:4
irb(main):006:0> counter = 5
=> 5
irb(main):007:0> until counter == 0
irb(main):008:1* print counter, " "
irb(main):009:1* counter -= 1
irb(main):010:1* end
5 4 3 2 1 => nil
```

## メソッドの定義 (def)

Rubyでは、`def` キーワードを使ってメソッドを定義します。

### 基本的な定義と戻り値（returnの省略）

Rubyのメソッドは、**最後に評価された式の結果**を暗黙的に返します。`return` キーワードは、メソッドの途中で明示的に値を返したい場合（早期リターン）に使いますが、必須ではありません。

```ruby:method_return.rb
# 最後に評価された a + b が自動的に戻り値となる
def add(a, b)
  a + b
end

# 早期リターンで return を使う例
def check_value(val)
  if val < 0
    return "Negative" # ここで処理が中断
  end

  # val >= 0 の場合は、この式が評価され、戻り値となる
  "Positive or Zero"
end

puts add(10, 5)
puts check_value(-10)
puts check_value(10)
```

```ruby-exec:method_return.rb
15
Negative
Positive or Zero
```

## 引数の種類

Rubyは、デフォルト引数、キーワード引数、可変長引数など、柔軟な引数の定義をサポートしています。

### デフォルト引数

引数にデフォルト値を設定できます。

```ruby-repl:5
irb(main):001:0> def greet(name = "Guest")
irb(main):002:1* "Hello, #{name}!"
irb(main):003:1* end
=> :greet
irb(main):004:0> greet("Alice")
=> "Hello, Alice!"
irb(main):005:0> greet
=> "Hello, Guest!"
```

### キーワード引数

Pythonのように、引数名を指定して値を渡すことができます。`:`（コロン）を末尾に付けます。キーワード引数は可読性を大幅に向上させます。

```ruby:keyword_arguments.rb
# name: は必須のキーワード引数
# age: はデフォルト値を持つキーワード引数
def register_user(name:, age: nil, admin: false)
  puts "User: #{name}"
  puts "Age: #{age}" if age
  puts "Admin: #{admin}"
end

# 順序を問わない
register_user(admin: true, name: "Taro")

puts "---"

# 必須の name を省略すると ArgumentError になる
begin
  register_user(age: 30)
rescue ArgumentError => e
  puts e.message
end
```

```ruby-exec:keyword_arguments.rb
User: Taro
Admin: true
---
missing keyword: :name
```

### 可変長引数 (Splat演算子)

引数の先頭に `*`（Splat演算子）を付けると、任意の数の引数を配列として受け取ることができます。

```ruby-repl:6
irb(main):006:0> def summarize(*items)
irb(main):007:1* puts "Items count: #{items.length}"
irb(main):008:1* puts "Items: #{items.join(', ')}"
irb(main):009:1* end
=> :summarize
irb(main):010:0> summarize("Apple", "Banana", "Orange")
Items count: 3
Items: Apple, Banana, Orange
=> nil
irb(main):011:0> summarize("Book")
Items count: 1
Items: Book
=> nil
irb(main):012:0> summarize
Items count: 0
Items: 
=> nil
```

## 例外処理

JavaやPythonの `try-catch-finally` に相当する構文として、Rubyは `begin-rescue-ensure` を提供します。

### begin, rescue, ensure

  * `begin`: 例外が発生する可能性のある処理を囲みます。
  * `rescue`: 例外を捕捉（catch）します。捕捉する例外クラスを指定できます。
  * `else`: (Optional) `begin` ブロックで例外が発生しなかった場合に実行されます。
  * `ensure`: (Optional) 例外の有無にかかわらず、最後に必ず実行されます（finally）。

```ruby:exception_example.rb
def safe_divide(a, b)
  begin
    # メインの処理
    result = a / b
  rescue ZeroDivisionError => e
    # ゼロ除算エラーを捕捉
    puts "Error: ゼロで割ることはできません。"
    puts "(#{e.class}: #{e.message})"
    result = nil
  rescue TypeError => e
    # 型エラーを捕捉
    puts "Error: 数値以外が使われました。"
    puts "(#{e.class}: #{e.message})"
    result = nil
  else
    # 例外が発生しなかった場合
    puts "計算成功: #{result}"
  ensure
    # 常に実行
    puts "--- 処理終了 ---"
  end
  
  return result
end

safe_divide(10, 2)
safe_divide(10, 0)
safe_divide(10, "a")
```

```ruby-exec:exception_example.rb
計算成功: 5
--- 処理終了 ---
Error: ゼロで割ることはできません。
(ZeroDivisionError: divided by 0)
--- 処理終了 ---
Error: 数値以外が使われました。
(TypeError: String can't be coerced into Integer)
--- 処理終了 ---
```

> **補足:** `def` ... `end` のメソッド定義内では、`begin` と `end` は省略可能です。

### raise (例外の発生)

`raise` を使って、意図的に例外を発生（throw）させることができます。

```ruby-repl:7
irb(main):001:0> def check_age(age)
irb(main):002:1* if age < 0
irb(main):003:2* # raise "エラーメッセージ"
irb(main):004:2* # raise 例外クラス, "エラーメッセージ"
irb(main):005:2* raise ArgumentError, "年齢は負の値にできません"
irb(main):006:2* end
irb(main):007:1* puts "年齢は #{age} 歳です"
irb(main):008:1* end
=> :check_age
irb(main):009:0> check_age(20)
年齢は 20 歳です
=> nil
irb(main):010:0> check_age(-5)
(irb):5:in `check_age': 年齢は負の値にできません (ArgumentError)
    from (irb):10:in `<main>'
    ...
```

## この章のまとめ

  * Rubyの制御構造（`if`, `case`）は**式**であり、値を返します。
  * `if !` の代わりに `unless` を、`while !` の代わりに `until` を使うことで、否定条件を読みやすく記述できます。
  * メソッドの戻り値は、`return` を使わずとも**最後に評価された式**が自動的に返されます。
  * メソッドの引数は、**デフォルト引数**、**キーワード引数** (`name:`), **可変長引数** (`*args`) を駆使することで、非常に柔軟に定義できます。
  * 例外処理は `begin`, `rescue` (catch), `ensure` (finally) で行い、`raise` で意図的に例外を発生させます。

### 練習問題1: 評価メソッドの作成

生徒の点数（0〜100）を受け取り、以下の基準で評価（文字列）を返すメソッド `evaluate_score(score)` を作成してください。

  * 90点以上: "A"
  * 70点〜89点: "B"
  * 50点〜69点: "C"
  * 50点未満: "D"
  * 0未満または100を超える場合: `ArgumentError` を `raise` してください。

`case` 文と `raise` を使用して実装してください。

```ruby:practice3_1.rb
```

```ruby-exec:practice3_1.rb
```

### 練習問題2: 柔軟なログ出力メソッド

ログメッセージ（必須）と、オプションとしてログレベル（キーワード引数 `level:`）およびタグ（可変長引数 `tags`）を受け取るメソッド `logger` を作成してください。

  * メソッドシグネチャ: `def logger(message, level: "INFO", *tags)`
  * 実行例:
      * `logger("Server started")`
          * 出力: `[INFO] Server started`
      * `logger("User login failed", level: "WARN", "security", "auth")`
          * 出力: `[WARN] (security, auth) User login failed`
      * `logger("DB connection lost", level: "ERROR", "database")`
          * 出力: `[ERROR] (database) DB connection lost`

（ヒント: タグの配列 `tags` が空でないかを確認し、`join` メソッドを使って整形してください。）

```ruby:practice3_2.rb
```

```ruby-exec:practice3_2.rb
```
