---
id: dart-null-safety-late
title: late 修飾子の仕組みと使いどころ
level: 2
question:
  - late修飾子を付けると何が変わりますか？
  - late変数を初期化前に参照するとどうなりますか？
  - lateと遅延初期化（Lazy Initialization）の関係は何ですか？
term:
  - late
  - 遅延初期化
  - late修飾子
---

## `late` 修飾子の仕組みと使いどころ

**`late` 修飾子** は、Non-nullableな変数の初期化を「宣言時ではなく、後から（あるいは必要になった時に）行う」ことをコンパイラに宣言するキーワードです。

主な用途は以下の2点です。

### 1. 宣言時には値を代入できないNon-nullable変数の初期化

クラスの初期化メソッドやFlutterのライフサイクル（`initState`など）で後から値を設定する場合に使われます。

```dart:late_variables.dart
class UserProfile {
  // 宣言時には値がないが、Non-nullableとして扱いたい
  late String description;

  void setup() {
    description = 'Dart & Flutter開発者';
  }

  void printProfile() {
    print(description);
  }
}

void main() {
  final profile = UserProfile();
  profile.setup();
  profile.printProfile();
}
```

```dart-exec:late_variables.dart
Dart & Flutter開発者
```

> [!WARNING]
> `late` で宣言した変数を初期化する前にアクセスすると、実行時に `LateInitializationError` がスローされます。

### 2. 遅延初期化（Lazy Initialization）によるパフォーマンス向上

`late` 変数に初期化式を記述すると、その変数に**初めてアクセスされた瞬間**にのみ計算が行われます。重い初期化処理をオンデマンドで実行したい場合に有効です。

```dart:late_lazy.dart
String heavyComputation() {
  print('-> 重い計算を実行中...');
  return '計算結果: 42';
}

void main() {
  print('プログラム開始');
  late String lazyData = heavyComputation(); // この時点ではまだ実行されない

  print('データが必要になりました:');
  print(lazyData); // ここで初めて heavyComputation が呼ばれる
  print('二度目の参照: $lazyData'); // 既に計算済みなので再実行はされない
}
```

```dart-exec:late_lazy.dart
プログラム開始
データが必要になりました:
-> 重い計算を実行中...
計算結果: 42
二度目の参照: 計算結果: 42
```
