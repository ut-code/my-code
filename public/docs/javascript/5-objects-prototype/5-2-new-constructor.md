---
id: javascript-prototype-new-constructor
title: 2. コンストラクタ関数（new演算子）
level: 3
question:
  - コンストラクタ関数とは何ですか？
  - '`new` 演算子は何をしているのですか？'
  - '`Func.prototype` と `user1.__proto__` は何が違うのですか？'
  - '`User.prototype` にメソッドを定義するとメモリが節約されるのはなぜですか？'
term:
  - コンストラクタ関数
  - new
  - new演算子
  - インスタンス
---

### 2\. コンストラクタ関数（new演算子）

ES6の [[`class`]] が登場する前、JavaScriptでは[[関数]]を[[コンストラクタ]]として使用し、[[`new`]] 演算子を使って[[インスタンス]]を生成していました。これは現在でも多くのライブラリの内部で使用されている重要なパターンです。

  * [[関数]][[オブジェクト]]は `[[prototype]]` という特別な[[プロパティ]]を持っています（`[[__proto__]]`とは別物です）。
  * `[[new]] Func()` すると、作られた[[インスタンス]]の `[[__proto__]]` に `Func.prototype` がセットされます。

```js:constructor_pattern.js
// コンストラクタ関数（慣習として大文字で始める）
function User(name) {
    // this = {} (新しい空のオブジェクトが暗黙的に生成される)
    this.name = name;
    // return this (暗黙的にこのオブジェクトが返される)
}

// すべてのUserインスタンスで共有したいメソッドは
// User.prototype に定義する（メモリ節約のため）
User.prototype.sayHi = function() {
    console.log(`Hi, I am ${this.name}`);
};

const user1 = new User("Alice");
const user2 = new User("Bob");

user1.sayHi();
user2.sayHi();

// 仕組みの確認
console.log(user1.__proto__ === User.prototype); // true
console.log(user1.sayHi === user2.sayHi);       // true (同じ関数を共有している)
```

```js-exec:constructor_pattern.js
Hi, I am Alice
Hi, I am Bob
true
true
```

> **重要な区別:**
>
>   * `obj.[[__proto__]]`: [[オブジェクト]]の実の親（リンク先）。
>   * `Func.[[prototype]]`: その[[関数]]を [[`new`]] したときに、生成される[[インスタンス]]の `[[__proto__]]` に代入される**テンプレート**。
