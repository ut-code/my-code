---
id: ruby-control-methods-3-case
title: case
level: 3
---

### case

C言語やJavaの `switch` 文に似ていますが、より強力です。`when` 節では、複数の値、範囲（Range）、正規表現、さらにはクラスを指定することもできます。`break` は不要です。

```ruby:case_example.rb
def analyze_input(input)
  puts "Input: #{input.inspect}"
  result = case input
           when 0
             "ゼロ"
           when 1..9
             "一桁の数字"
           when "admin", "guest"
             "特定のユーザー"
           when String
             "その他の文字列"
           when /Error/
             "エラーメッセージ"
           else
             "不明な型"
           end
  puts "Result: #{result}"
end

analyze_input(5)
analyze_input("guest")
analyze_input("Some value")
analyze_input(nil)
```

```ruby-exec:case_example.rb
Input: 5
Result: 一桁の数字
Input: "guest"
Result: 特定のユーザー
Input: "Some value"
Result: その他の文字列
Input: nil
Result: 不明な型
```
