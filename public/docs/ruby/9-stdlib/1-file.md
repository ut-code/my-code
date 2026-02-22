---
id: ruby-stdlib-1-file
title: Fileクラスによる読み書き
level: 3
---

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
