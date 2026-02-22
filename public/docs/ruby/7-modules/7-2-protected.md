---
id: ruby-modules-7-2-protected
title: '練習問題2: protected を使った比較'
level: 3
---

### 練習問題2: protected を使った比較

`protected` のユースケースを理解するための問題です。

1.  `Score` クラスを作成します。`initialize` で `@value` （得点）をインスタンス変数として保持します。
2.  `higher_than?(other_score)` という `public` なインスタンスメソッドを定義してください。これは、`other_score` （`Score` の別のインスタンス）より自分の `@value` が高ければ `true` を返します。
3.  `higher_than?` メソッドの実装のために、`value` という `protected` メソッドを作成し、`@value` を返すようにしてください。
4.  `higher_than?` の内部では、`self.value > other_score.value` のように `protected` メソッドを呼び出してください。
5.  2つの `Score` インスタンスを作成し、`higher_than?` が正しく動作することを確認してください。また、`protected` メソッドである `value` をインスタンスの外部から直接呼び出そうとするとエラーになることも示してください。

```ruby:practice8_2.rb
class Score

end


```

```ruby-exec:practice8_2.rb
```
