---
id: dart-patterns-destructuring
title: 分解（Destructuring）によるデータの抽出
level: 2
question:
  - レコードやListから直接変数に分解代入する方法はどう書きますか？
  - 分解時に一部の値を無視するにはどうすればよいですか？
  - Mapの分解代入はどのように行いますか？
term:
  - パターン分解
  - 分解代入
  - Destructuring
  - ワイルドカード
---

## 分解（Destructuring）によるデータの抽出

Dart 3のパターン構文を使用すると、レコード、List、Mapなどの複合データ構造を宣言的に分解（**[[分解代入]]**）して個別のローカル変数に抽出できます。

### 1. レコードの分解

```dart:destructure_records.dart
(String, int) getCoords() => ('Tokyo', 100);
({int x, int y}) getPoint() => (x: 10, y: 20);

void main() {
  // 位置レコードの分解
  final (city, population) = getCoords();
  print('都市: $city, 人口: $population 万人');

  // 名前付きレコードの分解 (フィールド名と同名の変数にバインド)
  final (:x, :y) = getPoint();
  print('座標: x=$x, y=$y');
}
```

```dart-exec:destructure_records.dart
都市: Tokyo, 人口: 100 万人
座標: x=10, y=20
```

### 2. List と Map の分解

リストの要素数や中身に一致するパターンを使って値を抽出できます。不要な要素は `_`（ワイルドカード）で無視できます。

```dart:destructure_collections.dart
void main() {
  // List の分解
  final numbers = [1, 2, 3, 4];
  final [first, second, _, fourth] = numbers;
  print('1番目: $first, 2番目: $second, 4番目: $fourth');

  // Map の分解
  final json = {'id': 'user_123', 'status': 'active'};
  final {'id': String userId, 'status': String userStatus} = json;
  print('ユーザーID: $userId, ステータス: $userStatus');
}
```

```dart-exec:destructure_collections.dart
1番目: 1, 2番目: 2, 4番目: 4
ユーザーID: user_123, ステータス: active
```
