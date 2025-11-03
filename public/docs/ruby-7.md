# 第7章: クラスとオブジェクト（基本）

Rubyは純粋なオブジェクト指向言語であり、第4章「すべてがオブジェクト」で学んだように、数値や文字列さえもオブジェクトです。この章では、それらのオブジェクトの「設計図」である**クラス**を定義する方法について学びます。

他のオブジェクト指向言語（Java, Python, C\#など）の経験があれば、概念は馴染み深いはずです。Ruby特有の構文（`@`や`attr_*`など）に注目してください。

## 💴 クラス定義: class, initialize

Rubyでは、`class`キーワードを使ってクラスを定義します。クラス名は慣習として**大文字**で始めます（例: `MyClass`）。

`new`メソッドが呼ばれたときに実行される特別なメソッドが `initialize` です。これは他の言語における**コンストラクタ**に相当し、インスタンスの初期化処理を行います。

```ruby:user.rb
# クラス名はアッパーキャメルケース（PascalCase）で記述します
class User
  # newが呼ばれた際に自動的に実行される初期化メソッド
  def initialize(name, age)
    # インスタンス変数は @ で始める
    @name = name
    @age = age
    puts "Userオブジェクトが作成されました！"
  end
end

# クラスからインスタンスを生成
# User.new は initialize メソッドを呼び出す
user1 = User.new("Alice", 30)
user2 = User.new("Bob", 25)

p user1
p user2
```

```ruby-exec:user.rb
Userオブジェクトが作成されました！
Userオブジェクトが作成されました！
<User:0x0000... @name="Alice", @age=30>
<User:0x0000... @name="Bob", @age=25>
```

## 🏃‍♂️ インスタンス変数 (@var) とインスタンスメソッド

### インスタンス変数

`@`で始まる変数（例: `@name`）は**インスタンス変数**です。

  * そのクラスのインスタンス（オブジェクト）ごとに個別に保持されます。
  * `initialize`や他のインスタンスメソッド内で定義・参照されます。
  * **デフォルトで外部から直接アクセスすることはできません（カプセル化）**。

### インスタンスメソッド

`def`で定義されたメソッド（`initialize`を除く）が**インスタンスメソッド**です。これらはインスタンスの「振る舞い」を定義し、そのインスタンスのインスタンス変数（`@var`）にアクセスできます。

```ruby:user_greet.rb
class User
  def initialize(name, age)
    @name = name
    @age = age
  end

  # インスタンスメソッドの定義
  def greet
    # メソッド内からインスタンス変数（@name, @age）を参照
    puts "こんにちは、#{@name}さん (#{@age}歳) です。"
  end
end

user1 = User.new("Alice", 30)

# インスタンスメソッドの呼び出し
user1.greet
```

```ruby-exec:user_greet.rb
こんにちは、Aliceさん (30歳) です。
```

## 🔐 アクセサ: attr\_reader, attr\_writer, attr\_accessor

前述の通り、`@name`のようなインスタンス変数は外部から直接参照・変更できません。

```ruby:access_error.rb
class User
  def initialize(name)
    @name = name
  end
end

user = User.new("Alice")
p user.name  #=> NoMethodError
user.name = "Bob" #=> NoMethodError
```

```ruby-exec:access_error.rb
NoMethodError (undefined method `name'...)
```


外部からアクセスさせるためには、**アクセサメソッド**（ゲッターとセッター）を定義する必要があります。

### 手動での定義

JavaやC\#のように、ゲッターとセッターを明示的に書くこともできます。

```ruby:manual_accessor.rb
class Product
  def initialize(name)
    @name = name
  end

  # ゲッター (値の読み取り)
  def name
    @name
  end

  # セッター (値の書き込み)
  # メソッド名が = で終わるのが特徴
  def name=(new_name)
    @name = new_name
  end
end

item = Product.new("Laptop")
puts item.name         # ゲッター(item.name)の呼び出し
item.name = "Desktop"  # セッター(item.name=)の呼び出し
puts item.name
```

```ruby-exec:manual_accessor.rb
Laptop
Desktop
```

### `attr_*` による自動定義

Rubyでは、上記のような定型的なアクセサメソッドを自動で定義するための便利な「マクロ」が用意されています。これらはクラス定義のトップレベルで使います。

  * `attr_reader :var` : ゲッター（読み取り専用）を定義します。
  * `attr_writer :var` : セッター（書き込み専用）を定義します。
  * `attr_accessor :var` : ゲッターとセッターの両方を定義します。

引数にはインスタンス変数名の`@`を除いた**シンボル**（`:`から始まる名前）を渡します。

```ruby:auto_accessor.rb
class Product
  # @name のゲッターとセッターを自動定義
  attr_accessor :name
  # @price のゲッターのみを自動定義 (読み取り専用)
  attr_reader :price
  # @stock のセッターのみを自動定義 (書き込み専用)
  attr_writer :stock

  def initialize(name, price, stock)
    @name = name
    @price = price
    @stock = stock
  end

  def summary
    # ゲッターは self.price とも書けるが、
    # クラス内部では @price と直接アクセスするのが一般的
    "商品: #{@name}, 価格: #{@price}円"
  end
end

item = Product.new("Mouse", 3000, 50)

# attr_accessor
puts item.name       # ゲッター
item.name = "Keyboard" # セッター
puts item.name

# attr_reader
puts item.price      # ゲッター
# item.price = 3500  # => NoMethodError (undefined method `price=')

# attr_writer
# puts item.stock    # => NoMethodError (undefined method `stock')
item.stock = 100     # セッター

puts item.summary
```

```ruby-exec:auto_accessor.rb
Mouse
Keyboard
3000
商品: Keyboard, 価格: 3000円
```

## 🏢 クラス変数 (@@var) とクラスメソッド (self.method\_name)

### クラス変数 (@@var)

`@@`で始まる変数（例: `@@count`）は**クラス変数**です。

  * インスタンスごとではなく、**クラス全体で共有**されます。
  * そのクラスのすべてのインスタンスから参照・変更が可能です。
  * （注意）継承した場合、子クラスとも共有されるため、意図しない動作の原因になることもあり、使用には注意が必要です。

### クラスメソッド (self.method\_name)

インスタンスではなく、**クラス自体から呼び出すメソッド**です。`def self.メソッド名` のように `self.` をつけて定義します。

  * `User.new` の `new` も、実はクラスメソッドの一種です。
  * インスタンス変数 (`@var`) にはアクセスできません（インスタンスが存在しないため）。
  * クラス変数 (`@@var`) にはアクセスできます。
  * ファクトリメソッド（特定のパターンのインスタンスを生成するメソッド）や、クラス全体に関わる操作（例: 総数のカウント）によく使われます。

```ruby:counter.rb
class Counter
  # クラス変数（クラス全体で共有）
  @@total_count = 0

  attr_reader :id

  def initialize(id)
    @id = id
    # インスタンスが作られるたびにクラス変数を増やす
    @@total_count += 1
  end

  # クラスメソッド (self. をつける)
  # クラス変数を返す
  def self.total_count
    @@total_count
  end

  # インスタンスメソッド
  def report_total
    # インスタンスメソッドからもクラス変数を参照できる
    "私のIDは #{@id} です。総数は #{@@total_count} です。"
  end
end

# クラスメソッドの呼び出し
puts "初期カウント: #{Counter.total_count}" #=> 0

c1 = Counter.new(1)
c2 = Counter.new(2)

# クラスメソッドの呼び出し
puts "最終カウント: #{Counter.total_count}" #=> 2

# インスタンスメソッドの呼び出し
puts c1.report_total #=> 私のIDは 1 です。総数は 2 です。
puts c2.report_total #=> 私のIDは 2 です。総数は 2 です。

# c1.total_count #=> NoMethodError (インスタンスからは呼べない)
```

```ruby-exec:counter.rb
初期カウント: 0
最終カウント: 2
私のIDは 1 です。総数は 2 です。
私のIDは 2 です。総数は 2 です。
```

## 👪 継承 (\<) と super

Rubyは**単一継承**をサポートしています。`<` 記号を使って親クラス（スーパークラス）を指定します。

子クラス（サブクラス）は、親クラスのメソッドや変数を引き継ぎます。

### `super`

子クラスで親クラスと同じ名前のメソッドを定義（**オーバーライド**）した際、`super`キーワードを使うと、**親クラスの同名メソッドを呼び出す**ことができます。

これは特に `initialize` メソッドで、親クラスの初期化処理を呼び出すために必須となります。

```ruby:vehicle.rb
# 親クラス (スーパークラス)
class Vehicle
  attr_reader :name

  def initialize(name)
    @name = name
    puts "Vehicleを初期化中: #{@name}"
  end

  def move
    puts "#{@name} は移動します。"
  end
end

# 子クラス (サブクラス)
# Vehicle クラスを継承
class Car < Vehicle
  def initialize(name, color)
    # super で親クラスの initialize を呼び出す
    # (name を渡す)
    super(name)
    @color = color
    puts "Carを初期化中: 色は#{@color}"
  end

  # move メソッドをオーバーライド (上書き)
  def move
    # super で親クラスの move メソッドを呼び出す
    super
    # Car 固有の処理を追加
    puts "車輪が回転します。"
  end
end

my_car = Car.new("MyCar", "Red")
puts "---"
my_car.move
```

```ruby-exec:vehicle.rb
Vehicleを初期化中: MyCar
Carを初期化中: 色はRed
---
MyCar は移動します。
車輪が回転します。
```

`super` は引数を省略すると、現在のメソッドが受け取った引数をそのまま親メソッドに渡します。`super()` のように `()` をつけると、引数なしで親メソッドを呼び出します。

## 📝 この章のまとめ

  * クラスは `class` キーワードで定義し、インスタンスは `.new` で生成します。
  * `initialize` はインスタンス生成時に呼ばれるコンストラクタです。
  * インスタンス変数は `@` で始まり、インスタンスごとに独立し、デフォルトでプライベートです。
  * `attr_reader`, `attr_writer`, `attr_accessor` は、インスタンス変数へのアクセサ（ゲッター/セッター）を自動定義するマクロです。
  * クラス変数は `@@` で始まり、クラスと全インスタンスで共有されます。
  * クラスメソッドは `def self.メソッド名` で定義し、クラス自体から呼び出します。
  * 継承は `<` で行い、`super` で親クラスの同名メソッドを呼び出します。

### 練習問題1: `Book` クラスの作成

以下の仕様を持つ `Book` クラスを作成してください。

1.  `initialize` で `title`（タイトル）と `author`（著者）を受け取る。
2.  `title` と `author` は、インスタンス変数（`@title`, `@author`）に格納する。
3.  `title` と `author` は、どちらも外部から読み取り可能（書き換えは不可）にする。
4.  `info` というインスタンスメソッドを持ち、`"タイトル: [title], 著者: [author]"` という形式の文字列を返す。

```ruby:practice7_1.rb
# ここにBookクラスの定義を書いてください


book = Book.new("Ruby入門", "Sato")
puts book.info
puts book.title
# book.title = "改訂版" #=> エラー (NoMethodError) になるはず
```

```ruby-exec:practice7_1.rb
(実行結果例)
タイトル: Ruby入門, 著者: Sato
Ruby入門
```


### 練習問題2: 継承を使った `EBook` クラスの作成

問題1で作成した `Book` クラスを継承して、以下の仕様を持つ `EBook`（電子書籍）クラスを作成してください。

1.  `initialize` で `title`, `author`, `file_size`（ファイルサイズ, 例: "10MB"）を受け取る。
2.  `title` と `author` の初期化は、`Book` クラスの `initialize` を利用する (`super` を使う)。
3.  `file_size` は外部から読み取り可能にする。
4.  `info` メソッドをオーバーライドし、`"タイトル: [title], 著者: [author] (ファイルサイズ: [file_size])"` という形式の文字列を返す。
      * ヒント: 親クラスの `info` メソッドの結果を `super` で利用すると効率的です。

```ruby:practice7_2.rb
require './practice7_1.rb'  # 7_1のコードを実行してBookの定義を読み込みます

# ここにEBookクラスの定義を書いてください

ebook = EBook.new("実践Ruby", "Tanaka", "2.5MB")
puts ebook.info
puts ebook.title
```

```ruby-exec:practice7_2.rb
タイトル: 実践Ruby, 著者: Tanaka (ファイルサイズ: 2.5MB)
実践Ruby
```
