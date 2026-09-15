---
id: dart-records-patterns-practice2
title: '練習問題2: switch式とパターンマッチによるコマンドパーサー'
level: 3
question:
  - switch式でListの要素数をチェックするパターンの書き方を教えてください。
  - when句を使って引数の値のバリデーションを行う例を教えてください。
---

### 練習問題2: switch式とパターンマッチによるコマンドパーサー

CLIツールに入力された文字列コマンド（引数リスト `List<String>`）を解析する関数 `handleCommand` を作成してください。

1. `handleCommand(List<String> command)` を定義し、`switch` 式を使って以下のパターンを処理する。
   * `['help']` => `'ヘルプを表示します'`
   * `['view', var id]` => `'ID: $id の詳細を表示します'`
   * `['create', var name, var countStr]` when `int.tryParse(countStr) != null` => `'新規作成: $name ($countStr 個)'`
   * `_` => `'無効なコマンドです'`
2. `main()` でそれぞれのコマンドパターンを渡し、正しく分岐されることを確認する。

```dart:practice5_2.dart
// ここに関数を定義してください

void main() {
  // ここで動作確認を行ってください
}
```

```dart-exec:practice5_2.dart
```
