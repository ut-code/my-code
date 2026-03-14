---
id: ruby-modules-include-extend
title: include vs extend
level: 2
question:
  - '`include` と `extend` は、それぞれどのような場合に使い分けるべきですか。'
  - インスタンスメソッドとクラスメソッドの違いを改めて説明してください。
  - '`IncludedClass.info` がエラーになるのはなぜですか。'
  - '`obj2.info` がエラーになるのはなぜですか。'
---

## `include` vs `extend`

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
