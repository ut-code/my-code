---
id: dart-null-safety-flow-analysis
title: 型プロモーション（スマートキャスト）
level: 3
question:
  - if文でnullチェックした後は自動的にNon-nullableとして扱われますか？
  - フロー解析による型プロモーションが効かないケースはありますか？
term:
  - 型プロモーション
  - フロー解析
  - nullチェック
---

### 型プロモーション（スマートキャスト）

Nullableな変数であっても、`if` 文などで `null` でないことをチェック（フロー解析）すると、そのスコープ内では自動的にNon-nullable型へと昇格（プロモート）します。

```dart:flow_analysis.dart
void printLength(String? text) {
  if (text != null) {
    // このブロック内では text は String? ではなく String として扱われる
    print('文字数: ${text.length}');
  } else {
    print('テキストは null です');
  }
}

void main() {
  printLength('Dart Flutter');
  printLength(null);
}
```

```dart-exec:flow_analysis.dart
文字数: 12
テキストは null です
```
