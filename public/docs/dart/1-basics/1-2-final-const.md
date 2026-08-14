---
id: dart-basics-final-const
title: final と const の使い分け
level: 3
question:
  - finalとconstの最も重要な違いは何ですか？
  - DateTime.now()をconstに代入できないのはなぜですか？
  - constコンストラクタを使うとFlutterでパフォーマンスが上がるのはなぜですか？
term:
  - final
  - const
  - コンパイル時定数
  - 不変
---

### `final` と `const` の使い分け

Dartで値の再代入を禁止する変数（定数）を宣言するには、`final` または `const` を使用します。

### 1. `final`: 実行時定数（一度だけ代入可能）

`final` で宣言された変数は、**実行時** に値が決まる定数です。一度代入した後は変更できません。

```dart
final currentTime = DateTime.now(); // 実行時の現在時刻を代入可能
// currentTime = DateTime.now();   // エラー: 再代入不可
```

### 2. `const`: コンパイル時定数

`const` は、**コンパイル時** に値が完全に確定している定数です。

```dart
const double pi = 3.1415926535;
const int secondsInMinute = 60;
// const currentTime = DateTime.now(); // コンパイルエラー: 実行時にしか決まらない
```

### 比較コード例

```dart:final_const.dart
void main() {
  final now = DateTime.now();
  const maxItems = 100;

  // constリストは内容の変更も不可（ディープイミュータブル）
  const list = [1, 2, 3];
  // list.add(4); // 実行時エラー (Unsupported operation)

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
> Flutterでは、不変なWidgetの生成に `const` を付与することで、フレーム再描画時にインスタンスが再生成されるのを防ぎ、メモリ消費とレンダリング負荷を大幅に削減できます。
