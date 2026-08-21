---
id: dart-async-async-await
title: async / await による可読性の高い非同期コード
level: 2
question:
  - asyncキーワードを付けた関数の戻り値型は何になりますか？
  - awaitキーワードはどこで使用できますか？
term:
  - async
  - await
  - async/await
---

## `async` / `await` による可読性の高い非同期コード

**`async`** と **`await`** キーワードを使うことで、非同期コードを同期コードと同じような直線的で読みやすいフローで記述できます。

* 関数宣言の後に `async` を付けると、その関数は自動的に `Future` を返す非同期関数になります。
* `async` 関数内でのみ、`Future` の完了を待機する **`await`** 式が使えます。

```dart:async_await_demo.dart
Future<int> fetchUserId() async {
  await Future.delayed(const Duration(milliseconds: 50));
  return 42;
}

Future<String> fetchUserName(int id) async {
  await Future.delayed(const Duration(milliseconds: 50));
  return 'Alice (ID: $id)';
}

Future<void> displayUser() async {
  print('ユーザー情報を取得中...');
  final id = await fetchUserId();
  final name = await fetchUserName(id);
  print('取得完了: $name');
}

void main() async {
  await displayUser();
}
```

```dart-exec:async_await_demo.dart
ユーザー情報を取得中...
取得完了: Alice (ID: 42)
```
