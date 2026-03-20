---
id: ruby-metaprogramming-practice2
title: '練習問題2: シンプルな設定オブジェクト'
level: 3
question:
  - ハッシュのように動作するとは、具体的にどのような振る舞いをさせたいのですか。
  - '`config.api_key = "12345"`のように値を設定する部分をmethod_missingでどのように実装しますか。'
  - '`config.api_key`で値を取得する部分をmethod_missingでどのように実装しますか。'
  - 設定されていないキーを呼び出した場合にnilを返すにはどうすれば良いですか。
  - respond_to_missing?を`true`にするのはなぜですか。
---

### 練習問題2: シンプルな設定オブジェクト

`method_missing` を使って、ハッシュのように動作する `SimpleConfig` クラスを作成してください。`config.api_key = "12345"` のように値を設定でき、`config.api_key` で値を取得できるようにしてください。設定されていないキーを呼び出した場合は `nil` を返すようにします。

```ruby:practice12_2.rb
class SimpleConfig
  def initialize
    @settings = {}
  end

  def method_missing(method_name, *args, &block)
    # ここにコードを書いてください


  end

  def respond_to_missing?(method_name, include_private = false)
    true
  end
end

config = SimpleConfig.new
config.api_key = "12345"
puts "API Key: #{config.api_key.inspect}"
puts "Timeout: #{config.timeout.inspect}" # 設定されていないキー
```

```ruby-exec:practice12_2.rb
API Key: "12345"
Timeout: nil
```
