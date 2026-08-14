---
id: dart-null-safety-conditional-access
title: 条件付きアクセス演算子（?.）
level: 3
question:
  - ?. 演算子の返り値の型は何になりますか？
  - メソッド呼び出しに ?. を使う例を教えてください。
term:
  - 条件付きアクセス演算子
  - null安全な呼び出し
---

### 条件付きアクセス演算子（`?.`）

対象が `null` でなければプロパティやメソッドにアクセスし、`null` であれば `null` を返します。

```dart:null_aware_access.dart
void main() {
  String? text;
  // text が null なので length にアクセスせず null を返す
  int? length = text?.length;
  print('length (null時): $length');

  text = 'Hello';
  length = text?.length;
  print('length (値あり時): $length');
}
```

```dart-exec:null_aware_access.dart
length (null時): null
length (値あり時): 5
```
