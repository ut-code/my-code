---
id: dart-intro-main
title: 'エントリーポイント: main() 関数'
level: 2
question:
  - main関数の戻り値型はvoid以外も使えますか？
  - コマンドライン引数をmain関数で受け取るにはどうすればよいですか？
  - print関数で改行なしの出力を行うことはできますか？
term:
  - main関数
  - main()
  - print
  - print関数
---

## エントリーポイント: `main()` 関数

C言語、Java、Rustなどと同様に、[[Dart]]プログラムはトップレベルの **[[main関数]]（`main()`）** から実行が始まります。

まずは最もシンプルな "Hello, World!" プログラムを見てみましょう。

```dart:hello_world.dart
void main() {
  print('Hello, Dart!');
}
```

```dart-exec:hello_world.dart
Hello, Dart!
```

### コードの解説

* `void`: `main` 関数が値を返さないことを表します。
* `main()`: アプリケーションのエントリーポイントとなる関数名です。
* `print(...)`: 文字列などのオブジェクトを標準出力に出力し、末尾に改行を追加します。
* `;` (セミコロン): Dartでは各ステートメントの末尾にセミコロンが必須です。

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
