---
id: dart-null-safety-types
title: Nullable型（?）とNon-nullable型
level: 2
question:
  - デフォルトで変数がNull非許容（Non-nullable）であるメリットは何ですか？
  - Nullableな変数はどのように宣言しますか？
  - if文でnullチェックした後は自動的にNon-nullableとして扱われますか？
term:
  - Null Safety
  - null safety
  - ヌル安全
  - Nullable
  - Non-nullable
  - null
---

## Nullable型（`?`）とNon-nullable型

[[Dart]]の型システムでは、すべての型がデフォルトで **[[Non-nullable]]（Null非許容）** です。

値として `null` を許可したい場合のみ、型の後ろに `?` を付けて **[[Nullable]]（Null許容）** として明示的に宣言します。

```dart:nullable_basics.dart
void main() {
  // 1. Non-nullable型 (デフォルト): null を代入できない
  String nonNullableText = 'Hello';
  // nonNullableText = null; // コンパイルエラー!

  // 2. Nullable型 (末尾に ? を付与): null を代入できる
  String? nullableText = 'Hello';
  nullableText = null; // OK

  print('nonNullableText: $nonNullableText');
  print('nullableText: $nullableText');
}
```

```dart-exec:nullable_basics.dart
nonNullableText: Hello
nullableText: null
```

### 型プロモーション（スマートキャスト）

Nullableな変数であっても、`if` 文などで `null` でないことをチェック（フロー解析）すると、そのスコープ内では自動的にNon-nullable型へと昇格（プロモート）します。

```dart:flow_analysis.dart
void printLength(String? text) {
  if (text != null) {
    // このブロック内では text は String? ではなく String として扱われる
    print('文字数: ${text.length}');
  } else {
    print('テキストは null です');
  }
}

void main() {
  printLength('Dart Flutter');
  printLength(null);
}
```

```dart-exec:flow_analysis.dart
文字数: 12
テキストは null です
```
