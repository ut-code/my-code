# 第7章: クラス構文 (ES6+)

前章では、JavaScriptのオブジェクト指向の核心である「プロトタイプ」について学びました。他の言語（Java, C\#, Pythonなど）の経験者にとって、プロトタイプチェーンによる継承は柔軟ですが、少し直感的ではない部分もあったかもしれません。

ES6 (ECMAScript 2015) から導入された **`class` 構文** は、プロトタイプベースの継承メカニズムを隠蔽し、一般的なクラスベースのオブジェクト指向言語に近い記述を可能にするものです。これを「糖衣構文（Syntactic Sugar）」と呼びます。

この章では、現代のJavaScript開発で標準となっているクラスの定義方法、継承、そして比較的新しい機能であるプライベートフィールドについて解説します。

## クラスの定義とコンストラクタ

JavaScriptのクラスは `class` キーワードを使って定義します。初期化処理は `constructor` という特別なメソッド内で行います。

基本的に、クラス定義の内部は自動的に **Strict Mode (`'use strict'`)** で実行されます。

```js-repl:1
> class User {
...   constructor(name, age) {
...     this.name = name;
...     this.age = age;
...   }
... }
undefined
> const user1 = new User("Alice", 30);
undefined
> user1.name
'Alice'
> typeof User // クラスの実態は関数
'function'
```

### クラス式

関数と同様に、クラスも式として変数に代入できます（あまり頻繁には使われませんが、知識として持っておくと良いでしょう）。

```js-repl:2
> const Item = class {
...   constructor(price) {
...     this.price = price;
...   }
... };
undefined
> new Item(100).price
100
```

## メソッド、ゲッター、セッター

クラス構文の中では、プロトタイプへのメソッド定義を簡潔に書くことができます。`function` キーワードは不要です。また、プロパティへのアクセスを制御するゲッター (`get`) とセッター (`set`) も直感的に記述できます。

```js:rectangle.js
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  // 通常のメソッド（プロトタイプメソッドになります）
  calcArea() {
    return this.width * this.height;
  }

  // ゲッター: プロパティのようにアクセス可能
  get description() {
    return `${this.width} x ${this.height} Rectangle`;
  }

  // セッター: 値の検証などに利用
  set width(value) {
    if (value <= 0) {
      console.log("幅は0より大きくある必要があります");
      return;
    }
    this._width = value;
  }

  get width() {
    return this._width;
  }
}

const rect = new Rectangle(10, 20);

console.log(rect.calcArea());   // メソッド呼び出し
console.log(rect.description);  // ゲッター呼び出し（()は不要）

rect.width = -5; // セッターによるバリデーション
rect.width = 15;
console.log(rect.calcArea());
```

```js-exec:rectangle.js
200
10 x 20 Rectangle
幅は0より大きくある必要があります
300
```

> **Note:** セッター内で `this.width = value` とすると無限再帰になるため、慣習的に内部プロパティには `_`（アンダースコア）を付けることがよくありましたが、現在は後述するプライベートフィールド（`#`）を使うのがモダンな方法です。

## 継承 (extends と super)

他の言語同様、`extends` キーワードを使用して既存のクラスを継承できます。親クラスのコンストラクタやメソッドには `super` を使ってアクセスします。

ここで重要なルールが1つあります。**子クラスの `constructor` 内では、`this` を使用する前に必ず `super()` を呼び出す必要があります。**

```js:inheritance.js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a noise.`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    // thisを使う前に親のコンストラクタを呼ぶ必須ルール
    super(name); 
    this.breed = breed;
  }

  // メソッドのオーバーライド
  speak() {
    // 親クラスのメソッド呼び出し
    const parentSound = super.speak(); 
    return `${parentSound} But specifically, ${this.name} barks!`;
  }
}

const d = new Dog("Pochi", "Shiba");
console.log(d.speak());
console.log(d instanceof Dog);    // true
console.log(d instanceof Animal); // true
```

```js-exec:inheritance.js
Pochi makes a noise. But specifically, Pochi barks!
true
true
```

## 静的メソッド (static) とプライベートフィールド (\#)

### 静的メソッド (static)

インスタンスではなく、クラス自体に紐付くメソッドです。ユーティリティ関数やファクトリーメソッドによく使われます。

### プライベートフィールド (\#)

長らくJavaScriptには「真のプライベートプロパティ」が存在せず、`_variable` のような命名規則に頼っていました。しかし、ES2019以降、`#` をプレフィックスにすることで、**クラス外から完全にアクセス不可能なフィールド**を定義できるようになりました。

```js:private_static.js
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

```js-exec:private_static.js
Deposited: 1000
Current Balance: 1000
undefined
```

## この章のまとめ

1.  **`class` 構文** はプロトタイプ継承の糖衣構文であり、`constructor` で初期化を行います。
2.  **メソッド定義** は `function` キーワードが不要で、`get` / `set` でアクセサを定義できます。
3.  **継承** は `extends` を使い、子クラスのコンストラクタ内では必ず `this` に触れる前に `super()` を呼ぶ必要があります。
4.  **`static`** で静的メソッドを、**`#`** プレフィックスでハードプライベートフィールド（外部からアクセス不可）を定義できます。

クラス構文を使うことで、コードの構造がより明確になり、他の言語の経験者にとっても読みやすいコードになります。しかし、裏側ではプロトタイプチェーンが動いていることを忘れないでください。

### 練習問題 1: シンプルなRPGキャラクター

以下の仕様を満たす `Character` クラスを作成してください。

  * `name` (名前) と `hp` (体力) をコンストラクタで受け取る。
  * `attack(target)` メソッドを持つ。実行すると `target` の `hp` を 10 減らし、コンソールに攻撃メッセージを表示する。
  * `hp` はプライベートフィールド (`#hp`) として管理し、0未満にならないようにする。現在のHPを取得するゲッター `hp` を用意する。

```js:practice7_1.js
```

```js-exec:practice7_1.js
```


### 練習問題 2: 図形の継承

以下の仕様を満たすクラスを作成してください。

  * 親クラス `Shape`: コンストラクタで `color` を受け取る。`info()` メソッドを持ち、「色: [color]」を返す。
  * 子クラス `Circle`: `Shape` を継承。コンストラクタで `color` と `radius` (半径) を受け取る。`info()` メソッドをオーバーライドし、「[親のinfo], 半径: [radius]」を返す。
  * それぞれのインスタンスを作成し、`info()` の結果を表示する。

```js:practice7_2.js
```

```js-exec:practice7_2.js
```

