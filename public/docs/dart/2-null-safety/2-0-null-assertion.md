---
id: dart-null-safety-assertion
title: Nullアサーション（!）とその危険性
level: 2
question:
  - Nullアサーション演算子 (!) はどのような時に使うべきですか？
  - ! を付けた変数が実際に null だった場合何が起こりますか？
term:
  - Nullアサーション
  - '!演算子'
  - 実行時例外
---

## Nullアサーション（`!`）とその危険性

**[[Nullアサーション]]演算子（`!`）** は、コンパイラに対して「この値はNullable型だが、実行時には絶対に `null` ではないとプログラマが保証する」と伝える演算子です。

```dart:null_assertion.dart
void main() {
  String? maybeName = 'Alice';

  // ! を付けることで String 型として強制的に扱う
  String definiteName = maybeName!;
  print('名前: $definiteName');
}
```

```dart-exec:null_assertion.dart
名前: Alice
```

もし値が `null` であるにもかかわらず `!` を適用した場合、実行時に `TypeError` 例外が発生してプログラムがクラッシュします。

> [!CAUTION]
> `!` 演算子は安易に使わず、基本的には後述する **[[Null認識演算子]]** や明示的な `null` チェックを優先しましょう。
