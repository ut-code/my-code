---
id: dart-error-assert
title: assert による開発時のバグ検知
level: 2
question:
  - assert 文は本番リリース時（プロダクションビルド）にも実行されますか？
  - assert と if-throw の使い分け基準は何ですか？
  - Flutterでassertが多用されている理由は何ですか？
term:
  - assert
  - アサーション
  - デバッグ
---

## `assert` による開発時のバグ検知

**`assert(条件式, 'エラーメッセージ');`** は、開発・デバッグ時（Debug Mode）にのみ実行されるアサーション（前提条件チェック）文です。

* 条件が `true` であれば何も起きません。
* 条件が `false` の場合、`AssertionError` がスローされ、即座に実行が中断します。
* **リリースビルド（AOTコンパイルや本番モード）では自動的に完全に無視（コードから削除）される**ため、実行時パフォーマンスに一切影響を与えません。

```dart:assert_demo.dart
class User {
  final String name;
  final int age;

  User(this.name, this.age)
      : assert(name.isNotEmpty, 'ユーザー名は空にできません'),
        assert(age >= 0, '年齢は0歳以上である必要があります');
}

void main() {
  final validUser = User('Alice', 20);
  print('ユーザー作成成功: ${validUser.name}');

  // デバッグ実行時、条件を満たさないと AssertionError が発生
  // final invalidUser = User('', -5);
}
```

```dart-exec:assert_demo.dart
ユーザー作成成功: Alice
```

> [!NOTE]
> **使い分けの基準**:
> * `assert`: プログラマ自身の内部的なミスやAPIの不正利用を開発中に防ぐ目的。
> * `if-throw`（例外スロー）: ユーザー入力エラーやネットワーク遮断など、本番環境でも発生し得る外部要因のエラー処理。
