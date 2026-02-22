---
id: ruby-proc-lambda-2-return
title: 1. return の挙動
level: 3
---

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
