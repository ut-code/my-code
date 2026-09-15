---
id: dart-functions-named-positional
title: '名前付き引数（{}）と required'
level: 3
question:
  - Flutterで名前付き引数が多用される理由は何ですか？
  - requiredキーワードを付けるとどうなりますか？
term:
  - 名前付き引数
  - optional parameter
  - required
  - デフォルト引数
---

### 名前付き引数（`{}`）と `required`

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
  createUser(username: 'Alice');
  createUser(role: 'admin', username: 'Bob', age: 30);
}
```

```dart-exec:named_parameters.dart
ユーザー: Alice, 権限: member, 年齢: 未設定
ユーザー: Bob, 権限: admin, 年齢: 30
```

> [!TIP]
> [[Flutter]]のWidgetコンストラクタはほぼすべて名前付き引数で設計されています。
