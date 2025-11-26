# 第4章: 関数とクロージャ

JavaScriptにおいて関数はオブジェクトの一種です。つまり、変数に代入したり、他の関数の引数として渡したり、関数から戻り値として返したりすることができます。この柔軟性が、JavaScriptの設計パターンの核心を担っています。

## 関数の定義（関数宣言 vs 関数式）

JavaScriptには関数を定義する方法が主に2つあります。「関数宣言」と「関数式」です。これらは似ていますが、**巻き上げ（Hoisting）** の挙動が異なります。

### 1\. 関数宣言 (Function Declaration)

古くからある定義方法です。スクリプトの実行前に読み込まれるため、定義する前の行から呼び出すことができます。

```js:function_declaration.js
console.log(greet("Alice")); // 定義前でも呼び出せる

function greet(name) {
   return `Hello, ${name}!`;
}
```

```js-exec:function_declaration.js
Hello, Alice!
```

### 2\. 関数式 (Function Expression)

変数に関数を代入するスタイルです。変数の代入は実行時に行われるため、定義する前に呼び出すとエラーになります。現代のJavaScript開発では、意図しない巻き上げを防ぐためにこちら（または後述のアロー関数）が好まれる傾向にあります。

```js:function_expression.js
// 定義前に呼び出すと... ReferenceError: Cannot access 'sayHi' before initialization
// console.log(sayHi("Bob"));

const sayHi = function(name) {
  return `Hi, ${name}!`;
};

console.log(sayHi("Bob"));
```

```js-exec:function_expression.js
Hi, Bob!
```

## アロー関数 (=\>) の構文と特徴

ES2015 (ES6) で導入されたアロー関数は、関数式をより短く記述するための構文です。Javaのラムダ式やPythonのlambdaに似ていますが、いくつか独自の特徴があります。

### 基本構文

`function` キーワードを省略し、`=>` (矢印) を使って定義します。

```js:arrow_function.js
// 従来の関数式
const add = function(a, b) {
  return a + b;
};

// アロー関数
const addArrow = (a, b) => {
  return a + b;
};

console.log(addArrow(3, 5));
```

```js-exec:arrow_function.js
8
```

### 省略記法

アロー関数には強力な省略記法があります。

1.  **引数が1つの場合**: カッコ `()` を省略可能。
2.  **処理が1行でreturnする場合**: 中括弧 `{}` と `return` キーワードを省略可能（暗黙のreturn）。

```js-repl:4
> const square = x => x * x; // 引数の()とreturnを省略
> square(5);
25

> const getUser = (id, name) => ({ id: id, name: name }); // オブジェクトを返す場合は()で囲む
> getUser(1, "Gemini");
{ id: 1, name: 'Gemini' }
```

> **注意:** アロー関数は単なる短縮記法ではありません。「`this` を持たない」という重要な特徴がありますが、これについては**第5章**で詳しく解説します。

## 引数：デフォルト引数、Restパラメータ (...)

関数の柔軟性を高めるための引数の機能を見ていきましょう。

### デフォルト引数

引数が渡されなかった場合（または `undefined` の場合）に使用される初期値を設定できます。

```js:default_args.js
const connect = (host = 'localhost', port = 8080) => {
  console.log(`Connecting to ${host}:${port}...`);
};

connect();                // 両方省略
connect('127.0.0.1');     // portはデフォルト値
connect('example.com', 22); // 両方指定
```

```js-exec:default_args.js
Connecting to localhost:8080...
Connecting to 127.0.0.1:8080...
Connecting to example.com:22...
```

### Restパラメータ (残余引数)

引数の数が不定の場合、`...` を使うことで、残りの引数を**配列として**受け取ることができます。以前は `arguments` オブジェクトを使っていましたが、Restパラメータの方が配列メソッド（`map`, `reduce`など）を直接使えるため便利です。

```js:rest_params.js
const sum = (...numbers) => {
  // numbersは本物の配列 [1, 2, 3, 4, 5]
  return numbers.reduce((acc, curr) => acc + curr, 0);
};

console.log(sum(1, 2, 3));
console.log(sum(10, 20, 30, 40, 50));
```

```js-exec:rest_params.js
6
150
```

## スコープチェーンとレキシカルスコープ

JavaScriptの変数の有効範囲（スコープ）を理解するために、「レキシカルスコープ」という概念を知る必要があります。

  * **レキシカルスコープ (Lexical Scope):** 関数が「どこで呼び出されたか」ではなく、**「どこで定義されたか」**によってスコープが決まるというルールです。
  * **スコープチェーン (Scope Chain):** 変数を探す際、現在のスコープになければ、定義時の外側のスコープへと順番に探しに行く仕組みです。

```js:scope.js
const globalVar = "Global";

function outer() {
 const outerVar = "Outer";
 function inner() {
   const innerVar = "Inner";
   // innerの中からouterVarとglobalVarが見える（スコープチェーン）
   return `${globalVar} > ${outerVar} > ${innerVar}`;
 }
 return inner();
}

console.log(outer());
```

```js-exec:scope.js
Global > Outer > Inner
```

## クロージャ：関数が状態を持つ仕組み

クロージャ (Closure) は、この章の最重要トピックです。
一言で言えば、**「外側の関数のスコープにある変数を、外側の関数の実行終了後も参照し続ける関数」**のことです。

通常、関数(`createCounter`)の実行が終わると、そのローカル変数(`count`)はメモリから破棄されます。しかし、その変数を参照している内部関数(`increment`)が存在し、その内部関数が外部に返された場合、変数は破棄されずに保持され続けます。

### クロージャの実例：カウンタ

プライベートな変数を持つカウンタを作ってみましょう。

```js:closure_counter.js
const createCounter = () => {
  let count = 0; // この変数は外部から直接アクセスできない（プライベート変数的な役割）

  return () => {
    count++;
    console.log(`Current count: ${count}`);
  };
};

const counterA = createCounter(); // counterA専用のスコープ（環境）が作られる
const counterB = createCounter(); // counterB専用のスコープが別に作られる

counterA(); // 1
counterA(); // 2
counterA(); // 3

console.log("--- switching to B ---");

counterB(); // 1 (Aの状態とは独立している)
```

```js-exec:closure_counter.js
Current count: 1
Current count: 2
Current count: 3
--- switching to B ---
Current count: 1
```

### なぜクロージャを使うのか？

1.  **カプセル化 (Encapsulation):** 変数を隠蔽し、特定の関数経由でしか変更できないようにすることで、予期せぬバグを防ぎます。
2.  **状態の保持:** グローバル変数を使わずに、関数単位で永続的な状態を持てます。
3.  **関数ファクトリ:** 設定の異なる関数を動的に生成する場合に役立ちます。

## この章のまとめ

  * **関数定義:** 巻き上げが起こる「関数宣言」と、起こらない「関数式（アロー関数含む）」がある。
  * **アロー関数:** `(args) => body` の形式で記述し、`this` の挙動が従来と異なる。
  * **引数:** デフォルト引数とRestパラメータ(`...args`)で柔軟な引数処理が可能。
  * **レキシカルスコープ:** 関数は「定義された場所」のスコープを記憶する。
  * **クロージャ:** 内部関数が外部関数の変数を参照し続ける仕組み。データの隠蔽や状態保持に使われる。

## 練習問題1: アロー関数への書き換え

以下の関数宣言を、アロー関数 `isEven` に書き換えてください。ただし、省略可能な記号（カッコやreturnなど）は可能な限り省略して最短で記述してください。

```js:practice4_1.js
function isEven(n) {
  return n % 2 === 0;
}
```

```js-exec:practice4_1.js
```

### 問題2: クロージャによる掛け算生成器

`createMultiplier` という関数を作成してください。この関数は数値 `x` を引数に取り、呼び出すたびに「引数を `x` 倍して返す関数」を返します。

**使用例:**

```js:practice4_2.js
// ここに関数を作成


const double = createMultiplier(2);
console.log(double(5)); // 10

const triple = createMultiplier(3);
console.log(triple(5)); // 15
```

```js-exec:practice4_2.js
```
