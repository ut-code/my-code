---
id: ruby-classes-13-1-book
title: '練習問題1: Book クラスの作成'
level: 3
---

### 練習問題1: `Book` クラスの作成

以下の仕様を持つ `Book` クラスを作成してください。

1.  `initialize` で `title`（タイトル）と `author`（著者）を受け取る。
2.  `title` と `author` は、インスタンス変数（`@title`, `@author`）に格納する。
3.  `title` と `author` は、どちらも外部から読み取り可能（書き換えは不可）にする。
4.  `info` というインスタンスメソッドを持ち、`"タイトル: [title], 著者: [author]"` という形式の文字列を返す。

```ruby:practice7_1.rb
# ここにBookクラスの定義を書いてください


book = Book.new("Ruby入門", "Sato")
puts book.info
puts book.title
# book.title = "改訂版" #=> エラー (NoMethodError) になるはず
```

```ruby-exec:practice7_1.rb
(実行結果例)
タイトル: Ruby入門, 著者: Sato
Ruby入門
```
