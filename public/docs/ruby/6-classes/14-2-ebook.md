---
id: ruby-classes-14-2-ebook
title: '練習問題2: 継承を使った EBook クラスの作成'
level: 3
---

### 練習問題2: 継承を使った `EBook` クラスの作成

問題1で作成した `Book` クラスを継承して、以下の仕様を持つ `EBook`（電子書籍）クラスを作成してください。

1.  `initialize` で `title`, `author`, `file_size`（ファイルサイズ, 例: "10MB"）を受け取る。
2.  `title` と `author` の初期化は、`Book` クラスの `initialize` を利用する (`super` を使う)。
3.  `file_size` は外部から読み取り可能にする。
4.  `info` メソッドをオーバーライドし、`"タイトル: [title], 著者: [author] (ファイルサイズ: [file_size])"` という形式の文字列を返す。
      * ヒント: 親クラスの `info` メソッドの結果を `super` で利用すると効率的です。

```ruby:practice7_2.rb
require './practice7_1.rb'  # 7_1のコードを実行してBookの定義を読み込みます

# ここにEBookクラスの定義を書いてください

ebook = EBook.new("実践Ruby", "Tanaka", "2.5MB")
puts ebook.info
puts ebook.title
```

```ruby-exec:practice7_2.rb
タイトル: 実践Ruby, 著者: Tanaka (ファイルサイズ: 2.5MB)
実践Ruby
```
