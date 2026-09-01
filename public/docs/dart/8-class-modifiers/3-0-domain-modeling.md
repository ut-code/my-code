---
id: dart-class-modifiers-domain-modeling
title: ドメインモデルの堅牢な設計方法
level: 2
question:
  - アプリケーションの状態管理でsealedクラスを活用するベストプラクティスは何ですか？
  - 不正な状態の表現を型レベルで不可能にするにはどうすればよいですか？
term:
  - ドメインモデル
  - 状態モデリング
  - イミュータブル
  - 型安全
---

## ドメインモデルの堅牢な設計方法

クラス修飾子（特に `sealed`）とDart 3のパターンマッチングを組み合わせることで、**「不正な状態を型レベルで表現不可能にする」** 堅牢な[[ドメインモデル]]が構築できます。

```dart:auth_state_modeling.dart
sealed class AuthState {
  const AuthState();
}

class AuthUnauthenticated extends AuthState {
  const AuthUnauthenticated();
}

class AuthAuthenticating extends AuthState {
  const AuthAuthenticating();
}

class AuthAuthenticated extends AuthState {
  final String userId;
  final String token;
  const AuthAuthenticated({required this.userId, required this.token});
}

class AuthError extends AuthState {
  final String errorMessage;
  const AuthError(this.errorMessage);
}

void printAuthAction(AuthState state) {
  final action = switch (state) {
    AuthUnauthenticated() => 'ログインボタンを表示します',
    AuthAuthenticating() => 'スピナーを表示して待機します',
    AuthAuthenticated(:var userId) => 'ユーザー $userId のマイページを表示します',
    AuthError(:var errorMessage) => 'エラーダイアログを表示: $errorMessage',
  };
  print(action);
}

void main() {
  AuthState state = const AuthAuthenticating();
  printAuthAction(state);

  state = const AuthAuthenticated(userId: 'u_777', token: 'jwt_abc123');
  printAuthAction(state);
}
```

```dart-exec:auth_state_modeling.dart
スピナーを表示して待機します
ユーザー u_777 のマイページを表示します
```
