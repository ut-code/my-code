---
id: rust-modules-4-use
title: use キーワードとパス
level: 2
---

## use キーワードとパス

モジュールの階層が深くなると、毎回 `restaurant::front_of_house::add_to_waitlist()` のようにフルパスを書くのは面倒です。
`use` キーワードを使うと、パスをスコープに持ち込み、短い名前で呼び出せるようになります。これは他言語の `import` に相当します。
