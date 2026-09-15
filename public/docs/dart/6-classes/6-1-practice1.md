---
id: dart-classes-practice1
title: '練習問題1: カプセル化されたBankAccountクラス'
level: 3
question:
  - ゲッターのみを定義して読み取り専用プロパティを作るメリットは何ですか？
  - コンストラクタで初期残高を受け取りつつ、負の値を防ぐにはどうすればよいですか？
---

### 練習問題1: カプセル化されたBankAccountクラス

口座名義と残高を管理する `BankAccount` クラスを実装してください。

1. プライベート変数 `String _owner` と `int _balance` を持つ。
2. コンストラクタ `BankAccount(this._owner, this._balance)` を定義する（初期残高が負でないことを `assert` または初期化子リストで確認）。
3. 読み取り専用ゲッター `owner` と `balance` を定義する。
4. メソッド `void withdraw(int amount)` を定義し、残高が十分な場合は引き落としを行い、不足している場合は `'残高不足です'` と出力する。
5. `main()` でインスタンスを生成し、引き落とし処理をテストする。

```dart:practice6_1.dart
// ここにクラスを定義してください

void main() {
  // ここで動作確認を行ってください
}
```

```dart-exec:practice6_1.dart
```
