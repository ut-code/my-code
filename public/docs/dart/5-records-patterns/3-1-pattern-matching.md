---
id: dart-patterns-matching-complex
title: 網羅性チェックと複雑なパターンマッチング
level: 3
question:
  - switch式の中で型判定と変数のバインドを同時に行う方法は？
  - 論理演算子パターン（&& や ||）の使い方は？
term:
  - 型パターン
  - 論理パターン
---

### 網羅性チェックと複雑なパターンマッチング

`switch` 式の中でデータの型や形状を検証しながら変数を取り出すことができます。

```dart:pattern_matching_complex.dart
String formatData(dynamic data) {
  return switch (data) {
    // 整数で 0 の場合
    0 => 'ゼロ',
    // 正の整数の場合 (関係演算子パターン)
    int n && > 0 => '正の整数: $n',
    // 2要素のリストの場合
    [var a, var b] => '2要素リスト: ($a, $b)',
    // 特定のキーを持つマップの場合
    {'name': String name, 'age': int age} => '名前: $name, 年齢: $age',
    _ => 'その他のデータ',
  };
}

void main() {
  print(formatData(10));
  print(formatData(['apple', 'banana']));
  print(formatData({'name': 'Alice', 'age': 20}));
  print(formatData(false));
}
```

```dart-exec:pattern_matching_complex.dart
正の整数: 10
2要素リスト: (apple, banana)
名前: Alice, 年齢: 20
その他のデータ
```
