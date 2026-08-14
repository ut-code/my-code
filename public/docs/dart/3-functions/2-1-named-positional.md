---
id: dart-functions-named-positional
title: '名前付き引数（{}）と位置指定引数（[]）'
level: 3
question:
  - Flutterで名前付き引数が多用される理由は何ですか？
  - requiredキーワードを付けるとどうなりますか？
  - 名前付き引数にデフォルト値を設定する方法を教えてください。
term:
  - 名前付き引数
  - 位置指定引数
  - optional parameter
  - required
  - デフォルト値
---

### 名前付き引数（`{}`）と位置指定引数（`[]`）

### 1. 名前付き引数（Named Parameters）

引数を `{}` で囲むと、呼び出し側で引数名を明示して渡すことができるようになります。引数の順番は自由です。

* デフォルトで省略可能（Nullableか、デフォルト値が必要）。
* **`required`** を付けると、名前付き引数でありながら省略不可（必須）にできます。

```dart:named_parameters.dart
// required で必須、デフォルト値付きで省略可能
void createUser({
  required String username,
  String role = 'member',
  int? age,
}) {
  print('ユーザー: $username, 権限: $role, 年齢: ${age ?? "未設定"}');
}

void main() {
  // 引数名を指定して呼び出す（順番は自由）
  createUser(username: 'Alice');
  createUser(role: 'admin', username: 'Bob', age: 30);
}
```

```dart-exec:named_parameters.dart
ユーザー: Alice, 権限: member, 年齢: 未設定
ユーザー: Bob, 権限: admin, 年齢: 30
```

> [!TIP]
> [[Flutter]]のWidgetコンストラクタはほぼすべて名前付き引数で設計されています。設定項目が多くなってもコードの可読性が損なわれません。

### 2. オプショナルな位置指定引数（Optional Positional Parameters）

引数を `[]` で囲むと、順番通りのオプショナル引数を定義できます。

```dart:optional_positional.dart
String formatMessage(String from, String msg, [String? appName = 'MyChat']) {
  return '[$appName] $from: $msg';
}

void main() {
  print(formatMessage('Alice', 'Hello'));
  print(formatMessage('Bob', 'Hi', 'FlutterApp'));
}
```

```dart-exec:optional_positional.dart
[MyChat] Alice: Hello
[FlutterApp] Bob: Hi
```
