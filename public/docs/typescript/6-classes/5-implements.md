---
id: typescript-classes-5-implements
title: 'implements: インターフェースによるクラスの形状の強制'
level: 2
---

## implements: インターフェースによるクラスの形状の強制

第3章で学んだインターフェースは、オブジェクトの型定義だけでなく、**クラスが特定の実装を持っていることを保証する（契約を結ぶ）**ためにも使われます。これを `implements` と呼びます。

```ts:implements-interface.ts
interface Printable {
    print(): void;
}

interface Loggable {
    log(message: string): void;
}

// 複数のインターフェースを実装可能
class DocumentFile implements Printable, Loggable {
    constructor(private title: string) {}

    // Printableの実装
    print() {
        console.log(`Printing document: ${this.title}...`);
    }

    // Loggableの実装
    log(message: string) {
        console.log(`[LOG]: ${message}`);
    }
}

const doc = new DocumentFile("ProjectPlan.pdf");
doc.print();
doc.log("Print job started");
```

```ts-exec:implements-interface.ts
Printing document: ProjectPlan.pdf...
[LOG]: Print job started
```
```js-readonly:implements-interface.js
```

もし `print()` メソッドを実装し忘れると、TypeScriptコンパイラは即座にエラーを出します。これにより、大規模開発での実装漏れを防げます。
