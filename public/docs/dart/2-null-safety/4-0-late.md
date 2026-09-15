---
id: dart-null-safety-late
title: late 修飾子の仕組みと使いどころ
level: 2
question:
  - late修飾子を付けると何が変わりますか？
  - late変数を初期化前に参照するとどうなりますか？
term:
  - late
  - late修飾子
---

## `late` 修飾子の仕組みと使いどころ

**`late` 修飾子** は、Non-nullableな変数の初期化を「宣言時ではなく、後から（あるいは必要になった時に）行う」ことをコンパイラに宣言するキーワードです。

宣言時点では値が決まらないNon-nullable変数の保持や、重い計算の遅延評価に利用されます。
