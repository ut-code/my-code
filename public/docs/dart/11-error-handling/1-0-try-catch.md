---
id: dart-error-try-catch
title: try、catch、on、finally とカスタム例外
level: 2
question:
  - Exception と Error の違いは何ですか？
  - onキーワードを使って特定の例外だけをキャッチする方法は？
  - rethrowキーワードはどのような場合に使われますか？
term:
  - try-catch
  - Exception
  - Error
  - on
  - rethrow
  - スタックトレース
---

## `try`、`catch`、`on`、`finally` とカスタム例外

[[Dart]]の例外システムでは、`Exception`（プログラムで回復可能なエラー）と `Error`（プログラミングミスなどの重大な欠陥）が区別されています。

### 1. `on` による型指定キャッチと `rethrow`

* **`on 例外型`**: 特定の例外クラスのみを捕捉します。
* **`catch (e, stackTrace)`**: 例外オブジェクトとスタックトレースを受け取ります。
* **`rethrow`**: キャッチした例外をそのまま上位の呼び出し元へ再スローします。

```dart:exception_handling.dart
// 1. カスタム例外クラスの定義 (implements Exception)
class InsufficientFundsException implements Exception {
  final int currentBalance;
  final int requestedAmount;
  InsufficientFundsException(this.currentBalance, this.requestedAmount);

  @override
  String toString() =>
      '残高不足エラー: 現在残高 $currentBalance 円 に対し、$requestedAmount 円 の引き落とし要求がありました。';
}

void processWithdrawal(int balance, int amount) {
  if (amount > balance) {
    throw InsufficientFundsException(balance, amount);
  }
  print('引き落とし成功: $amount 円');
}

void main() {
  try {
    processWithdrawal(3000, 5000);
  } on InsufficientFundsException catch (e) {
    // 特定のカスタム例外を処理
    print('捕捉: $e');
  } catch (e, stack) {
    // その他の未知の例外
    print('予期せぬエラー: $e');
  } finally {
    print('トランザクション終了');
  }
}
```

```dart-exec:exception_handling.dart
捕捉: 残高不足エラー: 現在残高 3000 円 に対し、$5000 円 の引き落とし要求がありました。
トランザクション終了
```
