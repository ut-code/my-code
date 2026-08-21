---
id: dart-collections-if
title: コレクション if
level: 3
question:
  - コレクション if はどのような構文で記述しますか？
  - コレクション if の中で else を使ってフォールバック要素を追加できますか？
term:
  - コレクションif
---

### コレクション `if`

条件が `true` の場合のみ要素をコレクションに含めます。

```dart:collection_if.dart
void main() {
  bool isAdmin = true;
  bool isGuest = false;

  var navItems = [
    'ホーム',
    'プロフィール',
    if (isAdmin) '管理者パネル',
    if (isGuest) 'ログイン案内',
  ];

  print(navItems);
}
```

```dart-exec:collection_if.dart
[ホーム, プロフィール, 管理者パネル]
```
