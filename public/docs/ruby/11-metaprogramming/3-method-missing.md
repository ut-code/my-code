---
id: ruby-metaprogramming-3-method-missing
title: 'method_missing: 存在しないメソッドへの応答'
level: 2
---

## method\_missing: 存在しないメソッドへの応答

オブジェクトに対して定義されていないメソッドが呼び出されると、Rubyは例外（`NoMethodError`）を発生させる前に、`method_missing` という特別なメソッドを呼び出そうと試みます。

この `method_missing` を自分でオーバーライドすることで、定義されていないメソッド呼び出しを「キャッチ」し、動的に処理できます。

`method_missing` は以下の引数を受け取ります。

1.  呼び出されようとしたメソッド名（シンボル）
2.  そのメソッドに渡された引数（配列）
3.  そのメソッドに渡されたブロック（存在する場合）

```ruby:ghost_methods.rb
class DynamicLogger
  def method_missing(method_name, *args, &block)
    # 呼び出されたメソッド名が 'log_' で始まるかチェック
    if method_name.to_s.start_with?("log_")
      # 'log_' の部分を取り除いてレベル名とする
      level = method_name.to_s.delete_prefix("log_")
      
      # メッセージ（引数）を取得
      message = args.first || "(no message)"
      
      puts "[#{level.upcase}] #{message}"
    else
      # 関係ないメソッド呼び出しは、通常通り NoMethodError を発生させる
      super
    end
  end

  # respond_to? が正しく動作するように、respond_to_missing? も定義するのがベストプラクティス
  def respond_to_missing?(method_name, include_private = false)
    method_name.to_s.start_with?("log_") || super
  end
end

logger = DynamicLogger.new

logger.log_info("Application started.")
logger.log_warning("Cache is empty.")
logger.log_error("File not found.")

# respond_to? の動作確認
puts "Responds to log_info? #{logger.respond_to?(:log_info)}"
puts "Responds to undefined_method? #{logger.respond_to?(:undefined_method)}"

# 存在しないメソッド（super呼び出し）
# logger.undefined_method # => NoMethodError
```

```ruby-exec:ghost_methods.rb
[INFO] Application started.
[WARNING] Cache is empty.
[ERROR] File not found.
Responds to log_info? true
Responds to undefined_method? false
```
