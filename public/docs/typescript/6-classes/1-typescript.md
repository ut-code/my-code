---
id: typescript-classes-1-typescript
title: 'TypeScriptのクラス: プロパティの型定義'
level: 2
---

## TypeScriptのクラス: プロパティの型定義

JavaScriptでは、コンストラクタ内で `this.x = 10` と書くだけでプロパティを追加できましたが、TypeScriptでは**クラスの直下（ボディ）でプロパティとその型を宣言する**必要があります。

これを省略すると、「プロパティ 'x' は型 'ClassName' に存在しません」というエラーになります。

```ts:property-definition.ts
class Product {
    // プロパティの宣言（必須）
    id: number;
    name: string;
    price: number;

    constructor(id: number, name: string, price: number) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    getDetail(): string {
        return `ID:${this.id} ${this.name} (${this.price}円)`;
    }
}

const item = new Product(1, "TypeScript入門書", 2500);
console.log(item.getDetail());
```

```ts-exec:property-definition.ts
ID:1 TypeScript入門書 (2500円)
```
```js-readonly:property-definition.js
```

> **注意:** `strictPropertyInitialization` 設定（tsconfig.json）が有効な場合、プロパティを宣言したもののコンストラクタで初期化していないとエラーになります。初期化を後で行うことが確実な場合は `name!: string;` のように `!` を付けて警告を抑制することもあります。
