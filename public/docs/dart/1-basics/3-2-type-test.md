---
id: dart-basics-type-test
title: 型テスト演算子と三項条件演算子
level: 3
question:
  - is や is! 演算子は何のために使われますか？
  - 型テストを行った後に自動でキャストされる仕組み（スマートキャスト）とは？
term:
  - 型テスト演算子
  - 'is'
  - 'is!'
  - 三項演算子
  - スマートキャスト
---

### 型テスト演算子と三項条件演算子

オブジェクトが特定の型であるかを判定するには、`is` や `is!` を使います。

* `is`: 指定した型であれば `true`（スコープ内で自動的にスマートキャストされる）
* `is!`: 指定した型でなければ `true`

```dart:type_test.dart
void main() {
  Object value = 'Dart Programming';

  if (value is String) {
    // ifスコープ内では value が String にスマートキャストされる
    print('文字列の長さ: ${value.length}');
  }

  // 三項条件演算子
  int score = 85;
  String result = score >= 60 ? '合格' : '不合格';
  print('判定: $result');
}
```

```dart-exec:type_test.dart
文字列の長さ: 16
判定: 合格
```
