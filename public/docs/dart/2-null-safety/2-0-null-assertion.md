---
id: dart-null-safety-assertion
title: Nullアサーション（!）とその危険性
level: 2
question:
  - Nullアサーション演算子 (!) はどのような時に使うべきですか？
  - ! を付けた変数が実際に null だった場合何が起こりますか？
  - なぜ可能な限り ! を避けるべきなのですか？
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

  // maybeName は String? 型だが、! を付けることで String 型として扱える
  String definiteName = maybeName!;
  print('名前: $definiteName');
}
```

```dart-exec:null_assertion.dart
名前: Alice
```

### `!` の危険性: 実行時例外の発生

もし値が `null` であるにもかかわらず `!` を適用した場合、コンパイルは通過しますが、実行時に `TypeError` / `Null check operator used on a null value` 例外が発生してプログラムが強制終了します。

```dart
String? maybeNull;
// String forced = maybeNull!; // 実行時クラッシュ!
```

> [!CAUTION]
> `!` 演算子は、型推論やフロー解析が及ばない特定の場面（外部ライブラリとの連携など）を除き、安易に使うべきではありません。基本的には後述する **[[Null認識演算子]]** や明示的な `null` チェックを優先しましょう。
