---
id: dart-classes-enhanced-enums
title: 高機能な列挙型（Enhanced Enum）
level: 2
question:
  - 通常のenumとEnhanced Enumの違いは何ですか？
  - Enumにフィールドやメソッド、コンストラクタを持たせるにはどう書きますか？
term:
  - Enum
  - 列挙型
  - Enhanced Enum
  - enum
---

## 高機能な列挙型（Enhanced Enum）

Dart 2.17以降の **[[Enhanced Enum]]** では、列挙型の各値にフィールド（値）、コンストラクタ、ゲッター、メソッドを持たせることができます。

単なる定数の列挙を超えて、型安全で表現力豊かなドメインモデルを簡潔に定義できます。

```dart:enhanced_enums.dart
enum HttpStatus {
  ok(200, 'Success'),
  notFound(404, 'Not Found'),
  serverError(500, 'Internal Server Error');

  // フィールド
  final int code;
  final String description;

  // const コンストラクタ
  const HttpStatus(this.code, this.description);

  // ゲッター
  bool get isSuccess => code >= 200 && code < 300;

  // メソッド
  void log() {
    print('[$code] $description (成功: $isSuccess)');
  }
}

void main() {
  final status = HttpStatus.notFound;
  status.log();

  print('HttpStatus.ok isSuccess: ${HttpStatus.ok.isSuccess}');
}
```

```dart-exec:enhanced_enums.dart
[404] Not Found (成功: false)
HttpStatus.ok isSuccess: true
```
