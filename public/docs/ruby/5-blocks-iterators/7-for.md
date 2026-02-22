---
id: ruby-blocks-iterators-7-for
title: for ループとの比較
level: 2
---

## for ループとの比較

他言語経験者の方は、`for` ループを使いたくなるかもしれません。

```c
// C や Java の for ループ
for (int i = 0; i < 3; i++) {
    printf("Hello\n");
}
```

Rubyにも `for` 構文は存在します。

```ruby-repl:7
irb(main):014:0> numbers = [1, 2, 3]
=> [1, 2, 3]

irb(main):015:0> for num in numbers
irb(main):016:1* puts num
irb(main):017:1> end
1
2
3
=> [1, 2, 3]
```

しかし、Rubyの世界では `for` ループは**ほとんど使われません**。なぜなら、`for` は内部的に `each` メソッドを呼び出しているに過ぎないからです。

Rubyプログラマは、`for` よりも `each` などのイテレータをブロックと共に使うことを圧倒的に好みます。イテレータの方が、何をしているか（単なる繰り返し、変換、選択など）がメソッド名 (`each`, `map`, `select`) から明確であり、コードが読みやすくなるためです。
