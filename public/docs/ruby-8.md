# 第8章: モジュールとミックスイン（オブジェクト指向の拡張）

Rubyのオブジェクト指向において、クラスの継承は「is-a」（〜である）関係を表現するのに適しています。しかし、「has-a」（〜を持つ）や「can-do」（〜ができる）といった**振る舞い（ビヘイビア）**を複数の異なるクラス間で共有したい場合があります。

他の言語では「インターフェース」や「トレイト」で解決するこの問題を、Rubyは**モジュール (Module)** と **ミックスイン (Mix-in)** という強力な仕組みで解決します。

## モジュール (module) の2つの役割

`module` キーワードで定義されるモジュールには、大きく分けて2つの主要な役割があります。

1.  **名前空間 (Namespace):**
    関連するクラス、メソッド、定数を一つのグループにまとめ、名前の衝突（コンフリクト）を防ぎます。
2.  **ミックスイン (Mix-in):**
    メソッドの集まりを定義し、それをクラスに `include` することで、インスタンスメソッドとして機能を追加します。これはRubyの「多重継承」の代替手段です。

## 名前空間としてのモジュール

プログラムが大規模になると、異なる目的で同じ名前のクラス（例: `Database::User` と `WebApp::User`）を使いたくなることがあります。モジュールは、これらを区別するための「仕切り」として機能します。

名前空間内の要素には、`::` (スコープ解決演算子) を使ってアクセスします。

```ruby:module_example.rb
module AppUtilities
  VERSION = "1.0.0"
  
  class Logger
    def log(msg)
      puts "[App log] #{msg}"
    end
  end
  
  # モジュールメソッド (self. をつける)
  def self.default_message
    "Hello from Utility"
  end
end

# 定数へのアクセス
puts AppUtilities::VERSION

# モジュールメソッドの呼び出し
puts AppUtilities.default_message

# モジュール内のクラスのインスタンス化
logger = AppUtilities::Logger.new
logger.log("Initialized.")
```

```ruby-exec:module_example.rb
1.0.0
Hello from Utility
[App log] Initialized.
```

## ミックスインとしてのモジュール (include)

モジュールの最も強力な機能がミックスインです。これにより、クラスは継承ツリーとは無関係に、モジュールの振る舞い（インスタンスメソッド）を取り込むことができます。

`include` を使うと、モジュールはクラスの継承チェーン（祖先チェーン）に挿入されます。具体的には、`include` したクラスのスーパークラスの「直前」に挿入されます。

```ruby:mix_in_example.rb
# 「飛ぶ」能力を提供するモジュール
module Flyable
  def fly
    puts "I'm flying! My speed is #{fly_speed}."
  end

  # このモジュールは、include したクラスが 
  # `fly_speed` メソッドを実装していることを期待している
end

# 「泳ぐ」能力を提供するモジュール
module Swimmable
  def swim
    puts "I'm swimming!"
  end
end

class Bird
  # fly_speed を実装
  def fly_speed
    "10km/h"
  end
end

class Duck < Bird
  include Flyable   # 飛べる
  include Swimmable # 泳げる
end

class Penguin < Bird
  include Swimmable # 泳げる (飛べない)
end

class Airplane
  include Flyable   # 飛べる (生物ではない)

  def fly_speed
    "800km/h"
  end
end

puts "--- Duck ---"
duck = Duck.new
duck.fly
duck.swim

puts "--- Penguin ---"
penguin = Penguin.new
# penguin.fly #=> NoMethodError
penguin.swim

puts "--- Airplane ---"
airplane = Airplane.new
airplane.fly
# airplane.swim #=> NoMethodError
```

```ruby-exec:mix_in_example.rb
--- Duck ---
I'm flying! My speed is 10km/h.
I'm swimming!
--- Penguin ---
I'm swimming!
--- Airplane ---
I'm flying! My speed is 800km/h.
```

`Duck` と `Airplane` は全く異なるクラス（`Bird` のサブクラスと、`Object` のサブクラス）ですが、`Flyable` モジュールを `include` することで `fly` メソッドを共有できています。

## include vs extend

`include` と `extend` は、モジュールのメソッドをどこに追加するかが異なります。

  * `include`: モジュールのメソッドを、クラスの**インスタンスメソッド**として追加します。
  * `extend`: モジュールのメソッドを、クラスの**クラスメソッド**（特異メソッド）として追加します。

```ruby:extend_example.rb
module HelperMethods
  def info
    "This is a helper method."
  end
end

# --- include の場合 ---
class IncludedClass
  include HelperMethods
end

obj = IncludedClass.new
obj.info # インスタンスメソッドになる
# IncludedClass.info  #=> NoMethodError

# --- extend の場合 ---
class ExtendedClass
  extend HelperMethods
end

ExtendedClass.info # クラスメソッドになる
obj2 = ExtendedClass.new
# obj2.info  #=> NoMethodError
```

```ruby-exec:extend_example.rb
"This is a helper method."
"This is a helper method."
```

## アクセスコントロール (public, private, protected)

Rubyのアクセスコントロールは、他の言語と少し異なる振る舞い、特に `private` の動作に特徴があります。

  * `public` (デフォルト)

      * どこからでも呼び出せます。レシーバ（`object.`）を省略しても、明示しても構いません。

  * `private`

      * **レシーバを明示して呼び出すことができません**。
      * `self.` を付けずに、クラス内部（またはサブクラス）からのみ呼び出せます。
      * 主にクラス内部の詳細を隠蔽（カプセル化）するために使われます。

  * `protected`

      * `private` と似ていますが、**同じクラス（またはサブクラス）の他のインスタンスをレシーバとして呼び出すことができます**。
      * オブジェクト同士を比較するメソッドなどで使われます。

```ruby:access_control_demo.rb
class Wallet
  attr_reader :id

  def initialize(id, amount)
    @id = id
    @balance = amount # private なインスタンス変数
  end

  # public メソッド (外部インターフェース)
  def transfer(other_wallet, amount)
    if withdraw(amount)
      other_wallet.deposit(amount)
      puts "Transferred #{amount} from #{self.id} to #{other_wallet.id}"
    else
      puts "Transfer failed: Insufficient funds in #{self.id}"
    end
  end

  # protected メソッド (インスタンス間での連携)
  protected

  def deposit(amount)
    @balance += amount
  end

  # private メソッド (内部処理)
  private

  def withdraw(amount)
    if @balance >= amount
      @balance -= amount
      true
    else
      false
    end
  end
end

w1 = Wallet.new("Wallet-A", 100)
w2 = Wallet.new("Wallet-B", 50)

# public メソッドはどこからでも呼べる
w1.transfer(w2, 70)

puts "w1 ID: #{w1.id}"
# puts "w1 Balance: #{w1.balance}" #=> NoMethodError (attr_reader がないため)

# private / protected メソッドは外部から直接呼べない
# w1.deposit(100)  #=> NoMethodError: protected method `deposit' called...
# w1.withdraw(10)  #=> NoMethodError: private method `withdraw' called...
```

```ruby-exec:access_control_demo.rb
Transferred 70 from Wallet-A to Wallet-B
w1 ID: Wallet-A
```

この例では、`transfer` (public) が内部で `withdraw` (private) を呼び出し、引数で受け取った `other_wallet` の `deposit` (protected) を呼び出しています。`deposit` は `protected` なので、`other_wallet.` というレシーバを明示しても `Wallet` クラス内からは呼び出せます。

## この章のまとめ

  * **モジュール**は `module` キーワードで定義され、**名前空間**と**ミックスイン**の2つの役割を持ちます。
  * 名前空間としては、`::` を使って定数やクラスをグループ化し、名前の衝突を防ぎます。
  * ミックスインとしては、`include` することでモジュールのメソッドを**インスタンスメソッド**としてクラスに追加できます。これは多重継承の代わりとなる強力な機能です。
  * `extend` は、モジュールのメソッドを**クラスメソッド**として追加します。
  * `public`, `private`, `protected` でメソッドの可視性を制御します。
  * Rubyの `private` は「レシーバを指定して呼び出せない」というユニークな制約を持ちます。

### 練習問題1: カウンター機能のミックスイン

`Enumerable` モジュール（第6章で少し触れました）のように、`include` したクラスに便利な機能を追加するモジュールを作成します。

1.  `Counter` というモジュールを定義してください。
2.  `Counter` モジュールは `count_items(item_to_find)` というメソッドを持つものとします。
3.  このメソッドは、`include` したクラスが `items` という名前の配列（`Array`）を返すインスタンスメソッドを持っていることを前提とします。
4.  `count_items` は、その `items` 配列内に `item_to_find` がいくつ含まれているかを返します。
5.  `ShoppingCart` クラスと `WordList` クラスを作成し、両方で `items` メソッドを実装し、`Counter` モジュールを `include` して `count_items` が動作することを確認してください。

```ruby:practice8_1.rb
module Counter

end

class ShoppingCart

end

class WordList

end



```

```ruby-exec:practice8_1.rb
```

### 練習問題2: protected を使った比較

`protected` のユースケースを理解するための問題です。

1.  `Score` クラスを作成します。`initialize` で `@value` （得点）をインスタンス変数として保持します。
2.  `higher_than?(other_score)` という `public` なインスタンスメソッドを定義してください。これは、`other_score` （`Score` の別のインスタンス）より自分の `@value` が高ければ `true` を返します。
3.  `higher_than?` メソッドの実装のために、`value` という `protected` メソッドを作成し、`@value` を返すようにしてください。
4.  `higher_than?` の内部では、`self.value > other_score.value` のように `protected` メソッドを呼び出してください。
5.  2つの `Score` インスタンスを作成し、`higher_than?` が正しく動作することを確認してください。また、`protected` メソッドである `value` をインスタンスの外部から直接呼び出そうとするとエラーになることも示してください。

```ruby:practice8_2.rb
class Score

end


```

```ruby-exec:practice8_2.rb
```
