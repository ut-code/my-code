---
id: dart-class-modifiers-practice2
title: '練習問題2: クラス修飾子による安全なAPI設計'
level: 3
question:
  - abstract interface class と書くことの意味は何ですか？
  - baseクラスを継承するクラスに付けなければならない修飾子のルールを復習したいです。
---

### 練習問題2: クラス修飾子による安全なAPI設計

キャッシュストレージのインターフェースと、基底となるローカルストレージ実装を設計してください。

1. `abstract interface class CacheRepository<T>` を定義し、メソッド `T? get(String key);` と `void set(String key, T value);` を宣言する。
2. `base class MemoryCacheRepository<T> implements CacheRepository<T>` を実装し、内部の `Map<String, T>` にデータを保存・取得する処理を実装する。
3. `final class ExpiringMemoryCache<T> extends MemoryCacheRepository<T>` を定義する。
4. `main()` で `ExpiringMemoryCache<String>` を生成し、データの追加と取得をテストする。

```dart:practice8_2.dart
// ここにクラスを定義してください

void main() {
  // ここで動作確認を行ってください
}
```

```dart-exec:practice8_2.dart
```
