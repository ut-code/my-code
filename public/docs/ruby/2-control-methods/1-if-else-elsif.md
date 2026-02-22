---
id: ruby-control-methods-1-if-else-elsif
title: if, else, elsif
level: 3
---

### if, else, elsif

基本的な構文は他言語と同様ですが、`else if`は `elsif`（`e`が1つ）と綴る点に注意してください。

`if`は値を返すため、結果を変数に代入できます。

```ruby-repl:1
irb(main):001:0> score = 85
=> 85
irb(main):002:0> grade = if score > 90
irb(main):003:1* "A"
irb(main):004:1* elsif score > 80 # "else if" ではない
irb(main):005:1* "B"
irb(main):006:1* else
irb(main):007:1* "C"
irb(main):008:1* end
=> "B"
irb(main):009:0> puts "あなたの成績は#{grade}です"
あなたの成績はBです
=> nil
```
