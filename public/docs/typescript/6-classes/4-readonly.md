---
id: typescript-classes-4-readonly
title: 'readonly修飾子: クラスプロパティへの適用'
level: 2
---

## readonly修飾子: クラスプロパティへの適用

`readonly` 修飾子を付けると、そのプロパティは**読み取り専用**になります。
値の代入は「プロパティ宣言時」または「コンストラクタ内」でのみ許可されます。

```ts:readonly-modifier.ts
class Configuration {
    // 宣言時に初期化
    readonly version: string = "1.0.0";
    readonly apiKey: string;

    constructor(apiKey: string) {
        // コンストラクタ内での代入はOK
        this.apiKey = apiKey;
    }

    updateConfig() {
        // エラー: 読み取り専用プロパティに代入しようとしています
        // this.version = "2.0.0"; 
    }
}

const config = new Configuration("xyz-123");
console.log(`Version: ${config.version}, Key: ${config.apiKey}`);

// エラー: クラスの外からも変更不可
// config.apiKey = "abc-999"; 
```

```ts-exec:readonly-modifier.ts
Version: 1.0.0, Key: xyz-123
```
```js-readonly:readonly-modifier.js
```
