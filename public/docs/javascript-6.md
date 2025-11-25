# 第6章: オブジェクトとプロトタイプ

他の言語（Java, C\#, Pythonなど）の経験がある方にとって、JavaScriptの「オブジェクト」と「継承」のモデルは最も混乱しやすい部分の一つです。JavaScriptはクラスベースではなく、**プロトタイプベース**のオブジェクト指向言語です。

本章では、ES6（ECMAScript 2015）以降の`class`構文（第7章で扱います）の裏側で実際に何が起きているのか、その仕組みの根幹である「プロトタイプチェーン」について解説します。

## オブジェクトリテラルとプロパティ

JavaScriptにおけるオブジェクトは、基本的にはキー（プロパティ名）と値のコレクション（連想配列やハッシュマップに近いもの）です。最も一般的な生成方法は**オブジェクトリテラル** `{...}` を使うことです。

```js-repl:1
> const book = {
...   title: "JavaScript Primer",
...   "page-count": 350,  // ハイフンを含むキーは引用符が必要
...   author: {
...     name: "John Doe",
...     age: 30
...   }
... };
undefined
> book.title
'JavaScript Primer'
> book["page-count"] // 識別子として無効な文字を含む場合はブラケット記法
350
> book.author.name
'John Doe'
```

### プロパティの追加・削除

動的な言語であるJavaScriptでは、オブジェクト作成後にプロパティを追加・削除できます。

```js-repl:2
> const config = { env: "production" };
undefined
> config.port = 8080; // 追加
8080
> delete config.env;  // 削除
true
> config
{ port: 8080 }
```

## メソッドと this（復習）

オブジェクトのプロパティには関数も設定できます。これを**メソッド**と呼びます。
第5章で学んだ通り、メソッド呼び出しにおける `this` は、「ドットの左側にあるオブジェクト（レシーバ）」を指します。

```js-repl:3
> const counter = {
...   count: 0,
...   increment: function() {
...     this.count++;
...     return this.count;
...   },
...   // ES6からの短縮記法（推奨）
...   reset() {
...     this.count = 0;
...   }
... };
undefined
> counter.increment();
1
> counter.increment();
2
> counter.reset();
undefined
> counter.count
0
```

## プロトタイプとは何か？

ここからが本章の核心です。JavaScriptのすべてのオブジェクトは、自身の親となる別のオブジェクトへの隠されたリンクを持っています。このリンク先のオブジェクトを**プロトタイプ**と呼びます。

オブジェクトからプロパティを読み取ろうとしたとき、そのオブジェクト自身がプロパティを持っていなければ、JavaScriptエンジンは自動的にプロトタイプを探しに行きます。

### `__proto__` と `Object.getPrototypeOf`

歴史的経緯により、多くのブラウザで `obj.__proto__` というプロパティを通じてプロトタイプにアクセスできますが、現在の標準的な方法は `Object.getPrototypeOf(obj)` です。

```js-repl:4
> const arr = [1, 2, 3];
undefined
> // 配列の実体はオブジェクトであり、Array.prototypeを継承している
> Object.getPrototypeOf(arr) === Array.prototype
true
> // Array.prototypeの親はObject.prototype
> Object.getPrototypeOf(Array.prototype) === Object.prototype
true
> // Object.prototypeの親はnull（チェーンの終端）
> Object.getPrototypeOf(Object.prototype)
null
```

## プロトタイプチェーンによる継承の仕組み

あるオブジェクトのプロパティにアクセスした際、JavaScriptは以下の順序で探索を行います。

1.  そのオブジェクト自身（Own Property）が持っているか？
2.  持っていなければ、そのオブジェクトのプロトタイプが持っているか？
3.  それでもなければ、プロトタイプのプロトタイプが持っているか？
4.  `null` に到達するまで繰り返し、見つからなければ `undefined` を返す。

この連鎖を**プロトタイプチェーン**と呼びます。クラス継承のように型定義をコピーするのではなく、**リンクを辿って委譲（Delegation）する**仕組みです。

以下のコードで、具体的な動作を確認してみましょう。

```js:prototype_chain.js
const animal = {
    eats: true,
    walk() {
        console.log("Animal walks");
    }
};

const rabbit = {
    jumps: true,
    __proto__: animal // 注意: __proto__への代入は学習目的以外では非推奨
};

const longEar = {
    earLength: 10,
    __proto__: rabbit
};

// 1. longEar自身は walk を持っていない -> rabbitを見る
// 2. rabbitも walk を持っていない -> animalを見る
// 3. animal が walk を持っている -> 実行
longEar.walk(); 

// 自身のプロパティ
console.log(`Jumps? ${longEar.jumps}`); // rabbitから取得
console.log(`Eats? ${longEar.eats}`);   // animalから取得

// プロパティの追加（シャドーイング）
// longEar自身に walk を追加すると、animalの walk は隠蔽される
longEar.walk = function() {
    console.log("LongEar walks simply");
};

longEar.walk();
```

```js-exec:prototype_chain.js
Animal walks
Jumps? true
Eats? true
LongEar walks simply
```

## Object.create() とコンストラクタ関数

`__proto__` を直接操作するのはパフォーマンスや標準化の観点から推奨されません。プロトタイプを指定してオブジェクトを生成する正しい方法は2つあります。

### 1\. Object.create()

指定したオブジェクトをプロトタイプとする新しい空のオブジェクトを生成します。

```js-repl:5
> const proto = { greet: function() { return "Hello"; } };
undefined
> const obj = Object.create(proto);
undefined
> obj.greet();
'Hello'
> Object.getPrototypeOf(obj) === proto
true
```

### 2\. コンストラクタ関数（new演算子）

ES6の `class` が登場する前、JavaScriptでは関数をコンストラクタとして使用し、`new` 演算子を使ってインスタンスを生成していました。これは現在でも多くのライブラリの内部で使用されている重要なパターンです。

  * 関数オブジェクトは `prototype` という特別なプロパティを持っています（`__proto__`とは別物です）。
  * `new Func()` すると、作られたインスタンスの `__proto__` に `Func.prototype` がセットされます。

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
>   * `obj.__proto__`: オブジェクトの実の親（リンク先）。
>   * `Func.prototype`: その関数を `new` したときに、生成されるインスタンスの `__proto__` に代入される**テンプレート**。

## この章のまとめ

1.  JavaScriptはクラスベースではなく、**プロトタイプベース**の継承を行う。
2.  オブジェクトは隠しプロパティ（`[[Prototype]]`）を持ち、プロパティが見つからない場合にそこを探索する（プロトタイプチェーン）。
3.  `Object.create(proto)` は、特定のプロトタイプを持つオブジェクトを直接生成する。
4.  コンストラクタ関数と `new` 演算子を使うと、`Func.prototype` を親に持つインスタンスを生成できる。これがJavaなどの「クラス」に近い振る舞いを模倣する仕組みである。

## 練習問題1: 基本的なプロトタイプ継承

`Object.create()` を使用して、以下の要件を満たすコードを書いてください。

1.  `robot` オブジェクトを作成し、`battery: 100` というプロパティと、バッテリーを10減らして残量を表示する `work` メソッドを持たせる。
2.  `robot` をプロトタイプとする `cleaningRobot` オブジェクトを作成する。
3.  `cleaningRobot` 自身に `type: "cleaner"` というプロパティを追加する。
4.  `cleaningRobot.work()` を呼び出し、正しく動作（プロトタイプチェーンの利用）を確認する。

```js:practice6_1.js
```

```js-exec:practice6_1.js
```

### 練習問題2: コンストラクタ関数

コンストラクタ関数 `Item` を作成してください。

1.  `Item` は引数 `name` と `price` を受け取り、プロパティとして保持する。
2.  `Item.prototype` に `getTaxIncludedPrice` メソッドを追加する。これは税率10%を加えた価格を返す。
3.  `new Item("Apple", 100)` でインスタンスを作成し、税込価格が110になることを確認する。

```js:practice6_2.js
```

```js-exec:practice6_2.js
```

