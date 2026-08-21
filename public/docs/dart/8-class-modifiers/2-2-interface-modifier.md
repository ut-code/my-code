---
id: dart-class-modifiers-interface
title: interface 修飾子（実装のみを許可し継承を禁止）
level: 3
question:
  - interface修飾子と通常のclassの違いは何ですか？
  - 外部で extends を禁止して implements のみを強制するメリットは何ですか？
term:
  - interface
  - interface修飾子
---

### `interface` 修飾子（実装のみを許可し継承を禁止）

APIの型シグネチャのみを提供し、内部実装の継承による暗黙の依存を防ぎたい場合に利用します。外部ライブラリからの継承（`extends`）を禁止し、実装（`implements`）のみを許可します。

```dart
// 外部ライブラリ側
interface class StorageService {
  void save(String key, String value) {}
}

// 利用側
// class LocalStorage extends StorageService {} // エラー: extends 不可
class LocalStorage implements StorageService {   // OK: implements のみ許可
  @override
  void save(String key, String value) => print('Saved $key');
}
```
