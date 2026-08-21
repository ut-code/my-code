---
id: dart-intro-main
title: 'エントリーポイント: main() 関数'
level: 2
question:
  - main関数の戻り値型はvoid以外も使えますか？
  - print関数で出力した文字列の末尾には自動的に改行が入りますか？
term:
  - main関数
  - main()
  - print
  - print関数
---

## エントリーポイント: `main()` 関数

C言語、Java、Rustなどと同様に、[[Dart]]プログラムはトップレベルの **[[main関数]]（`main()`）** から実行が始まります。

```dart:hello_world.dart
void main() {
  print('Hello, Dart!');
}
```

```dart-exec:hello_world.dart
Hello, Dart!
```

* `void`: `main` 関数が値を返さないことを表します。
* `main()`: アプリケーションのエントリーポイントとなる関数名です。
* `print(...)`: 文字列などのオブジェクトを標準出力に出力し、末尾に改行を追加します。
* `;` (セミコロン): Dartでは各ステートメントの末尾にセミコロンが必須です。
