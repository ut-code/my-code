---
id: typescript-combining-types-1-literal
title: Literal型 (リテラル型)
level: 2
---

## Literal型 (リテラル型)

`string` や `number` は「あらゆる文字列」や「あらゆる数値」を受け入れますが、**「特定の値だけ」**を許可したい場合があります。これをLiteral型（リテラル型）と呼びます。

通常、Literal型は単独で使うよりも、Union型と組み合わせて**「決まった選択肢のいずれか」**を表現するのによく使われます（Enumの代わりとしてもよく利用されます）。

```ts:literal-types.ts
// 文字列リテラル型とUnion型の組み合わせ
type TrafficLight = 'red' | 'yellow' | 'green';

let currentLight: TrafficLight = 'red';

// currentLight = 'blue'; // Error: Type '"blue"' is not assignable to type 'TrafficLight'.

// 数値リテラルも可能
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
let dice: DiceRoll = 3;

console.log(`Light: ${currentLight}, Dice: ${dice}`);
```

```ts-exec:literal-types.ts
Light: red, Dice: 3
```
```js-readonly:literal-types.js
```
