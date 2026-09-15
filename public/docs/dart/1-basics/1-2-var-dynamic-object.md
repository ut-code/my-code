---
id: dart-basics-var-dynamic-object
title: 'var、dynamic、Object の違い'
level: 3
question:
  - dynamicとObjectの違いは何ですか？
  - dynamic型を使うべきシチュエーションはどのようなときですか？
term:
  - dynamic
  - Object
  - 動的型
---

### `var`、`dynamic`、`Object` の違い

Dartには一見似ているように思える `var`, `dynamic`, `Object` というキーワードが存在します。これらは型安全性において決定的な違いがあります。

| キーワード | 静的型チェック | 別の型の再代入 | メンバーアクセス |
| :--- | :--- | :--- | :--- |
| **`var` (初期化あり)** | あり (初期値から固定) | 不可 | 推論された型のメソッドのみ |
| **`dynamic`** | なし (実行時に解決) | 可能 | なんでも呼べる (存在しなければ実行時エラー) |
| **`Object` / `Object?`** | あり (すべての型の基底) | 可能 | `Object` が持つメソッド (`toString()` 等) のみ |

```dart:dynamic_vs_object.dart
void main() {
  // 1. dynamic: 静的型チェックを完全にバイパスする
  dynamic value = 'Hello';
  print('dynamic: ${value.length}');
  value = 123; // 異なる型の再代入もOK
  print('dynamic(int): $value');

  // 2. Object: すべての非Nullオブジェクトの基底クラス (型安全)
  Object obj = 'World';
  if (obj is String) {
    // is チェックでスマートキャストされる
    print('Object(String): ${obj.length}');
  }
}
```

```dart-exec:dynamic_vs_object.dart
dynamic: 5
dynamic(int): 123
Object(String): 5
```

> [!WARNING]
> `dynamic` は実行時までエラーが発覚しないため、JSONのデコードなど型が未知の境界領域以外では極力使用を避けましょう。
