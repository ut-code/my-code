---
id: javascript-classes-private
title: プライベートフィールド (#)
level: 3
question:
  - 「真のプライベートプロパティ」が存在しなかったとは、どういう問題があったのですか？
  - '`#` をプレフィックスにすると本当にクラス外からアクセスできないのですか？'
  - 従来の `_variable` と `変数名` はどのように使い分ければ良いですか？
  - >-
    `console.log(account.balance);` が `undefined` になるのはなぜですか？ `#balance`
    を設定しているのに。
---

### プライベートフィールド (\#)

長らくJavaScriptには「真のプライベートプロパティ」が存在せず、`_variable` のような命名規則に頼っていました。しかし、ES2019以降、`#` をプレフィックスにすることで、**クラス外から完全にアクセス不可能なフィールド**を定義できるようになりました。

```js:private_static_2.js
class BankAccount {
  // プライベートフィールドの宣言
  #balance;

  constructor(initialBalance) {
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount > 0) {
      this.#balance += amount;
      console.log(`Deposited: ${amount}`);
    }
  }

  getBalance() {
    return this.#balance;
  }

  // 静的メソッド
  static createZeroAccount() {
    return new BankAccount(0);
  }
}

const account = BankAccount.createZeroAccount();
account.deposit(1000);

console.log(`Current Balance: ${account.getBalance()}`);

// 外部からのアクセスを試みると、 Syntax Error になる
// console.log(account.#balance);

// 従来のプロパティアクセスのように見えても...
console.log(account.balance); // undefined
```

```js-exec:private_static_2.js
Deposited: 1000
Current Balance: 1000
undefined
```
