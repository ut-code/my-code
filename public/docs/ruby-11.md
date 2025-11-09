# 第11章: テスト文化入門 - Minitest

Rubyは動的型付け言語であり、コンパイル時ではなく実行時に型が決まります。これは柔軟で高速な開発を可能にする反面、型の不一致などによる単純なミスが実行時まで検出されにくいという特性も持ちます。

そのため、Rubyコミュニティでは「**テストは文化**」と言われるほど、自動化されたテストを書くことが重視されます。テストは、コードが期待通りに動作することを保証するだけでなく、未来の自分や他の開発者がコードをリファクタリング（修正・改善）する際の「安全網」として機能します。

この章では、Rubyに標準で添付されているテスティングフレームワーク「Minitest」を使い、テストの基本的な書き方と文化を学びます。

## 標準添付のテスティングフレームワーク「Minitest」

Minitestは、Rubyに標準で含まれている（＝別途インストール不要）軽量かつ高速なテストフレームワークです。

Ruby on Railsなどの主要なフレームワークもデフォルトでMinitestを採用しており、Rubyのエコシステムで広く使われています。（RSpecという、よりDSL（ドメイン固有言語）ライクに記述できる人気のフレームワークもありますが、まずは標準のMinitestを理解することが基本となります。）

Minitestは、`Minitest::Test` を継承する「Unitスタイル」と、`describe` ブロックを使う「Specスタイル」の2種類の書き方を提供しますが、この章では最も基本的なUnitスタイルを学びます。

## テストファイルの作成と実行

早速、簡単なクラスをテストしてみましょう。

### 1\. テスト対象のクラスの作成

まず、テスト対象となる簡単な電卓クラスを作成します。

```ruby:calculator.rb
# シンプルな電卓クラス
class Calculator
  def add(a, b)
    a + b
  end

  def subtract(a, b)
    a - b
  end
end
```

### 2\. テストファイルの作成

Rubyの規約では、テストファイルは `test_` プレフィックス（例: `test_calculator.rb`）または `_test.rb` サフィックス（例: `calculator_test.rb`）で作成するのが一般的です。ここでは `test_calculator.rb` を作成します。

テストファイルは、以下の要素で構成されます。

1.  `require 'minitest/autorun'`
      * Minitestライブラリを読み込み、ファイル実行時にテストが自動で走るようにします。
2.  `require_relative 'ファイル名'`
      * テスト対象のファイル（今回は `calculator.rb`）を読み込みます。
3.  `class クラス名 < Minitest::Test`
      * テストクラスを定義し、`Minitest::Test` を継承します。
4.  `def test_メソッド名`
      * `test_` で始まるメソッドを定義します。これが個々のテストケースとなります。

```ruby:test_calculator.rb
require 'minitest/autorun'
require_relative 'calculator'

class CalculatorTest < Minitest::Test
  # `test_` で始まるメソッドがテストとして実行される
  def test_addition
    # テスト対象のインスタンスを作成
    calc = Calculator.new
    
    # 期待値 (Expected)
    expected = 5
    # 実際の結果 (Actual)
    actual = calc.add(2, 3)

    # アサーション（後述）
    # 期待値と実際の結果が等しいことを検証する
    assert_equal(expected, actual)
  end

  def test_subtraction
    calc = Calculator.new
    # アサーションは1行で書くことが多い
    assert_equal(1, calc.subtract(4, 3))
  end
end
```

### 3\. テストの実行

ターミナルで、作成した**テストファイル**を実行します。

```ruby-exec:test_calculator.rb
Run options: --seed 51740

# Running:

..

Finished in 0.001099s, 1819.8362 runs/s, 1819.8362 assertions/s.

2 runs, 2 assertions, 0 failures, 0 errors, 0 skips
```

実行結果のサマリに注目してください。

  * `.`（ドット）: テストが成功（Pass）したことを示します。
  * `2 runs, 2 assertions`: 2つのテスト（`test_addition` と `test_subtraction`）が実行され、合計2回のアサーション（`assert_equal`）が成功したことを意味します。
  * `0 failures, 0 errors`: 失敗もエラーもありません。

もしテストが失敗すると、`F`（Failure）や `E`（Error）が表示され、詳細なレポートが出力されます。

## アサーション（assert\_equal, assert 等）の書き方

アサーション（Assertion = 表明、断言）は、「この値はこうあるべきだ」と検証するためのメソッドです。Minitestは `Minitest::Test` を継承したクラス内で、様々なアサーションメソッドを提供します。

### `assert_equal(expected, actual)`

最もよく使うアサーションです。「期待値（expected）」と「実際の結果（actual）」が `==` で等しいことを検証します。

> **⚠️ 注意:** 引数の順序が重要です。\*\*1番目が「期待値」、2番目が「実際の結果」\*\*です。逆にすると、失敗時のメッセージが非常に分かりにくくなります。

```ruby-repl
irb> require 'minitest/assertions'
=> true
irb> include Minitest::Assertions
=> Object
irb> def assert_equal(expected, actual); super; end # irbで使うための設定
=> :assert_equal

irb> assert_equal 5, 2 + 3
=> true

irb> assert_equal 10, 2 + 3
# Minitest::Assertion:         <--- 失敗（Assertion Failed）
# Expected: 10
#   Actual: 5
```

### `assert(test)`

`test` が **true**（またはtrueと評価される値）であることを検証します。偽（`false` または `nil`）の場合は失敗します。

```ruby-repl
irb> assert "hello".include?("e")
=> true
irb> assert [1, 2, 3].empty?
# Minitest::Assertion: Expected [] to be empty?.
```

### `refute(test)`

`assert` の逆です。`test` が **false** または `nil` であることを検証します。

```ruby-repl
irb> refute [1, 2, 3].empty?
=> true
irb> refute "hello".include?("e")
# Minitest::Assertion: Expected "hello".include?("e") to be falsy.
```

### `assert_nil(obj)`

`obj` が `nil` であることを検証します。

```ruby-repl
irb> a = nil
=> nil
irb> assert_nil a
=> true
```

### `assert_raises(Exception) { ... }`

ブロック `{ ... }` を実行した結果、指定した例外（`Exception`）が発生することを検証します。

これは、意図したエラー処理が正しく動作するかをテストするのに非常に重要です。

```ruby:test_calculator_errors.rb
require 'minitest/autorun'

class Calculator
  def divide(a, b)
    raise ZeroDivisionError, "Cannot divide by zero" if b == 0
    a / b
  end
end

class CalculatorErrorTest < Minitest::Test
  def test_division_by_zero
    calc = Calculator.new

    # ブロック内で ZeroDivisionError が発生することを期待する
    assert_raises(ZeroDivisionError) do
      calc.divide(10, 0)
    end
  end
end
```

```ruby-exec:test_calculator_errors.rb
Run options: --seed 19800

# Running:

.

Finished in 0.000624s, 1602.5641 runs/s, 1602.5641 assertions/s.

1 runs, 1 assertions, 0 failures, 0 errors, 0 skips
```

## 簡単なTDD（テスト駆動開発）の体験

TDD (Test-Driven Development) は、機能のコードを書く前に、**まず失敗するテストコードを書く**開発手法です。TDDは以下の短いサイクルを繰り返します。

1.  **Red (レッド):**
      * これから実装したい機能に対する「失敗するテスト」を書きます。
      * まだ機能が存在しないため、テストは（当然）失敗（Red）します。
2.  **Green (グリーン):**
      * そのテストをパスさせるための**最小限の**機能コードを実装します。
      * テストが成功（Green）すればOKです。コードの綺麗さはまだ問いません。
3.  **Refactor (リファクタリング):**
      * テストが成功した状態を維持したまま、コードの重複をなくしたり、可読性を上げたりする「リファクタリング」を行います。

`Calculator` クラスに、`multiply`（掛け算）メソッドをTDDで追加してみましょう。

### 1\. Red: 失敗するテストを書く

まず、`test_calculator.rb` に `multiply` のテストを追加します。

```ruby:calculator.rb
# シンプルな電卓クラス
class Calculator
  def add(a, b)
    a + b
  end

  def subtract(a, b)
    a - b
  end
end
```

```ruby:test_calculator_tdd.rb
require 'minitest/autorun'
require_relative 'calculator' # calculator.rb は add と subtract のみ

class CalculatorTest < Minitest::Test
  def setup
    # @calc をインスタンス変数にすると、各テストメソッドで使える
    @calc = Calculator.new
  end

  def test_addition
    assert_equal(5, @calc.add(2, 3))
  end

  def test_subtraction
    assert_equal(1, @calc.subtract(4, 3))
  end
  
  # --- TDDサイクル スタート ---
  
  # 1. Red: まずテストを書く
  def test_multiplication
    assert_equal(12, @calc.multiply(3, 4))
  end
end
```

この時点で `calculator.rb` に `multiply` メソッドは存在しません。テストを実行します。

```ruby-exec:test_calculator_tdd.rb
# (実行結果の抜粋)
...
Error:
CalculatorTest#test_multiplication:
NoMethodError: undefined method `multiply' for #<Calculator:0x...>
...
1 runs, 0 assertions, 0 failures, 1 errors, 0 skips
```

期待通り、`NoMethodError` でテストが**エラー (E)** になりました。これが「Red」の状態です。（Failure (F) はアサーションが期待と違った場合、Error (E) はコード実行中に例外が発生した場合を指します）

### 2\. Green: テストを通す最小限のコードを書く

次に、`calculator.rb` に以下のように `multiply` メソッドを実装し、テストをパス（Green）させます。

```ruby
class Calculator
  def add(a, b)
    a + b
  end

  def subtract(a, b)
    a - b
  end

  # 2. Green: テストを通す最小限の実装
  def multiply(a, b)
    a * b
  end
end
```

`calculator.rb` を編集し、再びテストを実行すると、以下のようにすべてのテストが成功します。「Green」の状態です。

```bash
$ ruby test_calculator_tdd.rb
...
Finished in ...
3 runs, 3 assertions, 0 failures, 0 errors, 0 skips
```

### 3\. Refactor: リファクタリング

今回は実装が非常にシンプルなのでリファクタリングの必要はあまりありませんが、もし `multiply` の実装が複雑になったり、他のメソッドとコードが重複したりした場合は、この「Green」の（テストが成功している）状態で安心してコードをクリーンアップします。

TDDは、この「Red -\> Green -\> Refactor」のサイクルを高速で回すことにより、バグの少ない、メンテンスしやすいコードを堅実に構築していく手法です。

## 📈 この章のまとめ

  * Rubyは動的型付け言語であるため、実行時の動作を保証する**テストが非常に重要**です。
  * **Minitest** はRubyに標準添付された軽量なテスティングフレームワークです。
  * テストファイルは `require 'minitest/autorun'` し、`Minitest::Test` を継承します。
  * テストメソッドは `test_` プレフィックスで定義します。
  * `assert_equal(期待値, 実際の結果)` が最も基本的なアサーションです。
  * `assert` (true検証), `refute` (false検証), `assert_raises` (例外検証) などもよく使われます。
  * **TDD (テスト駆動開発)** は「Red (失敗) -\> Green (成功) -\> Refactor (改善)」のサイクルで開発を進める手法です。

### 練習問題1: Stringクラスのテスト

`Minitest::Test` を使って、Rubyの組み込みクラスである `String` の動作をテストする `test_string.rb` を作成してください。以下の2つのテストメソッドを実装してください。

  * `test_string_length`: `"hello"` の `length` が `5` であることを `assert_equal` で検証してください。
  * `test_string_uppercase`: `"world"` を `upcase` した結果が `"WORLD"` であることを `assert_equal` で検証してください。

```ruby:test_string.rb
require 'minitest/autorun'


```

```ruby-exec:test_string.rb
```

### 練習問題2: TDDでUserクラスを実装

TDDの「Red -\> Green」サイクルを体験してください。

1.  （Red）`User` クラスに `first_name` と `last_name` を渡してインスタンス化し、`full_name` メソッドを呼ぶと `"First Last"` のように連結された文字列が返ることを期待するテスト `test_full_name` を含む `test_user.rb` を先に作成してください。（この時点では `user.rb` は空か、存在しなくても構いません）
2.  （Green）テストがパスするように、`user.rb` に `User` クラスを実装してください。（`initialize` で名前を受け取り、`full_name` メソッドで連結します）


```ruby:user.rb
```

```ruby:test_user.rb
require 'minitest/autorun'
require_relative 'user'

```

```ruby-exec:test_user.rb
```
