# 第9章: Proc, Lambda, クロージャ

これまでの章で、Rubyの強力な機能である「ブロック」を `each` や `map` などのメソッドと共に使ってきました。しかし、ブロックは常にメソッド呼び出しに付随する形でしか使えませんでした。

この章では、そのブロックを「オブジェクト」として扱い、変数に代入したり、メソッドの引数として自由に受け渡したりする方法を学びます。これにより、Rubyの表現力はさらに向上します。

## ブロックをオブジェクトとして扱う: Proc クラス

ブロックは、それ自体ではオブジェクトではありません。しかし、Rubyにはブロックをオブジェクト化するための `Proc` クラスが用意されています。

`Proc.new` にブロックを渡すことで、`Proc` オブジェクトを作成できます。

```ruby-repl:1
irb(main):001:0> greeter = Proc.new { |name| puts "Hello, #{name}!" }
irb(main):002:0> greeter
=> #<Proc:0x000002b5b882f0f0@(irb):1>
```

作成した `Proc` オブジェクトは、`call` メソッドを使って実行できます。

```ruby-repl:2
irb(main):003:0> greeter.call("Alice")
Hello, Alice!
=> nil
irb(main):004:0> greeter.call("Bob")
Hello, Bob!
=> nil
```

`proc` という `Proc.new` のエイリアスメソッドもよく使われます。

```ruby-repl:3
irb(main):005:0> multiplier = proc { |x| x * 2 }
=> #<Proc:0x000002b5b877e8a8@(irb):5>
irb(main):006:0> multiplier.call(10)
=> 20
```

## Proc.new と lambda の違い

`Proc` オブジェクトを作成するもう一つの方法として `lambda` があります。（`->` というリテラル構文もよく使われます）

```ruby-repl:4
irb(main):007:0> adder_lambda = lambda { |a, b| a + b }
=> #<Proc:0x000002b5b86bba40@(irb):7 (lambda)>
irb(main):008:0> adder_lambda.call(3, 4)
=> 7

irb(main):009:0> subtractor_lambda = ->(x, y) { x - y }
=> #<Proc:0x000002b5b86060c8@(irb):9 (lambda)>
irb(main):010:0> subtractor_lambda.call(10, 3)
=> 7
```

`lambda` で作成されたオブジェクトも `Proc` クラスのインスタンスですが、`Proc.new` (または `proc`) で作成されたものとは、主に以下の2点で挙動が異なります。

### 1\. return の挙動

  * **Proc.new (proc)**: `return` は、Procが定義されたスコープ（通常はメソッド）からリターンします（**ローカルリターン**）。
  * **lambda**: `return` は、`lambda` ブロックの実行からリターンするだけです（**Procからのリターン**）。

これは、メソッド内で `Proc` オブジェクトを定義して実行すると、その違いが明確になります。

**Proc.new の例:**

```ruby:proc_return_example.rb
def proc_return_test
  # Proc.new で Proc オブジェクトを作成
  my_proc = Proc.new do
    puts "Proc: Inside proc"
    return "Proc: Returned from proc" # メソッド全体からリターンする
  end

  my_proc.call # Proc を実行
  puts "Proc: After proc.call (This will not be printed)"
  return "Proc: Returned from method"
end

puts proc_return_test
```

```ruby-exec:proc_return_example.rb
Proc: Inside proc
Proc: Returned from proc
```

`proc_return_test` メソッド内の `my_proc.call` が実行された時点で、Proc内の `return` が呼ばれ、メソッド自体が終了していることがわかります。

**lambda の例:**

```ruby:lambda_return_example.rb
def lambda_return_test
  # lambda で Proc オブジェクトを作成
  my_lambda = lambda do
    puts "Lambda: Inside lambda"
    return "Lambda: Returned from lambda" # lambda からリターンするだけ
  end

  result = my_lambda.call # lambda を実行
  puts "Lambda: After lambda.call"
  puts "Lambda: Result from lambda: #{result}"
  return "Lambda: Returned from method"
end

puts lambda_return_test
```

```ruby-exec:lambda_return_example.rb
Lambda: Inside lambda
Lambda: After lambda.call
Lambda: Result from lambda: Lambda: Returned from lambda
Lambda: Returned from method
```

`lambda` の場合、`my_lambda.call` 内の `return` は `lambda` の実行を終了させ、その戻り値が `result` 変数に代入されます。メソッドの実行は継続します。

### 2\. 引数の厳密さ

  * **Proc.new (proc)**: 引数の数に寛容です。足りない引数は `nil` になり、余分な引数は無視されます。
  * **lambda**: 引数の数を厳密にチェックします。過不足があると `ArgumentError` が発生します。

**Proc.new の例:**

```ruby-repl:5
irb(main):001:0> my_proc = proc { |a, b| puts "a: #{a.inspect}, b: #{b.inspect}" }
=> #<Proc:0x000002b5b882a0b8@(irb):1>

irb(main):002:0> my_proc.call(1)       # 引数が足りない
a: 1, b: nil
=> nil
irb(main):003:0> my_proc.call(1, 2, 3) # 引数が多い
a: 1, b: 2
=> nil
```

**lambda の例:**

```ruby-repl:6
irb(main):004:0> my_lambda = lambda { |a, b| puts "a: #{a.inspect}, b: #{b.inspect}" }
=> #<Proc:0x000002b5b8777170@(irb):4 (lambda)>

irb(main):005:0> my_lambda.call(1)       # 引数が足りない
(irb):5:in `block in <main>': wrong number of arguments (given 1, expected 2) (ArgumentError)
    from (irb):5:in `call'
    from (irb):5:in `<main>'
...
irb(main):006:0> my_lambda.call(1, 2, 3) # 引数が多い
(irb):6:in `block in <main>': wrong number of arguments (given 3, expected 2) (ArgumentError)
    from (irb):6:in `call'
    from (irb):6:in `<main>'
...
```

一般的に、`lambda` の方が通常のメソッド定義に近い（引数が厳密で、`return` がブロックから抜けるだけ）挙動をするため、使い分けが重要です。

## & 演算子の役割

`&` 演算子は、ブロックと `Proc` オブジェクトを相互に変換する役割を果たします。

### 1\. ブロックを Proc として受け取る

メソッド定義の最後の引数に `&` をつけて引数名（慣習的に `block`）を指定すると、そのメソッド呼び出し時に渡されたブロックが `Proc` オブジェクトに変換され、その変数に束縛されます。

```ruby:block_receiver.rb
# &block でブロックを受け取り、Proc オブジェクトとして扱う
def custom_iterator(items, &block)
  puts "Got a Proc object: #{block.inspect}"
  
  # Proc オブジェクトを call で実行
  items.each do |item|
    block.call(item.upcase) # Proc を実行
  end
end

fruits = ["apple", "banana"]

# ブロックを渡してメソッドを呼び出す
custom_iterator(fruits) do |fruit|
  puts "Processing: #{fruit}"
end
```

```ruby-exec:block_receiver.rb
Got a Proc object: #<Proc:0x000002c9a9b4d458@block_receiver.rb:11>
Processing: APPLE
Processing: BANANA
```

これにより、受け取ったブロック（`Proc`）を、メソッド内で好きなタイミングで実行したり、他のメソッドに渡したりすることが可能になります。

### 2\. Proc をブロックとして渡す

逆に、メソッドを呼び出す際に、`Proc` オブジェクトを `&` 付きで渡すと、その `Proc` オブジェクトがブロックとしてメソッドに渡されます。

`Array#map` メソッドは通常ブロックを受け取りますが、`Proc` オブジェクトを `&` を使って渡すことができます。

```ruby-repl:7
irb(main):001:0> numbers = [1, 2, 3, 4, 5]
=> [1, 2, 3, 4, 5]

irb(main):002:0> # 2倍にする Proc オブジェクト
irb(main):003:0> doubler = proc { |n| n * 2 }
=> #<Proc:0x000002b5b8828f70@(irb):3>

irb(main):004:0> # & を使って Proc をブロックとして map メソッドに渡す
irb(main):005:0> numbers.map(&doubler)
=> [2, 4, 6, 8, 10]
```

これは、以下のコードと等価です。

```ruby-repl:8
irb(main):006:0> numbers.map { |n| n * 2 }
=> [2, 4, 6, 8, 10]
```

`&` は、`Proc` とブロック（メソッド呼び出しに付随するコード）の間の架け橋となる重要な演算子です。

## クロージャ（スコープ）の概念

`Proc` オブジェクト（`lambda` も含む）の非常に重要な特性として、**クロージャ (Closure)** があります。

クロージャとは、**Proc オブジェクトが、それが定義された時点のスコープ（環境）を記憶し、後で実行される際にもそのスコープ内の変数（ローカル変数など）にアクセスできる**仕組みです。

JavaScriptなど、他の言語でクロージャに触れたことがあるかもしれません。Rubyの `Proc` も同様の機能を提供します。

```ruby:closure_example.rb
def counter_generator(initial_value)
  count = initial_value
  
  # この lambda は、外側のスコープにある `count` 変数を記憶する
  incrementer = lambda do
    puts "Current count: #{count}"
    count += 1 # 記憶した変数を更新
    puts "New count: #{count}"
  end
  
  return incrementer # Proc オブジェクトを返す
end

# counter_generator メソッドの実行は終了し、
# 本来ローカル変数 `count` は消えるはず...
counter1 = counter_generator(10)

puts "--- First call ---"
counter1.call # => Current count: 10, New count: 11

puts "--- Second call ---"
counter1.call # => Current count: 11, New count: 12

# 別のスコープを持つカウンターを作成
counter2 = counter_generator(100)
puts "--- Counter 2 call ---"
counter2.call # => Current count: 100, New count: 101

puts "--- Counter 1 call again ---"
counter1.call # => Current count: 12, New count: 13
```

```ruby-exec:closure_example.rb
--- First call ---
Current count: 10
New count: 11
--- Second call ---
Current count: 11
New count: 12
--- Counter 2 call ---
Current count: 100
New count: 101
--- Counter 1 call again ---
Current count: 12
New count: 13
```

`counter_generator` メソッドが終了した後でも、返された `lambda` オブジェクト（`counter1` や `counter2`）は、それぞれが定義された時点の `count` 変数を保持し続け、`call` されるたびにそれを更新できます。これがクロージャの力です。

## ☕ この章のまとめ

  * **Proc**: ブロックをオブジェクト化したもので、`Proc.new` や `proc` で作成できます。
  * **Lambda**: `lambda` または `->` で作成できる `Proc` オブジェクトの一種です。
  * **Proc と Lambda の違い**:
      * **return**: `proc` はローカルリターン、`lambda` はProcからのリターン。
      * **引数**: `proc` は寛容、`lambda` は厳密。
  * **& 演算子**: メソッド定義で使うとブロックを `Proc` として受け取り、メソッド呼び出しで使うと `Proc` をブロックとして渡します。
  * **クロージャ**: `Proc` や `lambda` は、定義された時点のスコープ（ローカル変数など）を記憶し、後からでもアクセスできます。

### 練習問題1: Lambda の作成

引数を2つ取り、その和を返す `lambda` を作成し、`adder` という変数に代入してください。その後、`adder.call(5, 7)` を実行して `12` が返ってくることを確認してください。

```ruby:practice9_1.rb
adder =

puts adder.call(5, 7)
```

```ruby-exec:practice9_1.rb
12
```

### 練習問題2: & を使ったメソッド
数値の配列 `numbers` と、`Proc` オブジェクト `processor` を引数として受け取る `apply_proc_to_array` メソッドを定義してください。メソッド内では、配列の各要素に対して `processor` を実行し、その結果を標準出力に出力するようにしてください。
（ヒント: メソッド呼び出し側では `&` を使って `Proc` をブロックとして渡すか、メソッド定義側で `&` を使ってブロックを受け取るか、両方の方法が考えられます。ここでは `Proc` オブジェクトをそのまま引数として受け取り、`call` で実行してみてください。）

```ruby:practice9_2.rb

```

```ruby-exec:practice9_2.rb
```

