---
id: dart-collections-set
title: 'Set: 重複のない集合'
level: 3
question:
  - SetとListの違いは何ですか？
  - 空のSetをリテラルで定義する際の注意点は？
term:
  - 集合
  - 一意
---

### `Set`: 重複のない集合

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

> [!NOTE]
> 空の波括弧 `{}` はデフォルトで `Map` と判定されます。空のSetを作る場合は `<int>{}` や `Set<int>()` と型を明示します。
