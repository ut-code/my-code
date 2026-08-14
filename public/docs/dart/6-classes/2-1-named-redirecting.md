---
id: dart-classes-named-redirecting
title: 名前付き・リダイレクト・const コンストラクタ
level: 3
question:
  - リダイレクトコンストラクタの構文はどう書きますか？
  - constコンストラクタを定義するための要件は何ですか？
term:
  - 名前付きコンストラクタ
  - リダイレクトコンストラクタ
  - constコンストラクタ
---

### 名前付き・リダイレクト・const コンストラクタ

* **名前付きコンストラクタ**: `ClassName.identifier(...)` の形式で定義。
* **リダイレクトコンストラクタ**: `: this(...)` で別コンストラクタに初期化を委譲。
* **`const` コンストラクタ**: 全フィールドが `final` の場合、コンパイル時定数としてインスタンス化可能。

```dart:constructors_demo.dart
class User {
  final String name;
  final int age;

  // 基本コンストラクタ (const対応)
  const User(this.name, this.age);

  // 名前付きコンストラクタ
  User.guest()
      : name = 'ゲスト',
        age = 0;

  // リダイレクトコンストラクタ
  User.adult(String name) : this(name, 20);

  void display() {
    print('ユーザー: $name (年齢: $age)');
  }
}

void main() {
  const u1 = User('Alice', 25);
  final u2 = User.guest();
  final u3 = User.adult('Bob');

  u1.display();
  u2.display();
  u3.display();
}
```

```dart-exec:constructors_demo.dart
ユーザー: Alice (年齢: 25)
ユーザー: ゲスト (年齢: 0)
ユーザー: Bob (年齢: 20)
```
