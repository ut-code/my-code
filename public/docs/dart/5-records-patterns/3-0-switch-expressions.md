---
id: dart-patterns-switch
title: パターンマッチングと switch 式
level: 2
question:
  - switch文とswitch式の違いは何ですか？
  - switch式での網羅性チェックとは何ですか？
term:
  - パターンマッチング
  - switch式
  - 網羅性チェック
---

## パターンマッチングと `switch` 式

従来の `switch` 文に加え、Dart 3では評価結果の値を返す **`switch` 式（Expression）** が導入されました。

すべてのケースが網羅されているかコンパイラが厳密に検証する **[[網羅性チェック]]** が働きます。

```dart:switch_expression.dart
String describeHttpCode(int statusCode) {
  return switch (statusCode) {
    200 => '成功 (OK)',
    400 => '不正なリクエスト (Bad Request)',
    404 => '未検出 (Not Found)',
    500 => 'サーバーエラー (Internal Server Error)',
    _ => '不明なステータスコード ($statusCode)',
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
