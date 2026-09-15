---
id: dart-collections-practice1
title: '練習問題1: コレクション操作と条件付き要素追加'
level: 3
question:
  - コレクション if の中で else を使う構文はどう書きますか？
  - Setから重複を取り除いたListを作成するにはどうすればよいですか？
---

### 練習問題1: コレクション操作と条件付き要素追加

ユーザー権限と追加オプションに応じたメニュー一覧のリストを生成してください。

1. 以下の変数を定義する。
   * `bool isPremium = true;`
   * `List<String>? betaFeatures = ['AIアシスタント', '高速検索'];`
2. コレクション `if`、コレクション `for`、スプレッド演算子を活用して、以下の要素を持つ `List<String> menu` を生成する。
   * `'ホーム'`
   * `'設定'`
   * `isPremium` が `true` の場合のみ `'プレミアム限定動画'`
   * `betaFeatures` が `null` でなければその全要素を展開
   * `'ログアウト'`
3. `menu` の中身を出力する。

```dart:practice4_1.dart
void main() {
  // ここにコードを書いてください
}
```

```dart-exec:practice4_1.dart
```
