---
id: dart-class-modifiers-practice1
title: '練習問題1: sealedクラスを用いたUI状態のモデリング'
level: 3
question:
  - sealedクラスを基底にした場合のジェネリクス型の指定方法はどうなりますか？
  - switch式で各サブクラスのフィールドをパターンマッチで取り出す際の注意点は？
---

### 練習問題1: sealedクラスを用いたUI状態のモデリング

天気予報アプリの画面状態を表す `WeatherState` を `sealed` クラスで実装してください。

1. `sealed class WeatherState` を定義する。
2. 以下のサブクラスを作成する。
   * `class WeatherInitial extends WeatherState`
   * `class WeatherLoading extends WeatherState`
   * `class WeatherSuccess extends WeatherState`: フィールド `final String city`, `final double temperature` を持つ。
   * `class WeatherFailure extends WeatherState`: フィールド `final String error` を持つ。
3. `String getWeatherMessage(WeatherState state)` 関数を `switch` 式で実装し、全状態に応じた適切なメッセージ文字列を返す。
4. `main()` で各状態を作成し、メッセージを出力する。

```dart:practice8_1.dart
// ここにクラスと関数を定義してください

void main() {
  // ここで動作確認を行ってください
}
```

```dart-exec:practice8_1.dart
```
