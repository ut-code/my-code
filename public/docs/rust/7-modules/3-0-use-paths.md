---
id: rust-modules-use-paths
title: use キーワードとパス
level: 2
question:
  - '`use`キーワードは、他の言語の`import`や`include`と同じものと考えて良いですか？'
  - フルパスを書くのが面倒なのは分かりますが、`use`を使うとどんなデメリットがありますか？
  - 関数を持ち込むときに親モジュールまでを`use`する慣習は、なぜ存在するのですか？
---

## use キーワードとパス

モジュールの階層が深くなると、毎回 `restaurant::front_of_house::add_to_waitlist()` のようにフルパスを書くのは面倒です。
`use` キーワードを使うと、パスをスコープに持ち込み、短い名前で呼び出せるようになります。これは他言語の `import` に相当します。
