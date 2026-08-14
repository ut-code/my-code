---
id: dart-patterns-guards
title: Guard句（when）を使った条件分岐
level: 2
question:
  - when句（ガード節）はパターンマッチのどの位置に記述しますか？
  - when句の条件が満たされなかった場合、処理はどう流れますか？
  - 複雑なビジネスロジックでwhen句を活用する具体例を見たいです。
term:
  - Guard句
  - when
  - ガード節
---

## Guard句（`when`）を使った条件分岐

パターンマッチングに **`when` 節（Guard句）** を組み合わせることで、パターンの形状が一致した上でさらに任意のブール条件を課すことができます。

条件が `false` であれば次のマッチング候補へとフォールスルー（移動）します。

```dart:guards_example.dart
String evaluateScore((String, int) student) {
  return switch (student) {
    (var name, var score) when score == 100 => '$nameさん: 満点！素晴らしい！',
    (var name, var score) when score >= 80 => '$nameさん: 優秀です (点数: $score)',
    (var name, var score) when score >= 60 => '$nameさん: 合格 (点数: $score)',
    (var name, var score) => '$nameさん: 要再試験 (点数: $score)',
  };
}

void main() {
  print(evaluateScore(('Alice', 100)));
  print(evaluateScore(('Bob', 85)));
  print(evaluateScore(('Charlie', 62)));
  print(evaluateScore(('Dave', 45)));
}
```

```dart-exec:guards_example.dart
Aliceさん: 満点！素晴らしい！
Bobさん: 優秀です (点数: 85)
Charlieさん: 合格 (点数: 62)
Daveさん: 要再試験 (点数: 45)
```

> [!TIP]
> `when` 句を活用することで、ネストした `if-else` 文を平坦で美しい宣言的パターンに置き換えることができます。
