---
id: dart-classes-encapsulation
title: カプセル化（_ によるプライベート化と get / set）
level: 2
question:
  - Dartには private や public キーワードがないのですか？
  - アンダースコア _ でプライベート化されるスコープの単位は何ですか？
  - ゲッター（get）とセッター（set）の構文はどう書きますか？
term:
  - カプセル化
  - プライベート変数
  - ゲッター
  - セッター
  - getter
  - setter
  - ライブラリスコープ
---

## カプセル化（`_` によるプライベート化と `get` / `set`）

### 1. `_` によるプライベート化

[[Dart]]には `public`、`private`、`protected` といったアクセス修飾子キーワードがありません。
識別子の先頭に **アンダースコア `_`** を付けることで、その要素は **ライブラリ（同一ファイル）プライベート** になります。

> [!IMPORTANT]
> Dartのプライベート化は「クラス単位」ではなく「ファイル（ライブラリ）単位」です。同一ファイル内であれば別クラスからでも `_` の付いた要素にアクセスできますが、別ファイルから `import` された場合は完全に非公開になります。

### 2. ゲッター（`get`）とセッター（`set`）

プロパティアクセスのように振る舞うメソッドとして、`get` と `set` を定義できます。

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

  account.balance = 8000; // セッターの呼び出し
  print('更新後残高: ${account.balance} 円');

  account.balance = -100; // 不正な値
}
```

```dart-exec:bank_account.dart
残高: 5000.0 円
更新後残高: 8000.0 円
エラー: 残高を負の値にすることはできません
```
