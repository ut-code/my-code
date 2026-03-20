---
id: ruby-everything-object-string
title: String (文字列)
level: 3
question:
  - Stringクラスでよく使うメソッドは他にどんなものがありますか？
  - .stripや.capitalizeは元の文字列を変更するのですか？それとも新しい文字列を返すのですか？
  - gsubとsubの違いは何ですか？
  - .start_with?メソッドの疑問符にはどんな意味があるのですか？
  - pメソッドはputsメソッドとどう違うのですか？
---

### String (文字列)

`String` クラスには、テキスト操作のための豊富なメソッドが用意されています。

```ruby:string_methods.rb
text = " ruby is convenient "

# 先頭と末尾の空白を除去
cleaned_text = text.strip
puts "Strip: '#{cleaned_text}'"

# 先頭の文字を大文字に
puts "Capitalize: #{cleaned_text.capitalize}"

# "convenient" を "powerful" に置換
puts "Gsub: #{cleaned_text.gsub("convenient", "powerful")}"

# "ruby" という文字列で始まっているか？
puts "Start with 'ruby'?: #{cleaned_text.start_with?("ruby")}"

# 単語に分割 (配列が返る)
words = cleaned_text.split(" ")
p words # p はデバッグ用の表示メソッド
```

```ruby-exec:string_methods.rb
Strip: 'ruby is convenient'
Capitalize: Ruby is convenient
Gsub: ruby is powerful
Start with 'ruby'?: true
["ruby", "is", "convenient"]
```
