# 第2章: 基本構文とデータ型

プログラミング経験者であるあなたにとって、変数の概念やデータ型の存在自体は目新しいものではありません。しかし、JavaScriptには「動的型付け」や「歴史的経緯による特殊なスコープ仕様」、「独特な型変換」といった、他言語経験者が特に躓きやすいポイントがあります。

本章では、モダンなJavaScript（ES6以降）における標準的な記述方法を中心に、レガシーな仕様との違いや、バグを生みやすい落とし穴について解説します。

## 変数宣言: let, const, var

現代のJavaScript開発において、変数宣言のルールは非常にシンプルです。
**「基本は `const`、再代入が必要な場合のみ `let` を使い、`var` は決して使わない」** これが鉄則です。

### const と let (ブロックスコープ)

ES6（2015年）で導入された `const` と `let` は、C++やJava、C\#などと同様に**ブロックスコープ**を持ちます。

  * **const**: 再代入不可能な変数を宣言します。定数だけでなく、再代入しない変数はすべてこれで宣言します。
  * **let**: 再代入可能な変数を宣言します。ループカウンタや、状態が変わる値に使用します。

### var の危険性 (関数スコープと巻き上げ)

なぜ `var` を使うべきではないのでしょうか。それは `var` が**関数スコープ**であり、意図しない変数の共有や「巻き上げ（Hoisting）」によるバグを引き起こしやすいからです。

以下のコードで、スコープの違いを確認してみましょう。

```js:scope_demo.js
function checkScope() {
    if (true) {
        var functionScoped = "I am visible outside this block";
        let blockScoped = "I am NOT visible outside this block";
        const constantValue = "I am also block scoped";
    }

    console.log("var output:", functionScoped); // 参照可能（関数スコープのため）

    try {
        console.log("let output:", blockScoped); // ReferenceError
    } catch (e) {
        console.error("let error:", e.message);
    }
}

checkScope();
```

```js-exec:scope_demo.js
var output: I am visible outside this block
let error: blockScoped is not defined
```

## データ型: プリミティブ型

JavaScriptは動的型付け言語であり、変数は特定の型に紐付きませんが、値自体は型を持っています。JavaScriptの値は大きく分けて「プリミティブ型」と「オブジェクト（参照）型」に分類されます。

プリミティブ型はイミュータブル（変更不可）であり、以下の7種類が存在します。

1.  **String**: 文字列。ES6から導入された「テンプレートリテラル（バッククォート `` ` ``）」を使うと、変数の埋め込みが容易です。
2.  **Number**: 数値。整数と浮動小数点数の区別はなく、すべて倍精度浮動小数点数（IEEE 754）として扱われます。
3.  **Boolean**: `true` または `false`。
4.  **undefined**: 「値が未定義である」ことを表す型。変数を宣言して値を代入していない状態です。
5.  **null**: 「値が存在しない」ことを意図的に示す型。
6.  **Symbol**: 一意で不変な識別子。オブジェクトのプロパティキーなどに使われます。
7.  **BigInt**: `Number`型では表現できない巨大な整数を扱います（末尾に `n` をつけます）。

### null と undefined の違い

他言語経験者にとって混乱しやすいのがこの2つです。

  * **undefined**: システム（JavaScriptエンジン）が「値がまだない」ことを示すために使うことが多い。
  * **null**: プログラマが「ここには値がない」ことを明示するために使うことが多い。

```js-repl:1
> let unassigned;
undefined
> unassigned
undefined
> let empty = null;
undefined
> typeof unassigned
'undefined'
> typeof empty // JSの有名なバグ（仕様）で 'object' が返りますが、実際はプリミティブです
'object'
```

## データ型: オブジェクト型

プリミティブ以外のすべての値は**オブジェクト（参照型）**です。これらはメモリ上のアドレス（参照）として扱われます。

### const とオブジェクトの変更

重要な点として、`const` で宣言した変数は「再代入」ができませんが、中身がオブジェクトの場合、**プロパティの変更は可能**です。これは `const` が「参照先のメモリアドレス」を固定するものであり、ヒープ領域にあるデータそのものを不変にするわけではないためです。

```js:object_mutation.js
const user = {
    name: "Alice",
    id: 1
};

// 再代入はエラーになる
// user = { name: "Bob" }; // TypeError: Assignment to constant variable.

// プロパティの変更は可能
user.name = "Bob";
console.log(user);

// 配列もオブジェクトの一種
const colors = ["Red", "Green"];
colors.push("Blue");
console.log(colors);
```

```js-exec:object_mutation.js
{ name: 'Bob', id: 1 }
[ 'Red', 'Green', 'Blue' ]
```

主なオブジェクト型には以下があります。

  * **Object**: キーと値のペアの集合（辞書、ハッシュマップに近い）。
  * **Array**: 順序付きリスト。
  * **Function**: JavaScriptでは関数もオブジェクトであり、変数に代入したり引数として渡すことができます（第一級関数）。

## 演算子と等価性 (== vs ===)

JavaScriptにおける最大の落とし穴の一つが「等価演算子」です。

### 厳密等価演算子 (===) を使う

常に `===` （および `!==`）を使用してください。これは「値」と「型」の両方が等しいかを比較します。

### 等価演算子 (==) の罠

`==` は、比較する前に**暗黙的な型変換**を行います。これにより、直感的ではない結果が生じることがあります。

```js-repl:2
> 1 === "1"   // 型が違うので false（推奨）
false
> 1 == "1"    // 文字列が数値に変換されて比較されるため true（非推奨）
true
> 0 == false  // true
true
> null == undefined // true（ここだけは例外的に許容するスタイルもあるが、基本は避ける）
true
> [] == ![]   // 非常に難解な挙動（trueになる）
true
```

## 型変換（暗黙的な型変換の罠）

JavaScriptは文脈に応じて勝手に型を変換しようとします。

### 加算演算子 (+) の挙動

`+` 演算子は、数値の加算だけでなく文字列の連結にも使われます。片方が文字列であれば、もう片方も文字列に変換されて連結されます。

```js-repl:3
> 10 + 20
30
> 10 + "20" // 数値が文字列 "10" に変換され連結される
'1020'
> "10" + 20
'1020'
> 10 - "2"  // 減算は数値計算しかないので、文字列 "2" が数値に変換される
8
```

### Falsyな値

条件式（if文など）で `false` とみなされる値を「Falsyな値」と呼びます。これ以外はすべて `true`（Truthy）として扱われます。

**Falsyな値のリスト:**

1.  `false`
2.  `0` (数値のゼロ)
3.  `-0`
4.  `0n` (BigIntのゼロ)
5.  `""` (空文字)
6.  `null`
7.  `undefined`
8.  `NaN` (Not a Number)

**注意:** 空の配列 `[]` や空のオブジェクト `{}` は **Truthy** です。

```js:falsy_check.js
const values = [0, "0", [], null, undefined, ""];

values.forEach(val => {
    if (val) {
        console.log(`Value: [${val}] is Truthy`);
    } else {
        console.log(`Value: [${val}] is Falsy`);
    }
});
```

```js-exec:falsy_check.js
Value: [0] is Falsy
Value: [0] is Truthy
Value: [] is Truthy
Value: [null] is Falsy
Value: [undefined] is Falsy
Value: [] is Falsy
```

## この章のまとめ

  * 変数は `const` をデフォルトとし、再代入が必要な場合のみ `let` を使う。`var` は使用しない。
  * プリミティブ型は値渡し、オブジェクト型（配列含む）は参照渡しである。
  * `const` で宣言したオブジェクトの中身は変更可能である。
  * 比較には必ず `===`（厳密等価演算子）を使用し、`==` による暗黙の型変換を避ける。
  * `0`, `""`, `null`, `undefined` などが「Falsyな値」として扱われることを理解する。

### 練習問題1: テンプレートリテラルと型変換

ユーザーの年齢（数値）と名前（文字列）を受け取り、自己紹介文を作成する関数を作成してください。
ただし、年齢が `null` または `undefined` の場合は「不明」と表示するようにしてください。論理和演算子 `||` または Null合体演算子 `??` を活用してみましょう。

```js:practice2_1.js
// 以下の関数を完成させてください
function introduce(name, age) {
    // ここにコードを記述
}

console.log(introduce("Tanaka", 25));
console.log(introduce("Sato", null));
```

```js-exec:practice2_1.js
My name is Tanaka and I am 25 years old.
My name is Sato and I am 不明 years old.
```

### 練習問題2: オブジェクトの操作と参照

以下のコードにはバグ（意図しない挙動）があります。
`originalList` の内容を保持したまま、新しい要素を追加した `newList` を作成したいのですが、現状では `originalList` も変更されてしまいます。
スプレッド構文 `...` などを使い、`originalList` を変更せずに `newList` を作成するように修正してください。

```js:practice2_2.js
const originalList = ["Apple", "Banana"];

// 参照コピーになっているため originalList も変わってしまう
const newList = originalList;
newList.push("Orange");

console.log("Original:", originalList); // ["Apple", "Banana"] と出力させたい
console.log("New:", newList);           // ["Apple", "Banana", "Orange"] と出力させたい
```

```js-exec:practice2_2.js
```
