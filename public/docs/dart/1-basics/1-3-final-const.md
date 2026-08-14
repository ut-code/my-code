---
id: dart-basics-final-const
title: final と const の使い分け
level: 3
question:
  - finalとconstの最も重要な違いは何ですか？
  - DateTime.now()をconstに代入できないのはなぜですか？
term:
  - final
  - const
  - コンパイル時定数
  - 不変
---

### `final` と `const` の使い分け

Dartで値の再代入を禁止する変数（定数）を宣言するには、`final` または `const` を使用します。

* **`final`（実行時定数）**: 実行時に一度だけ初期化され、以降は変更できません。`DateTime.now()` などの実行時計算値も代入可能です。
* **`const`（コンパイル時定数）**: コンパイル時に値が完全に確定している定数です。

```dart:final_const.dart
void main() {
  final now = DateTime.now(); // 実行時に値が確定
  const maxItems = 100;       // コンパイル時に確定

  // constリストは要素の変更も不可（完全なイミュータブル）
  const list = [1, 2, 3];

  print('現在時刻 (final): $now');
  print('最大件数 (const): $maxItems');
  print('定数リスト: $list');
}
```

```dart-exec:final_const.dart
現在時刻 (final): 2026-08-14 05:20:00.000
最大件数 (const): 100
定数リスト: [1, 2, 3]
```

> [!TIP]
> Flutterでは不変なWidgetの生成に `const` を付与することで、再描画時のインスタンス再生成を防止してパフォーマンスを高めます。
