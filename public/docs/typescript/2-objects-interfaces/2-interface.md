---
id: typescript-objects-interfaces-2-interface
title: 'インターフェース (interface): オブジェクトの「形状」を定義する'
level: 2
---

## インターフェース (interface): オブジェクトの「形状」を定義する

オブジェクトの構造を定義するもう一つの代表的な方法が **インターフェース（interface）** です。
JavaやC\#などの言語経験がある方には馴染み深いキーワードですが、TypeScriptのインターフェースは「クラスのための契約」だけでなく、「純粋なオブジェクトの形状定義」としても頻繁に使用されます。

```ts:interface-basic.ts
// interfaceキーワードを使用（= は不要）
interface Car {
  maker: string;
  model: string;
  year: number;
}

const myCar: Car = {
  maker: "Toyota",
  model: "Prius",
  year: 2023,
};

console.log(`${myCar.maker} ${myCar.model} (${myCar.year})`);
```

```ts-exec:interface-basic.ts
Toyota Prius (2023)
```
```js-readonly:interface-basic.js
```
