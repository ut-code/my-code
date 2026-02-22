---
id: ruby-stdlib-2-dirpathname
title: DirクラスとPathname
level: 3
---

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
