---
id: dart-classes-mixins
title: Mixin（mixin、with）による機能の注入
level: 2
question:
  - Mixinと継承の違いは何ですか？
  - 複数のMixinを with で組み合わせる方法を教えてください。
term:
  - Mixin
  - mixin
  - with
  - 機能の注入
---

## Mixin（`mixin`、`with`）による機能の注入

**[[Mixin]]** は、クラス階層に縛られることなく、複数のクラス間で実装コード（メソッドやプロパティ）を共有・注入するための仕組みです。

`mixin` キーワードで定義し、クラスに `with` キーワードで適用します。

```dart:mixins_demo.dart
// 1. ロギング機能を提供する Mixin
mixin Logger {
  void log(String message) {
    print('[LOG ${DateTime.now().hour}:${DateTime.now().minute}] $message');
  }
}

// 2. 永続化機能を提供する Mixin
mixin Serializable {
  Map<String, dynamic> toJson();
}

// クラスに with で複数の Mixin を合成
class AppUser with Logger, Serializable {
  final String name;
  AppUser(this.name);

  void login() {
    log('ユーザー $name がログインしました');
  }

  @override
  Map<String, dynamic> toJson() => {'name': name};
}

void main() {
  final user = AppUser('Alice');
  user.login();
  print('JSON: ${user.toJson()}');
}
```

```dart-exec:mixins_demo.dart
[LOG 5:20] ユーザー Alice がログインしました
JSON: {name: Alice}
```
