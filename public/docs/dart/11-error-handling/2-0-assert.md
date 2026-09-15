---
id: dart-error-assert
title: assert による開発時のバグ検知
level: 2
question:
  - assert 文は本番リリースビルド時にも実行されますか？
  - assert と通常の例外スローの使い分けは何ですか？
term:
  - assert
  - アサーション
  - デバッグモード
---

## `assert` による開発時のバグ検知

**`assert(条件, メッセージ)`** は、開発中（デバッグモード）にプログラムの不変条件や関数の前提条件を検証するための文です。

**リリース（AOTコンパイルや本番ビルド）時にはコード自体が完全に無視（除去）される** ため、本番環境の実行速度に影響を与えません。

```dart:assert_demo.dart
void setPercentage(double rate) {
  // 開発時のみチェックされ、不正なら AssertionError を発生させる
  assert(rate >= 0.0 && rate <= 1.0, 'rate は 0.0 〜 1.0 の間である必要があります');
  print('設定されたレート: ${(rate * 100).toStringAsFixed(1)}%');
}

void main() {
  setPercentage(0.75);
}
```

```dart-exec:assert_demo.dart
設定されたレート: 75.0%
```

> [!TIP]
> ユーザーの入力不正など本番でも検知・回復すべきエラーには `throw Exception` を使い、プログラマの実装ミスや前提条件の違反検知には `assert` を使い分けます。
