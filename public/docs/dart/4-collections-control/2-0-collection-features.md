---
id: dart-collections-features
title: コレクション if、for とスプレッド演算子
level: 2
question:
  - コレクション if と三項演算子の違いは何ですか？
  - スプレッド演算子 (...) と Null認識スプレッド演算子 (...?) の使い分けは何ですか？
  - コレクション for を使うとどのようなコードが簡潔になりますか？
term:
  - コレクションif
  - コレクションfor
  - スプレッド演算子
  - '...'
  - '...?'
---

## コレクション `if`、`for` とスプレッド演算子

[[Dart]]のコレクションリテラル内では、要素の生成ロジックとして `if`、`for`、スプレッド演算子を直接埋め込むことができます。

### 1. コレクション `if`

条件が `true` の場合のみ要素をコレクションに含めます。

```dart:collection_if.dart
void main() {
  bool isAdmin = true;
  bool isGuest = false;

  var navItems = [
    'ホーム',
    'プロフィール',
    if (isAdmin) '管理者パネル',
    if (isGuest) 'ログイン案内',
  ];

  print(navItems);
}
```

```dart-exec:collection_if.dart
[ホーム, プロフィール, 管理者パネル]
```

### 2. コレクション `for`

ループを使って複数の要素を動的に展開してコレクションを構築します。

```dart:collection_for.dart
void main() {
  var numbers = [1, 2, 3];
  var stringList = [
    '#0',
    for (var n in numbers) '#$n',
  ];

  print(stringList);
}
```

```dart-exec:collection_for.dart
[#0, #1, #2, #3]
```

### 3. スプレッド演算子 (`...` / `...?`)

既存のコレクションの全要素を別のコレクション内に展開して埋め込みます。対象が `null` になり得る場合は **`...?`（Null認識スプレッド演算子）** を使用します。

```dart:spread_operator.dart
void main() {
  var baseList = [1, 2];
  List<int>? extraList; // null

  var combined = [
    0,
    ...baseList,
    ...?extraList, // null なので展開を安全にスキップ
    3,
  ];

  print(combined);
}
```

```dart-exec:spread_operator.dart
[0, 1, 2, 3]
```
