---
id: ruby-modules-namespace
title: 名前空間としてのモジュール
level: 2
question:
  - スコープ解決演算子 `::` は何のために使うのですか。
  - '`module AppUtilities` の中に定数、クラス、メソッドがありますが、これらを全てモジュールに入れる意味は何ですか。'
  - '`VERSION = "1.0.0"` のように定数を大文字で定義するのはなぜですか。'
  - '`def self.default_message` の `self.` は何のために必要なのですか。'
  - モジュール内のクラスと通常のクラスの違いは何ですか。
  - モジュールを定義しただけでは何も実行されないのですか。
---

## 名前空間としてのモジュール

プログラムが大規模になると、異なる目的で同じ名前のクラス（例: `Database::User` と `WebApp::User`）を使いたくなることがあります。モジュールは、これらを区別するための「仕切り」として機能します。

名前空間内の要素には、`::` (スコープ解決演算子) を使ってアクセスします。

```ruby:module_example.rb
module AppUtilities
  VERSION = "1.0.0"
  
  class Logger
    def log(msg)
      puts "[App log] #{msg}"
    end
  end
  
  # モジュールメソッド (self. をつける)
  def self.default_message
    "Hello from Utility"
  end
end

# 定数へのアクセス
puts AppUtilities::VERSION

# モジュールメソッドの呼び出し
puts AppUtilities.default_message

# モジュール内のクラスのインスタンス化
logger = AppUtilities::Logger.new
logger.log("Initialized.")
```

```ruby-exec:module_example.rb
1.0.0
Hello from Utility
[App log] Initialized.
```
