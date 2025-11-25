# 第8章: 配列とイテレーション

他の言語経験者にとって、JavaScriptの配列は「動的配列」や「リスト」、「ベクター」に近い存在です。サイズは可変であり、異なるデータ型を混在させることも可能です（通常は同じ型で統一しますが）。

本章では、基本的な操作から、モダンなJavaScript開発において必須となる「宣言的なデータ処理」（`map`, `filter`, `reduce`など）に焦点を当てます。従来の`for`ループよりもこれらのメソッドが好まれる理由と使い方を習得しましょう。

## 配列リテラルと基本的な操作

JavaScriptの配列は`Array`オブジェクトですが、通常はリテラル `[]` を使用して生成します。
基本的な操作として、スタック操作（`push`, `pop`）やキュー操作に近いこと（`shift`, `unshift`）、そして万能な要素操作メソッド`splice`があります。

### 基本操作 (REPL)

```js-repl:1
> const fruits = ['Apple', 'Banana'];
undefined
> // 末尾に追加 (push)
> fruits.push('Orange');
3
> fruits
[ 'Apple', 'Banana', 'Orange' ]

> // 末尾から削除 (pop)
> const last = fruits.pop();
undefined
> last
'Orange'

> // 先頭に追加 (unshift)
> fruits.unshift('Grape');
3
> fruits
[ 'Grape', 'Apple', 'Banana' ]

> // インデックスによるアクセス
> fruits[1]
'Apple'
```

### 破壊的な操作: splice

`splice`は要素の削除、置換、挿入をすべて行える強力なメソッドですが、**元の配列を変更（破壊）する**点に注意が必要です。

```js-repl:2
> const numbers = [1, 2, 3, 4, 5];
undefined
> // インデックス1から、2つの要素を削除し、そこに99, 100を挿入
> numbers.splice(1, 2, 99, 100);
[ 2, 3 ]
> numbers
[ 1, 99, 100, 4, 5 ]
```

## スプレッド構文 (...) とデストラクチャリング（分割代入）

モダンJavaScript（ES2015+）では、配列の操作をより簡潔に記述するための構文が導入されました。これらはReactやVueなどのフレームワークでも多用されます。

### スプレッド構文 (...)

配列を展開する構文です。配列の結合や、\*\*浅いコピー（Shallow Copy）\*\*の作成によく使われます。

```js-repl:3
> const part1 = [1, 2];
undefined
> const part2 = [3, 4];
undefined
> // 配列の結合（新しい配列を作成）
> const combined = [...part1, ...part2];
undefined
> combined
[ 1, 2, 3, 4 ]

> // 配列のコピー（新しい参照を作成）
> const copy = [...part1];
undefined
> copy === part1
false
```

### デストラクチャリング（分割代入）

配列から要素を取り出して変数に代入する操作を簡潔に書くことができます。

```js-repl:4
> const users = ['Alice', 'Bob', 'Charlie'];
undefined
> // 1つ目と2つ目の要素を変数に代入
> const [first, second] = users;
undefined
> first
'Alice'
> second
'Bob'

> // 3つ目だけを取り出す（最初の2つはスキップ）
> const [, , third] = users;
undefined
> third
'Charlie'

> // 変数の値を入れ替える（スワップ）テクニック
> let a = 1;
> let b = 2;
> [a, b] = [b, a];
[ 2, 1 ]
> a
2
```

## 高階関数によるイテレーション

JavaScriptでは、`for`文や`while`文を書く頻度は減っています。代わりに、配列のメソッドとして提供される**高階関数**（関数を引数に取る関数）を使用して、処理の意図（変換、抽出、集約など）を明確にします。

主なメソッドは以下の通りです。

  * **`forEach`**: 単なる反復処理（戻り値なし）。副作用（ログ出力やDB保存など）を起こすために使う。
  * **`map`**: 全要素を変換し、**新しい配列**を返す。
  * **`filter`**: 条件に一致する要素のみを抽出し、**新しい配列**を返す。
  * **`reduce`**: 要素を一つずつ処理して、**単一の値**（合計、オブジェクトなど）に集約する。

以下は、これらのメソッドを使って商品リストを処理するスクリプトです。

```js:shopping_cart.js
const cart = [
  { id: 1, name: 'Laptop', price: 1000, category: 'Electronics' },
  { id: 2, name: 'Mouse', price: 25, category: 'Electronics' },
  { id: 3, name: 'Coffee', price: 5, category: 'Food' },
  { id: 4, name: 'Keyboard', price: 100, category: 'Electronics' },
];

console.log('--- 1. map: 商品名のリストを作成 ---');
const itemNames = cart.map(item => item.name);
console.log(itemNames);

console.log('\n--- 2. filter: 電子機器(Electronics)のみ抽出 ---');
const electronics = cart.filter(item => item.category === 'Electronics');
console.log(electronics);

console.log('\n--- 3. reduce: 合計金額を計算 ---');
// 第2引数の 0 はアキュムレータ(sum)の初期値
const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
console.log(`Total: $${totalPrice}`);

console.log('\n--- 4. メソッドチェーン（組み合わせ） ---');
// 電子機器の価格のみを抽出して合計する
const electronicsTotal = cart
  .filter(item => item.category === 'Electronics')
  .map(item => item.price)
  .reduce((acc, price) => acc + price, 0);

console.log(`Electronics Total: $${electronicsTotal}`);
```

実行結果:

```js-exec:shopping_cart.js
--- 1. map: 商品名のリストを作成 ---
[ 'Laptop', 'Mouse', 'Coffee', 'Keyboard' ]

--- 2. filter: 電子機器(Electronics)のみ抽出 ---
[
  { id: 1, name: 'Laptop', price: 1000, category: 'Electronics' },
  { id: 2, name: 'Mouse', price: 25, category: 'Electronics' },
  { id: 4, name: 'Keyboard', price: 100, category: 'Electronics' }
]

--- 3. reduce: 合計金額を計算 ---
Total: $1130

--- 4. メソッドチェーン（組み合わせ） ---
Electronics Total: $1125
```

> **Note:** `map`や`filter`は元の配列を変更せず（イミュータブル）、新しい配列を返します。これにより、予期せぬ副作用を防ぐことができます。

## その他の便利なメソッド：find, some, every

特定の要素を探したり、条件チェックを行ったりする場合に特化したメソッドです。これらもコールバック関数を受け取ります。

  * **`find`**: 最初に見つかった要素自体を返す（見つからなければ `undefined`）。
  * **`findIndex`**: 最初に見つかった要素のインデックスを返す（見つからなければ `-1`）。
  * **`some`**: 条件を満たす要素が**一つでもあれば** `true` を返す。
  * **`every`**: **すべての要素**が条件を満たせば `true` を返す。

```js-repl:5
> const scores = [85, 92, 45, 78, 90];
undefined

> // 最初の合格者（80点以上）を探す
> const starStudent = scores.find(score => score >= 90);
undefined
> starStudent
92

> // 赤点（50点未満）があるか？ (some)
> const hasFailure = scores.some(score => score < 50);
undefined
> hasFailure
true

> // 全員が合格（40点以上）か？ (every)
> const allPassed = scores.every(score => score >= 40);
undefined
> allPassed
true
```

## この章のまとめ

  * 配列は動的で、`push`/`pop`などのメソッドで伸縮可能です。
  * `splice`は配列を直接変更（破壊）するため、使用には注意が必要です。
  * スプレッド構文 `...` と分割代入を使うと、配列のコピー、結合、要素の抽出が宣言的に記述できます。
  * ループ処理には `for` 文よりも高階関数（`map`, `filter`, `reduce`）を使用することが推奨されます。これらは処理の意図を明確にし、メソッドチェーンによる可読性の向上に寄与します。
  * 検索や検証には `find`, `some`, `every` を活用しましょう。

### 練習問題 1: データの加工

以下の数値配列があります。
`const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];`

この配列に対して、以下の処理を行うコードを書いてください（メソッドチェーンを使用しても構いません）。

1.  偶数のみを取り出す。
2.  取り出した偶数をそれぞれ2乗する。
3.  結果の配列をコンソールに表示する。

```js:practice8_1.js
```

```js-exec:practice8_1.js
```


### 練習問題 2: 集計処理

以下のユーザーリストから「アクティブ（`active: true`）なユーザーの年齢の平均値」を計算して表示してください。
（ヒント: まずアクティブなユーザーを絞り込み、次に年齢の合計と人数を使って平均を算出します）

```js:practice8_2.js
const users = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 30, active: false },
  { name: 'Charlie', age: 35, active: true },
  { name: 'Dave', age: 40, active: false }
];

```

```js-exec:practice8_2.js
```

