---
id: dart-intro-args
title: コマンドライン引数の受け取り
level: 3
question:
  - コマンドライン引数をmain関数で受け取るにはどうすればよいですか？
  - argsの型は何になりますか？
term:
  - コマンドライン引数
  - args
---

### コマンドライン引数の受け取り

外部からの引数を受け取る場合は、引数に `List<String> args` を指定します。

```dart:args_example.dart
void main(List<String> args) {
  if (args.isEmpty) {
    print('引数が渡されていません。');
  } else {
    print('受け取った引数: $args');
  }
}
```

```dart-exec:args_example.dart
引数が渡されていません。
```

次の [[./1]] では、Dartの型システム、変数宣言、および基本的な演算子について詳しく学んでいきます。
