---
id: ruby-methods-keyword-arg
title: キーワード引数
level: 3
question:
  - キーワード引数が可読性を向上させるとは、具体的にどういうことですか？
  - キーワード引数と通常の引数を混ぜる場合、順序はどうなりますか？
  - 必須のキーワード引数とデフォルト値を持つキーワード引数の違いは何ですか？
---

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
