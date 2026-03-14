---
id: ruby-basics-nil-false
title: 🚫 重要： nil と false の扱い
level: 2
question:
  - '`false` と `nil` だけが偽 (falsey) として扱われるのは、なぜ重要なのでしょうか。'
  - '`0` や空文字列 `""` が真 (truthy) として扱われると、プログラミングでどのような問題が起こりやすいですか。'
  - 他の言語経験者にとってつまずきやすいとありますが、具体的なコード例でその違いを教えてもらえますか。
  - '`if value` の `value` にどのような値が入ると真になり、どのような値が入ると偽になりますか。'
---

## 🚫 重要： nil と false の扱い

Rubyの条件分岐（`if`文など）において、**偽 (falsey) として扱われるのは `nil` と `false` の2つだけ**です。

これは非常に重要です。C言語やJavaScriptなどの `0`、空文字列 `""`、空配列 `[]` が偽として扱われる言語とは異なります。Rubyでは、これらはすべて**真 (truthy)** として扱われます。

```ruby:truthy_check.rb
def check_truthy(label, value)
  if value
    puts "[#{label}] は真 (truthy) です。"
  else
    puts "[#{label}] は偽 (falsey) です。"
  end
end

check_truthy("false", false)
check_truthy("nil", nil)
puts "---"
check_truthy("true", true)
check_truthy("0 (Integer)", 0)
check_truthy("1 (Integer)", 1)
check_truthy("空文字列 \"\"", "")
check_truthy("文字列 \"abc\"", "abc")
check_truthy("空配列 []", [])
check_truthy("空ハッシュ {}", {})
```

```ruby-exec:truthy_check.rb
[false] は偽 (falsey) です。
[nil] は偽 (falsey) です。
---
[true] は真 (truthy) です。
[0 (Integer)] は真 (truthy) です。
[1 (Integer)] は真 (truthy) です。
[空文字列 ""] は真 (truthy) です。
[文字列 "abc"] は真 (truthy) です。
[空配列 []] は真 (truthy) です。
[空ハッシュ {}] は真 (truthy) です。
```
