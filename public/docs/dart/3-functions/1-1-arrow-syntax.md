---
id: dart-functions-arrow-syntax
title: アロー構文（=>）と関数オブジェクト
level: 3
question:
  - アロー構文（=>）と通常の関数本体（{}）の使い分けは何ですか？
  - 関数を変数に代入して呼び出す方法を教えてください。
term:
  - アロー関数
  - '=>'
  - アロー構文
---

### アロー構文（`=>`）と関数オブジェクト

関数本体が単一の式（Expression）のみで構成される場合、波括弧 `{ return ...; }` の代わりに **`=>`（アロー構文）** を使って簡潔に記述できます。

また、関数を変数に格納して利用することもできます。

```dart:arrow_syntax.dart
// アロー構文による定義
int multiply(int a, int b) => a * b;

void main() {
  print('アロー関数: ${multiply(4, 5)}');

  // 変数に関数を代入
  int Function(int, int) op = multiply;
  print('変数経由の呼び出し: ${op(10, 20)}');
}
```

```dart-exec:arrow_syntax.dart
アロー関数: 20
変数経由の呼び出し: 200
```
