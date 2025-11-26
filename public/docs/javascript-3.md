# 第3章: 制御構文

他の言語での開発経験がある方にとって、JavaScriptの制御構文の多くは馴染み深いものでしょう。しかし、JavaScript特有の「真偽値の評価（Truthy/Falsy）」や「反復処理（Iteration）の種類の多さ」は、バグを生みやすいポイントでもあります。

この章では、構文そのものだけでなく、JavaScriptならではの挙動やベストプラクティスに焦点を当てて解説します。

## 条件分岐 (if, switch)

### if文とTruthy / Falsy

基本的な `if` 文の構造はC言語やJavaと同様です。しかし、条件式における評価はJavaScript特有の**Truthy（真と見なされる値）**と**Falsy（偽と見なされる値）**の概念を理解する必要があります。

厳密な `true` / `false` だけでなく、あらゆる値が条件式の中で真偽判定されます。

**Falsyな値（falseとして扱われるもの）:**

  * `false`
  * `0`, `-0`, `0n` (BigInt)
  * `""` (空文字)
  * `null`
  * `undefined`
  * `NaN`

**Truthyな値（trueとして扱われるもの）:**

  * 上記Falsy以外すべて
  * **注意:** 空の配列 `[]` や 空のオブジェクト `{}` は **Truthy** です（Pythonなどの経験者は注意が必要です）。
  * 文字列の `"0"` や `"false"` もTruthyです。

```js-repl:1
> if (0) { 'True'; } else { 'False'; }
'False'

> if ("") { 'True'; } else { 'False'; }
'False'

> if ([]) { 'True'; } else { 'False'; }  // 空配列は真！
'True'

> const user = { name: "Alice" };
> if (user) { `Hello ${user.name}`; }
'Hello Alice'
```

### switch文

`switch` 文も標準的ですが、比較が **厳密等価演算子 (`===`)** で行われる点に注意してください。型変換は行われません。

```js:switch_example.js
const status = "200"; // 文字列

switch (status) {
    case 200: // 数値の200と比較 -> false
        console.log("OK (Number)");
        break;
    case "200": // 文字列の"200"と比較 -> true
        console.log("OK (String)");
        break;
    default:
        console.log("Unknown status");
}
```

```js-exec:switch_example.js
OK (String)
```

## 繰り返し (for, while)

`while`, `do...while`, および古典的な `for` ループは、C/Java/C++等の構文とほぼ同じです。

### 古典的な for ループ

```js-repl:2
> for (let i = 0; i < 3; i++) { console.log(i); }
0
1
2
```

### while ループ

```js-repl:3
> let count = 0;
> while (count < 3) { console.log(count++); }
0
1
2
```

## イテレーション: for...of と for...in の違い

現代のJavaScript開発において、最も重要なのがこの2つのループの使い分けです。これらは似ていますが、役割が明確に異なります。

### for...in ループ（プロパティ名の列挙）

`for...in` はオブジェクトの **キー（プロパティ名）** を列挙するために設計されています。
配列に対して使用すると、インデックス（"0", "1", ...）が文字列として返ってくるだけでなく、プロトタイプチェーン上のプロパティまで列挙してしまうリスクがあるため、**配列への使用は推奨されません**。

```js:for_in_example.js
const user = {
    name: "Bob",
    age: 30,
    role: "admin"
};

// オブジェクトのキーを列挙する
for (const key in user) {
    console.log(`${key}: ${user[key]}`);
}

// 配列に対する for...in（非推奨の例）
const colors = ["Red", "Green"];
Array.prototype.badProp = "Do not do this"; // プロトタイプ汚染のシミュレーション

console.log("--- Array via for...in ---");
for (const index in colors) {
    console.log(index); // "0", "1", "badProp" が出力される可能性がある
}
```

```js-exec:for_in_example.js
name: Bob
age: 30
role: admin
--- Array via for...in ---
0
1
badProp
```

### for...of ループ（反復可能オブジェクトの走査）

ES2015 (ES6) で導入された `for...of` は、**値（Values）** を反復します。
配列、文字列、Map、Setなどの **Iterable（反復可能）** なオブジェクトに対して使用します。配列の中身を順番に処理したい場合は、こちらが正解です。

```js:for_of_example.js
const languages = ["JavaScript", "Python", "Go"];

// 配列の値を直接取得できる
for (const lang of languages) {
    console.log(lang);
}

// 文字列もIterable
const word = "AI";
for (const char of word) {
    console.log(char);
}
```

```js-exec:for_of_example.js
JavaScript
Python
Go
A
I
```

### 使い分けのまとめ

| 構文 | 取得するもの | 対象 | 推奨ユースケース |
| :--- | :--- | :--- | :--- |
| **`for...in`** | **キー (Key)** | Object | オブジェクトのプロパティ調査 |
| **`for...of`** | **値 (Value)** | Array, String, Map, Set | 配列やリストデータの処理 |

> **Tips:** オブジェクトの中身を `for...of` で回したい場合は、`Object.keys()`, `Object.values()`, `Object.entries()` を使うのがモダンな手法です。

```js-repl:4
> const obj = { a: 1, b: 2 };
> for (const [key, val] of Object.entries(obj)) { console.log(key, val); }
a 1
b 2
```

## 例外処理 (try...catch...finally)

JavaScriptの例外処理は `try...catch...finally` 構文を使用します。

### 基本的なエラーハンドリング

実行時にエラーが発生すると、処理が中断され `catch` ブロックに移行します。

```js:try_catch.js
function parseJson(jsonString) {
    try {
        const result = JSON.parse(jsonString);
        console.log("パース成功:", result);
        return result;
    } catch (e) {
        // エラーオブジェクトが e に入る
        console.error("パース失敗:", e.name, e.message);
    } finally {
        console.log("処理終了（成功・失敗に関わらず実行）");
    }
}

parseJson('{"valid": true}');
console.log("---");
parseJson('Invalid JSON');
```

```js-exec:try_catch.js
パース成功: { valid: true }
処理終了（成功・失敗に関わらず実行）
---
パース失敗: SyntaxError Unexpected token I in JSON at position 0
処理終了（成功・失敗に関わらず実行）
```

### throw について

JavaScriptでは `throw` で例外を投げることができます。`Error` オブジェクトを投げるのが一般的ですが、技術的には文字列や数値など、任意の値を投げることが可能です（ただし、スタックトレースが取れなくなるため推奨されません）。

```js-repl:5
> try { throw new Error("Something went wrong"); } catch (e) { console.log(e.message); }
Something went wrong

> // プリミティブ値を投げることも可能だが非推奨
> try { throw "Just a string"; } catch (e) { console.log(typeof e, e); }
string Just a string
```

## この章のまとめ

  * **条件分岐:** `if` 文での `[]` や `{}` は Truthy であることに注意。`switch` は厳密等価 (`===`) で判定される。
  * **繰り返し:** 古典的な `for`, `while` は他のC系言語と同じ。
  * **for...in:** オブジェクトの **キー** を列挙する。配列には使わないこと。
  * **for...of:** 配列やコレクションの **値** を反復する。リスト処理の標準。
  * **例外処理:** `try...catch...finally` で行う。`throw` は任意の値を投げられるが、通常は `Error` オブジェクトを使用する。

### 練習問題1: 配列のフィルタリングと集計

以下の数値が入った配列 `numbers` があります。
`for...of` ループを使用して、**偶数かつ10より大きい数値** だけを抽出し、その合計値を計算してコンソールに出力するプログラムを書いてください。

```js:practice3_1.js
const numbers = [5, 12, 8, 20, 7, 3, 14, 30];
// ここにコードを書く
```

```js-exec:practice3_1.js
```

### 問題 2: 簡易コマンドディスパッチャ

以下の仕様を満たす関数 `executeCommand(command)` を `switch` 文と `try...catch` を用いて作成してください。

1.  引数 `command` は文字列を受け取る。
2.  `"start"` の場合、"System starting..." を出力。
3.  `"stop"` の場合、"System stopping..." を出力。
4.  それ以外の文字列の場合、`Error` オブジェクトを `throw` する（メッセージは "Unknown command"）。
5.  `try...catch` ブロックを用いてこの関数を呼び出し、エラーが発生した場合は "Error caught: Unknown command" のように出力する。

**ヒント:** `command` が `null` や `undefined` の場合もエラーとして処理されるように実装してください。

```js:practice3_2.js
function executeCommand(command) {

}
```

```js-exec:practice3_2.js
```
