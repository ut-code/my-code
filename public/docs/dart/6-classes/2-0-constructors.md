---
id: dart-classes-constructors
title: 様々なコンストラクタ（名前付き、リダイレクト）
level: 2
question:
  - 名前付きコンストラクタはどのような時に便利ですか？
  - リダイレクトコンストラクタの構文はどう書きますか？
  - constコンストラクタを定義するための要件は何ですか？
term:
  - コンストラクタ
  - 名前付きコンストラクタ
  - リダイレクトコンストラクタ
  - constコンストラクタ
---

## 様々なコンストラクタ（名前付き、リダイレクト）

Dartでは、1つのクラスに複数の異なる初期化方法を提供するために **[[名前付きコンストラクタ]]** や **[[リダイレクトコンストラクタ]]** を作成できます。

### 1. 名前付きコンストラクタ（Named Constructors）

`ClassName.constructorName(...)` の形式で定義します。JavaやC++のオーバーロードと異なり、コンストラクタの意図が名前によって明確になります。

### 2. リダイレクトコンストラクタ（Redirecting Constructors）

別のコンストラクタに初期化処理を委譲（リダイレクト）するコンストラクタです。コロン `:` に続けて `this(...)` を呼び出します。

### 3. `const` コンストラクタ

すべてのフィールドが `final` で構成されている場合、コンストラクタに `const` を付与してコンパイル時定数インスタンスを生成できます。

```dart:constructors_demo.dart
class User {
  final String name;
  final int age;

  // 基本コンストラクタ (const対応)
  const User(this.name, this.age);

  // 1. 名前付きコンストラクタ
  User.guest()
      : name = 'ゲスト',
        age = 0;

  // 2. リダイレクトコンストラクタ (基本コンストラクタを呼び出す)
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
