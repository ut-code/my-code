---
id: ruby-proc-lambda-5-proc
title: 1. ブロックを Proc として受け取る
level: 3
---

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
