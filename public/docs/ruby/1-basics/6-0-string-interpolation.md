---
id: ruby-basics-string-interpolation
title: 📜 文字列操作と式展開
level: 2
---

## 📜 文字列操作と式展開

Rubyの文字列は強力で、特に「式展開」は頻繁に使われます。

  * **シングルクォート (`'...'`)**: ほぼそのまま文字列として扱います。`\n`（改行）などのエスケープシーケンスや式展開は解釈**されません**（`\'` と `\\` を除く）。
  * **ダブルクォート (`"..."`)**: エスケープシーケンス（`\n`, `\t` など）を解釈し、**式展開 (Interpolation)** を行います。

式展開は `#{...}` という構文を使い、`...` の部分でRubyのコードを実行し、その結果を文字列に埋め込みます。

```ruby-repl
irb(main):001> name = "Alice"
=> "Alice"
irb(main):002> puts 'Hello, #{name}\nWelcome!'  # シングルクォート
Hello, #{name}\nWelcome!
=> nil
irb(main):003> puts "Hello, #{name}\nWelcome!"  # ダブルクォート
Hello, Alice
Welcome!
=> nil
irb(main):004> puts "1 + 2 = #{1 + 2}"  # 式展開内では計算も可能
1 + 2 = 3
=> nil
irb(main):005> "Ruby" + " " + "Rocks"  # 文字列の連結と繰り返し
=> "Ruby Rocks"
irb(main):006> "Go! " * 3
=> "Go! Go! Go! "
```
