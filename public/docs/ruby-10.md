# 第10章: 標準ライブラリの活用

Rubyの強力な点の一つは、多くの一般的なタスクを処理するための豊富な「標準ライブラリ」が同梱されていることです。これらは "batteries included"（電池付属）とよく表現されます。

他の言語で `import` や `include` を使うのと同様に、Rubyでは `require` を使ってこれらのライブラリをロードします。ただし、`File` や `Time`、`Regexp` のようなコア機能の多くは、`require` なしで利用可能です。

この章では、特に使用頻度の高い標準ライブラリの機能を見ていきます。

## ファイル操作 (File, Dir, Pathname)

ファイルシステムとのやり取りは、多くのアプリケーションで不可欠です。

### Fileクラスによる読み書き

`File` クラスは、ファイルに対する基本的な読み書き操作を提供します。

**ファイルの書き込みと追記:**

```ruby:file_io_example.rb
# 1. ファイルへの書き込み (上書き)
# シンプルな方法は File.write です
File.write('sample.txt', "Hello, Ruby Standard Library!\n")

# 2. ファイルへの追記
# mode: 'a' (append) オプションを指定します
File.write('sample.txt', "This is a second line.\n", mode: 'a')

puts "File 'sample.txt' created and updated."
```

```ruby-exec:file_io_example.rb
File 'sample.txt' created and updated.
```

```text-readonly:sample.txt
```

**ファイルの読み込み:**

```ruby:file_read_example.rb
# 'sample.txt' が存在すると仮定

# 1. ファイル全体を一度に読み込む
content = File.read('sample.txt')
puts "--- Reading all at once ---"
puts content

# 2. 1行ずつ処理する (大きなファイルに効率的)
puts "\n--- Reading line by line ---"
File.foreach('sample.txt') do |line|
  print "Line: #{line}"
end

# 3. 処理後にファイルをクリーンアップ
File.delete('sample.txt')
puts "\n\nFile 'sample.txt' deleted."
```

```ruby-exec:file_read_example.rb
--- Reading all at once ---
Hello, Ruby Standard Library!
This is a second line.

--- Reading line by line ---
Line: Hello, Ruby Standard Library!
Line: This is a second line.

File 'sample.txt' deleted.
```

### DirクラスとPathname

`Dir` クラスはディレクトリの内容を操作するために使われます。特に `Dir.glob` はワイルドカードを使ってファイルやディレクトリを検索するのに便利です。

しかし、パスの連結や解析を文字列として扱うのは面倒です。`Pathname` ライブラリは、パスをオブジェクトとして扱うための優れたインターフェースを提供します。

```ruby-repl:1
irb(main):001:0> # Dir.glob はワイルドカードでファイルリストを取得できます
irb(main):002:0> Dir.glob('*.rb') # (irbを実行しているディレクトリによります)
=> [] 

irb(main):003:0> # Pathname を使うには require が必要
irb(main):004:0> require 'pathname'
=> true

irb(main):005:0> # 文字列の代わりに Pathname オブジェクトを作成
irb(main):006:0> base_path = Pathname.new('/usr/local')
=> #<Pathname:/usr/local>

irb(main):007:0> # + や / 演算子で安全にパスを連結できます
irb(main):008:0> lib_path = base_path + 'lib'
=> #<Pathname:/usr/local/lib>
irb(main):009:0> bin_path = base_path / 'bin'
=> #<Pathname:/usr/local/bin>

irb(main):010:0> # パスの解析
irb(main):011:0> file_path = Pathname.new('/var/log/app.log')
=> #<Pathname:/var/log/app.log>
irb(main):012:0> file_path.basename  # ファイル名
=> #<Pathname:app.log>
irb(main):013:0> file_path.extname   # 拡張子
=> ".log"
irb(main):014:0> file_path.dirname   # 親ディレクトリ
=> #<Pathname:/var/log>
irb(main):015:0> file_path.absolute? # 絶対パスか？
=> true
```

## 日付と時刻 (Time, Date)

Rubyには `Time`（組み込み）と `Date`（要 `require`）の2つの主要な日時クラスがあります。

  * **Time:** 時刻（タイムスタンプ）をナノ秒までの精度で扱います。
  * **Date:** 日付（年月日）のみを扱い、カレンダー計算に特化しています。

```ruby-repl:2
irb(main):001:0> # Time (組み込み)
irb(main):002:0> now = Time.now
=> 2025-11-04 11:32:00 +0900 (JST)
irb(main):003:0> now.year
=> 2025
irb(main):004:0> now.monday?
=> false
irb(main):005:0> now.to_i # UNIXタイムスタンプ
=> 1762309920

irb(main):006:0> # strftime (string format time) でフォーマット
irb(main):007:0> now.strftime("%Y-%m-%d %H:%M:%S")
=> "2025-11-04 11:32:00"

irb(main):008:0> # Date (require が必要)
irb(main):009:0> require 'date'
=> true
irb(main):010:0> today = Date.today
=> #<Date: 2025-11-04 ((2461014j,0s,0n),+0s,2299161j)>
irb(main):011:0> today.strftime("%A") # 曜日
=> "Tuesday"

irb(main):012:0> # 文字列からのパース
irb(main):013:0> christmas = Date.parse("2025-12-25")
=> #<Date: 2025-12-25 ((2461065j,0s,0n),+0s,2299161j)>
irb(main):014:0> (christmas - today).to_i # あと何日？
=> 51
```

## JSONのパースと生成 (json)

現代のWeb開発においてJSONの扱いは不可欠です。`json` ライブラリは、JSON文字列とRubyのHash/Arrayを相互に変換する機能を提供します。

```ruby-repl:3
irb(main):001:0> require 'json'
=> true

irb(main):002:0> # 1. JSON文字列 -> Rubyオブジェクト (Hash) へのパース
irb(main):003:0> json_data = '{"user_id": 123, "name": "Alice", "tags": ["admin", "ruby"]}'
=> "{\"user_id\": 123, \"name\": \"Alice\", \"tags\": [\"admin\", \"ruby\"]}"

irb(main):004:0> parsed_data = JSON.parse(json_data)
=> {"user_id"=>123, "name"=>"Alice", "tags"=>["admin", "ruby"]}
irb(main):005:0> parsed_data['name']
=> "Alice"
irb(main):006:0> parsed_data['tags']
=> ["admin", "ruby"]

irb(main):007:0> # 2. Rubyオブジェクト (Hash) -> JSON文字列 への生成
irb(main):008:0> ruby_hash = {
irb(main):009:1* status: "ok",
irb(main):010:1* data: { item_id: 987, price: 1500 }
irb(main):011:1* }
=> {:status=>"ok", :data=>{:item_id=>987, :price=>1500}}

irb(main):012:0> # .to_json メソッドが便利です
irb(main):013:0> json_output = ruby_hash.to_json
=> "{\"status\":\"ok\",\"data\":{\"item_id\":987,\"price\":1500}}"

irb(main):014:0> # 人が読みやすいように整形 (pretty generate)
irb(main):015:0> puts JSON.pretty_generate(ruby_hash)
{
  "status": "ok",
  "data": {
    "item_id": 987,
    "price": 1500
  }
}
=> nil
```

## 正規表現 (Regexp) と match

Rubyの正規表現 (Regexp) は、Perl互換の強力なパターンマッチング機能を提供します。`/pattern/` リテラルで記述するのが一般的です。

### マッチの確認 (`=~` と `match`)

  * `=~` 演算子: マッチした位置のインデックス（0から始まる）を返すか、マッチしなければ `nil` を返します。
  * `String#match`: `MatchData` オブジェクトを返すか、マッチしなければ `nil` を返します。`MatchData` は、キャプチャグループ（`()`で囲んだ部分）へのアクセスに便利です。

```ruby-repl:4
irb(main):001:0> text = "User: alice@example.com (Alice Smith)"
=> "User: alice@example.com (Alice Smith)"

irb(main):002:0> # =~ は位置を返す
irb(main):003:0> text =~ /alice/
=> 6
irb(main):004:0> text =~ /bob/
=> nil

irb(main):005:0> # String#match は MatchData を返す
irb(main):006:0> # パターン: (ユーザー名)@(ドメイン)
irb(main):007:0> match_data = text.match(/(\w+)@([\w\.]+)/)
=> #<MatchData "alice@example.com" 1:"alice" 2:"example.com">

irb(main):008:0> # マッチしたオブジェクトからキャプチャを取得
irb(main):009:0> match_data[0] # マッチ全体
=> "alice@example.com"
irb(main):010:0> match_data[1] # 1番目の ()
=> "alice"
irb(main):011:0> match_data[2] # 2番目の ()
=> "example.com"
```

### 検索と置換 (`scan` と `gsub`)

  * `String#scan`: マッチするすべての部分文字列を（キャプチャグループがあればその配列として）返します。
  * `String#gsub`: マッチするすべての部分を置換します (Global SUBstitute)。

```ruby-repl:5
irb(main):001:0> log = "ERROR: code 500. WARNING: code 404. ERROR: code 403."
=> "ERROR: code 500. WARNING: code 404. ERROR: code 403."

irb(main):002:0> # scan: 'ERROR: code (数字)' にマッチする部分をすべて探す
irb(main):003:0> log.scan(/ERROR: code (\d+)/)
=> [["500"], ["403"]]

irb(main):004:0> # gsub: 'ERROR' を 'CRITICAL' に置換する
irb(main):005:0> log.gsub("ERROR", "CRITICAL")
=> "CRITICAL: code 500. WARNING: code 404. CRITICAL: code 403."

irb(main):006:0> # gsub はブロックと正規表現を組み合わせて高度な置換が可能
irb(main):007:0> # 数字（コード）を [] で囲む
irb(main):008:0> log.gsub(/code (\d+)/) do |match|
irb(main):009:1* # $1 は最後のマッチの1番目のキャプチャグループ
irb(main):010:1* "code [#{$1}]"
irb(main):011:1> end
=> "ERROR: code [500]. WARNING: code [404]. ERROR: code [403]."
```

## この章のまとめ

  * Rubyには、`require` でロードできる豊富な**標準ライブラリ**が付属しています。
  * **File**クラスはファイルの読み書きを、**Pathname**はパス操作をオブジェクト指向的に行います。
  * **Time**は時刻を、**Date**は日付を扱います。`strftime` でフォーマットできます。
  * **json**ライブラリは `JSON.parse`（文字列→Hash）と `to_json`（Hash→文字列）を提供します。
  * **Regexp**（`/pattern/`）はパターンマッチングに使います。`String#match` で `MatchData` を取得し、`scan` や `gsub` で検索・置換を行います。

これらは標準ライブラリのごく一部です。他にもCSVの処理 (`csv`)、HTTP通信 (`net/http`)、テスト (`minitest`) など、多くの機能が提供されています。

### 練習問題1: JSON設定ファイルの読み書き

1.  `config.json` ファイルを読み込み、内容をJSONパースしてRubyのHashに変換してください。
2.  そのHashの `logging` の値を `true` に変更し、さらに `:updated_at` というキーで現在時刻（文字列）を追加してください。
3.  変更後のHashをJSON文字列に変換し、`config_updated.json` という名前でファイルに保存してください。（読みやすさのために `JSON.pretty_generate` を使っても構いません）

```json-readonly:config.json
{"app_name": "RubyApp", "version": "1.0", "logging": false}
```

```ruby:practice10_1.rb
```

```ruby-exec:practice10_1.rb
```

```json-readonly:config_updated.json
```

### 練習問題2: ログファイルからの情報抽出

1.  `system.log` というファイルを1行ずつ読み込みます。
2.  正規表現を使い、`[INFO]` で始まり、かつ `logged in` という文字列を含む行だけを検出してください。
3.  マッチした行から、IPアドレス（`192.168.1.10` のような形式）を正規表現のキャプチャグループを使って抽出し、IPアドレスだけをコンソールに出力してください。

```text-readonly:system.log
[INFO] 2025-11-04 User 'admin' logged in from 192.168.1.10
[WARN] 2025-11-04 Failed login attempt for user 'guest'
[INFO] 2025-11-04 Service 'payment_gateway' started.
```

```ruby:practice10_2.rb
```

```ruby-exec:practice10_2.rb
```
