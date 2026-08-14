---
id: dart-patterns-switch
title: パターンマッチングと switch 式
level: 2
question:
  - switch文とswitch式の違いは何ですか？
  - switch式での網羅性チェック（Exhaustiveness checking）とは何ですか？
  - switch式の中でパターンマッチングを使って型判定と値の取り出しを同時に行う方法は？
term:
  - パターンマッチング
  - switch式
  - 網羅性チェック
  - switch文
---

## パターンマッチングと `switch` 式

従来の `switch` 文（Statement）に加え、Dart 3では評価結果の値を返す **`switch` 式（Expression）** が導入されました。

### 1. `switch` 式の基本構文

* `case` や `break` キーワードが不要になり、`パターン => 式` の簡潔な構文になります。
* すべてのケースが網羅されているかコンパイラが厳密に検証する **[[網羅性チェック]]** が働きます。

```dart:switch_expression.dart
String describeHttpCode(int statusCode) {
  return switch (statusCode) {
    200 => '成功 (OK)',
    400 => '不正なリクエスト (Bad Request)',
    404 => '未検出 (Not Found)',
    500 => 'サーバーエラー (Internal Server Error)',
    _ => '不明なステータスコード ($statusCode)', // デフォルトケース
  };
}

void main() {
  print(describeHttpCode(200));
  print(describeHttpCode(404));
  print(describeHttpCode(418));
}
```

```dart-exec:switch_expression.dart
成功 (OK)
未検出 (Not Found)
不明なステータスコード (418)
```

### 2. オブジェクトやコレクションのパターンマッチング

`switch` 式の中でデータの形状を検証しながら変数を取り出すことができます。

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
