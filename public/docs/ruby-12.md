# 第12章: メタプログラミング入門

Rubyの最も強力であり、同時に最も特徴的な側面の一つが「メタプログラミング」です。これは「コードがコードを書く（あるいは変更する）」能力を指します。他の言語でコンパイル時やリフレクションAPIを通じて行っていた操作の多くを、Rubyでは実行時に直接、かつ柔軟に行うことができます。

## Rubyの動的な性質

Rubyは非常に動的な言語です。クラスは実行中に変更可能であり、メソッドの追加や削除、上書きがいつでも行えます。この章では、その動的な性質を利用したメタプログラミングの基本的な手法を学びます。

  * **オープンクラス**: Rubyでは、既存のクラス（組み込みクラスさえも）を後から「開いて」メソッドを追加・変更できます。
  * **実行時**: 多くの決定がコンパイル時ではなく実行時に行われます。

これらの性質が、DRY (Don't Repeat Yourself) の原則を追求し、柔軟なDSL（ドメイン固有言語）を構築するための基盤となります。

## send: メソッドを動的に呼び出す

通常、メソッドは `object.method_name` のようにドット（`.`）を使って呼び出します。しかし、呼び出したいメソッド名が実行時までわからない場合、`send` メソッド（または `public_send`）が役立ちます。

`send` は、第1引数にメソッド名を**シンボル**（`:`）または**文字列**で受け取り、残りの引数をそのメソッドに渡して実行します。

```ruby-repl
irb(main):001> "hello".send(:upcase)
=> "HELLO"
irb(main):002> "hello".send("length")
=> 5
irb(main):003> 10.send(:+, 5) # 演算子も内部的にはメソッドです
=> 15
irb(main):004> 
irb(main):004> method_to_call = :reverse
irb(main):005> "Ruby".send(method_to_call)
=> "ybuR"
```

> **注意**: `send` は `private` メソッドも呼び出すことができます。意図せず `private` メソッドを呼び出さないように、通常は `public_send` を使う方が安全です。

## define\_method: メソッドを動的に定義する

メソッドを動的に（実行時に）定義したい場合、`define_method` を使用します。これは主にクラスやモジュールの定義内で使われます。

`define_method` は、第1引数に定義したいメソッド名（シンボル）を、第2引数にブロック（ProcやLambda）を取ります。このブロックが、新しく定義されるメソッドの本体となります。

例えば、似たようなメソッドを多数定義する必要がある場合に非常に便利です。

```ruby:dynamic_greeter.rb
class DynamicGreeter
  # 定義したい挨拶のリスト
  GREETINGS = {
    hello: "Hello",
    goodbye: "Goodbye",
    hi: "Hi"
  }

  GREETINGS.each do |name, prefix|
    # define_methodを使ってメソッドを動的に定義する
    define_method(name) do |target|
      puts "#{prefix}, #{target}!"
    end
  end
end

greeter = DynamicGreeter.new

# 動的に定義されたメソッドを呼び出す
greeter.hello("World")
greeter.goodbye("Alice")
greeter.hi("Bob")
```

```ruby-exec:dynamic_greeter.rb
Hello, World!
Goodbye, Alice!
Hi, Bob!
```

## method\_missing: 存在しないメソッドへの応答

オブジェクトに対して定義されていないメソッドが呼び出されると、Rubyは例外（`NoMethodError`）を発生させる前に、`method_missing` という特別なメソッドを呼び出そうと試みます。

この `method_missing` を自分でオーバーライドすることで、定義されていないメソッド呼び出しを「キャッチ」し、動的に処理できます。

`method_missing` は以下の引数を受け取ります。

1.  呼び出されようとしたメソッド名（シンボル）
2.  そのメソッドに渡された引数（配列）
3.  そのメソッドに渡されたブロック（存在する場合）

```ruby:ghost_methods.rb
class DynamicLogger
  def method_missing(method_name, *args, &block)
    # 呼び出されたメソッド名が 'log_' で始まるかチェック
    if method_name.to_s.start_with?("log_")
      # 'log_' の部分を取り除いてレベル名とする
      level = method_name.to_s.delete_prefix("log_")
      
      # メッセージ（引数）を取得
      message = args.first || "(no message)"
      
      puts "[#{level.upcase}] #{message}"
    else
      # 関係ないメソッド呼び出しは、通常通り NoMethodError を発生させる
      super
    end
  end

  # respond_to? が正しく動作するように、respond_to_missing? も定義するのがベストプラクティス
  def respond_to_missing?(method_name, include_private = false)
    method_name.to_s.start_with?("log_") || super
  end
end

logger = DynamicLogger.new

logger.log_info("Application started.")
logger.log_warning("Cache is empty.")
logger.log_error("File not found.")

# respond_to? の動作確認
puts "Responds to log_info? #{logger.respond_to?(:log_info)}"
puts "Responds to undefined_method? #{logger.respond_to?(:undefined_method)}"

# 存在しないメソッド（super呼び出し）
# logger.undefined_method # => NoMethodError
```

```ruby-exec:ghost_methods.rb
[INFO] Application started.
[WARNING] Cache is empty.
[ERROR] File not found.
Responds to log_info? true
Responds to undefined_method? false
```

## Railsなどでの活用例

Rubyのメタプログラミングは、Ruby on Railsのようなフレームワークで広く活用されています。これにより、開発者は定型的なコード（ボイラープレート）を大量に書く必要がなくなり、宣言的な記述が可能になります。

  * **Active Record (ORM)**:
      * `method_missing` の典型的な例です。`User.find_by_email("test@example.com")` のようなメソッドは、`User` クラスに明示的に定義されていません。Active Recordは `method_missing` を使って `find_by_` プレフィックスを検出し、`email` カラムで検索するSQLを動的に生成します。
  * **関連付け (Associations)**:
      * `has_many :posts` や `belongs_to :user` といった記述。これらは単なる宣言に見えますが、内部では `define_method` を使い、`user.posts` や `post.user` といった便利なメソッドを実行時に定義しています。

このように、メタプログラミングはRubyエコシステムの「魔法」の多くを支える技術であり、フレームワークの内部を理解する上で不可欠です。

## ⚡ この章のまとめ

  * **メタプログラミング**とは、コードが実行時に自身の構造（クラスやメソッド）を操作する技術です。
  * `send`（または `public_send`）は、メソッド名を文字列やシンボルで指定し、動的にメソッドを呼び出します。
  * `define_method` は、実行時にメソッドを動的に定義します。DRYを保つのに役立ちます。
  * `method_missing` は、定義されていないメソッド呼び出しを捕捉し、柔軟なインターフェース（DSL）を構築するために使われます。
  * メタプログラミングは非常に強力ですが、コードの可読性やデバッグの難易度を上げる可能性もあります。使い所を理解し、**乱用は避ける**ことが重要です。

## 練習問題1: 動的アクセサ

`define_method` を使って、指定された属性名の配列からゲッター（`attr_reader`）とセッター（`attr_writer`）を動的に定義するメソッド `my_attr_accessor` を持つモジュールを作成してください。（ヒント: インスタンス変数 `@name` を読み書きするメソッドを定義します）

```ruby:practice12_1.rb
module DynamicAccessor
  def my_attr_accessor(*attrs)
    attrs.each do |attr|
      # ゲッターとセッターを動的に定義するコードをここに書く


    end
  end
end

class Person
  extend DynamicAccessor

  my_attr_accessor :name, :age
end
person = Person.new
person.name = "Alice"
person.age = 30

puts "Name: #{person.name}, Age: #{person.age}"
```

```ruby-exec:practice12_1.rb
Name: Alice, Age: 30
```

### 練習問題2: シンプルな設定オブジェクト

`method_missing` を使って、ハッシュのように動作する `SimpleConfig` クラスを作成してください。`config.api_key = "12345"` のように値を設定でき、`config.api_key` で値を取得できるようにしてください。設定されていないキーを呼び出した場合は `nil` を返すようにします。

```ruby:practice12_2.rb
class SimpleConfig
  def initialize
    @settings = {}
  end

  def method_missing(method_name, *args, &block)
    # ここにコードを書いてください


  end

  def respond_to_missing?(method_name, include_private = false)
    true
  end
end

config = SimpleConfig.new
config.api_key = "12345"
puts "API Key: #{config.api_key.inspect}"
puts "Timeout: #{config.timeout.inspect}" # 設定されていないキー
```

```ruby-exec:practice12_2.rb
API Key: "12345"
Timeout: nil
```
