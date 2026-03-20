---
id: javascript-classes-static
title: 静的メソッド (static)
level: 3
question:
  - 静的メソッドとは何ですか？インスタンスのメソッドとどう違うのですか？
  - ユーティリティ関数やファクトリーメソッドの具体的な例をもっと知りたいです。
  - 静的メソッドの中で `this` を使うことはできますか？
---

### 静的メソッド (static)

インスタンスではなく、クラス自体に紐付くメソッドです。ユーティリティ関数やファクトリーメソッドによく使われます。

```js:private_static_1.js
class BankAccount {
  constructor(initialBalance) {
    this.balance = initialBalance;
  }

  deposit(amount) {
    if (amount > 0) {
      this.balance += amount;
      console.log(`Deposited: ${amount}`);
    }
  }

  getBalance() {
    return this.balance;
  }

  // 静的メソッド
  static createZeroAccount() {
    return new BankAccount(0);
  }
}

const account = BankAccount.createZeroAccount();
account.deposit(1000);

console.log(`Current Balance: ${account.getBalance()}`);

console.log(account.balance);
```

```js-exec:private_static_1.js
Deposited: 1000
Current Balance: 1000
1000
```
