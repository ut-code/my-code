# 第4章: すべてがオブジェクト

Rubyの設計思想における最も重要かつ強力なコンセプトの一つは、「すべてがオブジェクトである」という点です。他の言語、例えばJavaやC++では、数値（int, double）や真偽値（boolean）は「プリミティブ型」として扱われ、オブジェクトとは区別されます。

しかしRubyでは、`5` のような数値も、`"hello"` のような文字列も、そして `nil` さえも、すべてがメソッド（振る舞い）を持つオブジェクトです。

## 🎯 Rubyの核心: 5.times の衝撃

他の言語の経験者がRubyに触れて最初に驚くことの一つが、以下のようなコードが動作することです。

```ruby-repl:1
irb(main):001:0> 5.times do
irb(main):002:1* print "Ruby! "
irb(main):003:1> end
Ruby! Ruby! Ruby! Ruby! Ruby! => 5
```

`5` という数値リテラルが `.times` というメソッドを呼び出しています。これは、`5` が単なる値ではなく、`Integer` クラスのインスタンス（オブジェクト）だからです。

同様に、文字列もオブジェクトです。

```ruby-repl:2
irb(main):001:0> "hello, world".upcase
=> "HELLO, WORLD"
irb(main):002:0> "hello, world".length
=> 12
```

`"hello, world"` という `String` オブジェクトが、`upcase` や `length` というメソッド（メッセージ）に応答しています。

`.class` メソッドを使うと、そのオブジェクトがどのクラスに属しているかを確認できます。

```ruby-repl:3
irb(main):001:0> 5.class
=> Integer
irb(main):002:0> "hello".class
=> String
irb(main):003:0> 3.14.class
=> Float
```

## 👻 nil オブジェクト: 無ですらオブジェクト

Rubyには「何もない」「無効」な状態を示す `nil` という特別な値があります。これは他の言語における `null` や `None` に相当します。

しかし、Rubyの哲学を徹底している点は、この `nil` ですらオブジェクトであるということです。

```ruby-repl:4
irb(main):001:0> nil.class
=> NilClass
```

`nil` は `NilClass` という専用クラスの唯一のインスタンスです。オブジェクトであるため、`nil` もメソッドを持ちます。

```ruby-repl:5
irb(main):001:0> nil.nil?
=> true
irb(main):002:0> "hello".nil?
=> false
irb(main):003:0> nil.to_s
=> ""
irb(main):004:0> nil.to_i
=> 0
```

`nil` がメソッドを持つことで、`null` チェックに起因するエラー（例えば `null.someMethod()` のような呼び出しによるエラー）を避けやすくなり、より安全で流暢なコードが書ける場合があります。

## 📨 メソッド呼び出しの仕組み: メッセージパッシング

Rubyのメソッド呼び出し `オブジェクト.メソッド名(引数)` は、厳密には「**メッセージパッシング**」という概念に基づいています。

`5.times` というコードは、以下のように解釈されます。

1.  レシーバ（受信者）: `5` という `Integer` オブジェクト
2.  メッセージ: `:times` というシンボル（メソッド名）
3.  `5` オブジェクトに `:times` というメッセージを送る。
4.  `5` オブジェクト（の所属する `Integer` クラス）は、そのメッセージを解釈し、関連付けられた処理（ブロックを5回実行する）を実行する。

この考え方は、オブジェクト指向の「カプセル化（オブジェクトが自身の振る舞いを決定する）」を強力にサポートします。`+` などの演算子でさえ、実際にはメソッド呼び出しのシンタックスシュガー（糖衣構文）です。

```ruby-repl:6
irb(main):001:0> 10 + 3
=> 13
irb(main):002:0> 10.+(3) # 内部的にはこれと同じ
=> 13
```

## 🛠️ よく使う組み込みクラスのメソッド

すべてがオブジェクトであるため、Rubyは基本的なデータ型に対して非常に多くの便利なメソッドを標準で提供しています。

### String (文字列)

`String` クラスには、テキスト操作のための豊富なメソッドが用意されています。

```ruby:string_methods.rb
text = " ruby is convenient "

# 先頭と末尾の空白を除去
cleaned_text = text.strip
puts "Strip: '#{cleaned_text}'"

# 先頭の文字を大文字に
puts "Capitalize: #{cleaned_text.capitalize}"

# "convenient" を "powerful" に置換
puts "Gsub: #{cleaned_text.gsub("convenient", "powerful")}"

# "ruby" という文字列で始まっているか？
puts "Start with 'ruby'?: #{cleaned_text.start_with?("ruby")}"

# 単語に分割 (配列が返る)
words = cleaned_text.split(" ")
p words # p はデバッグ用の表示メソッド
```

```ruby-exec:string_methods.rb
Strip: 'ruby is convenient'
Capitalize: Ruby is convenient
Gsub: ruby is powerful
Start with 'ruby'?: true
["ruby", "is", "convenient"]
```

### Integer / Float (数値)

数値クラス (総称して `Numeric`) も便利なメソッドを持っています。

```ruby-repl:7
irb(main):001:0> # Integer
irb(main):002:0> 10.even?
=> true
irb(main):003:0> 10.odd?
=> false
irb(main):004:0> 5.to_s
=> "5"
irb(main):005:0> 5.to_f
=> 5.0

irb(main):006:0> # Float
irb(main):007:0> 10.5.round
=> 11
irb(main):008:0> 10.5.floor # 切り捨て
=> 10
irb(main):009:0> 10.5.ceil # 切り上げ
=> 11
irb(main):010:0> (10.5).to_i
=> 10
```

## 📜 この章のまとめ

  * Rubyでは、数値、文字列、`nil` を含むすべてが **オブジェクト** です。
  * すべてのオブジェクトは **クラス** に属しています（例: `5` は `Integer` クラス）。
  * オブジェクトであるため、すべての値は **メソッド** を持つことができます（例: `5.times`, `"hello".upcase`）。
  * メソッド呼び出しは、オブジェクトへの **メッセージパッシング** として理解されます。
  * `nil` も `NilClass` のオブジェクトであり、メソッドを持ちます。

### 練習問題1: 文字列の操作
変数 `sentence = " Welcome to the Ruby World! "` があります。`String` のメソッドを組み合わせて、最終的に `"WELCOME, RUBY"` という文字列をコンソールに出力してください。

  * ヒント: `strip`, `upcase`, `gsub` (または `sub`), `slice` (またはインデックスアクセス `[]`) などが使えます。

```ruby:practice4_1.rb
sentence = " Welcome to the Ruby World! "
```

```ruby-exec:practice4_1.rb
```


### 練習問題2: 数値と判定

`Float` の値 `123.456` があります。この値を四捨五入して整数（`Integer`）にした後、その整数が偶数(even)か奇数(odd)かを判定して、`"Result is even"` または `"Result is odd"` と出力するコードを書いてください。

```ruby:practice4_2.rb
value = 123.456
```

```ruby-exec:practice4_2.rb
```
