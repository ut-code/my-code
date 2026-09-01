---
id: dart-class-modifiers-sealed
title: sealed クラスによる代数的データ型（ADT）とSwitchの組み合わせ
level: 2
question:
  - sealedクラスを定義する主な目的は何ですか？
  - sealedクラスのサブクラスはどこで定義する必要がありますか？
  - switch式でsealedクラスの全パターンを網羅しないとどうなりますか？
term:
  - sealed
  - sealedクラス
  - 代数的データ型
  - ADT
  - 網羅性
---

## `sealed` クラスによる代数的データ型（ADT）とSwitchの組み合わせ

**`sealed` クラス** は、そのクラスを直接インスタンス化できず（暗黙的に `abstract`）、**サブクラスの定義を同一ライブラリ（同一ファイル）内のみに限定する** 修飾子です。

コンパイラは「そのクラスのサブクラスの全パターン」を完全に把握できるため、`switch` 式で**[[網羅性チェック]]**が働きます。

```dart:sealed_demo.dart
// 1. sealed クラスでUI状態の基底クラスを定義
sealed class UiState {}

class InitialState extends UiState {}
class LoadingState extends UiState {}
class SuccessState extends UiState {
  final List<String> data;
  SuccessState(this.data);
}
class ErrorState extends UiState {
  final String message;
  ErrorState(this.message);
}

// 2. switch式で状態に応じたレンダリング文字列を生成
String render(UiState state) {
  // 全サブクラスが網羅されているため、default (_) 節が不要！
  return switch (state) {
    InitialState() => '待機中...',
    LoadingState() => '読み込み中...',
    SuccessState(:var data) => 'データ取得成功: ${data.join(', ')}',
    ErrorState(:var message) => 'エラー発生: $message',
  };
}

void main() {
  UiState state = LoadingState();
  print(render(state));

  state = SuccessState(['Dart', 'Flutter']);
  print(render(state));

  state = ErrorState('ネットワーク接続に失敗しました');
  print(render(state));
}
```

```dart-exec:sealed_demo.dart
読み込み中...
データ取得成功: Dart, Flutter
エラー発生: ネットワーク接続に失敗しました
```

> [!TIP]
> 新しい状態を後から追加した際、`switch` 式でそのケースを書き忘れていると、コンパイラがビルド時に即座に未網羅エラーを通知してくれます。
