---
id: dart-classes-practice2
title: '練習問題2: factoryコンストラクタによるJSONパース'
level: 3
question:
  - JSONパースでnullが渡される可能性がある場合の安全な書き方を教えてください。
  - toString() メソッドをオーバーライドするメリットは何ですか？
---

### 練習問題2: factoryコンストラクタによるJSONパース

Web APIから受信したユーザー設定データを表す `UserSettings` クラスを実装してください。

1. フィールドとして `final String theme`（テーマ名）と `final bool notificationsEnabled`（通知有無）を持つ。
2. 通常のコンストラクタ `const UserSettings({required this.theme, required this.notificationsEnabled});` を定義する。
3. `factory UserSettings.fromJson(Map<String, dynamic> json)` を実装し、Mapから各プロパティをパースしてインスタンスを返す。
   * `theme` が未指定の場合は `'light'`、`notificationsEnabled` が未指定の場合は `true` をデフォルト値とする。
4. `main()` でJSONマップを渡し、パースされた設定内容を出力する。

```dart:practice6_2.dart
// ここにクラスを定義してください

void main() {
  // ここで動作確認を行ってください
}
```

```dart-exec:practice6_2.dart
```
