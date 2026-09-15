---
id: dart-classes-private-get-set
title: ライブラリプライベートとゲッター・セッター
level: 3
question:
  - ゲッター（get）とセッター（set）の構文はどう書きますか？
  - セッター内でバリデーションを行う例を教えてください。
term:
  - ゲッター
  - セッター
  - getter
  - setter
---

### ライブラリプライベートとゲッター・セッター

非公開フィールドに対して安全な読み書き手段を提供するために `get` と `set` を定義します。

```dart:bank_account.dart
class BankAccount {
  // プライベートフィールド
  double _balance = 0.0;

  // ゲッター
  double get balance => _balance;

  // セッター
  set balance(double value) {
    if (value < 0) {
      print('エラー: 残高を負の値にすることはできません');
      return;
    }
    _balance = value;
  }

  void deposit(double amount) {
    if (amount > 0) _balance += amount;
  }
}

void main() {
  final account = BankAccount();
  account.deposit(5000);
  print('残高: ${account.balance} 円');

  account.balance = 8000;
  print('更新後残高: ${account.balance} 円');

  account.balance = -100;
}
```

```dart-exec:bank_account.dart
残高: 5000.0 円
更新後残高: 8000.0 円
エラー: 残高を負の値にすることはできません
```
