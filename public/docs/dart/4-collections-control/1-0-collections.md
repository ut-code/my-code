---
id: dart-collections-types
title: List、Set、Map とジェネリクス
level: 2
question:
  - List、Set、Map の使い分けの基準は何ですか？
  - コレクションのリテラル記法はどうなっていますか？
  - 型推論で要素の型が固定される仕組みを教えてください。
term:
  - List
  - Set
  - Map
  - コレクション
  - ジェネリクス
---

## `List`、`Set`、`Map` とジェネリクス

[[Dart]]の代表的なコレクション型には、**`List`**、**`Set`**、**`Map`** があります。すべて[[ジェネリクス]]（`<T>`）に対応しており、要素の型が厳格にチェックされます。

### 1. `List`: 順序付きの配列

角括弧 `[]` を使ってリテラルを定義します。

```dart:list_basics.dart
void main() {
  // 型推論により List<String> になる
  var fruits = ['apple', 'banana', 'orange'];
  
  fruits.add('grape');
  print('要素数: ${fruits.length}');
  print('0番目: ${fruits[0]}');
  print('全要素: $fruits');
}
```

```dart-exec:list_basics.dart
要素数: 4
0番目: apple
全要素: [apple, banana, orange, grape]
```

### 2. `Set`: 重複のない集合

波括弧 `{}` を使い、要素のみをカンマ区切りで並べます。

```dart:set_basics.dart
void main() {
  // Set<int>
  var numbers = {1, 2, 3, 2, 1};
  numbers.add(4);
  numbers.add(3); // 重複は無視される

  print('Setの要素: $numbers');
  print('2を含むか: ${numbers.contains(2)}');
}
```

```dart-exec:set_basics.dart
Setの要素: {1, 2, 3, 4}
2を含むか: true
```

### 3. `Map`: キーと値のペア（連想配列）

波括弧 `{}` を使い、`key: value` 形式で記述します。

```dart:map_basics.dart
void main() {
  // Map<String, int>
  var scores = {
    'Alice': 95,
    'Bob': 80,
  };

  scores['Charlie'] = 88; // 要素の追加・更新
  print('Aliceの点数: ${scores['Alice']}');
  print('存在しないキー: ${scores['Dave']}'); // null が返る
}
```

```dart-exec:map_basics.dart
Aliceの点数: 95
存在しないキー: null
```

> [!NOTE]
> 空の波括弧 `{}` はデフォルトで `Map<dynamic, dynamic>` とみなされます。空のSetを作りたい場合は `<int>{}` や `Set<int>()` のように型を明示します。
