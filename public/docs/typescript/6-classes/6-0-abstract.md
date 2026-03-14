---
id: typescript-classes-abstract
title: '抽象クラス (abstract): 継承専用の基底クラス'
level: 2
question:
  - 抽象クラスはなぜ直接インスタンス化できないのですか？
  - 抽象メソッドの中身を書かないのはなぜですか？
  - 抽象クラスを使うことで、具体的にどのような設計上のメリットがありますか？
  - 抽象クラスとインターフェースは、何が違いますか？
  - 抽象クラスを継承するクラスで、抽象メソッドを実装しなかったらどうなりますか？
---

## 抽象クラス (abstract): 継承専用の基底クラス

「インスタンス化はさせたくないが、共通の機能を継承させたい」場合や、「メソッドの名前だけ決めておいて、具体的な処理はサブクラスに任せたい」場合に **抽象クラス (`abstract class`)** を使用します。

  * `abstract` クラス: `new` で直接インスタンス化できません。
  * `abstract` メソッド: 実装（中身）を持ちません。継承先のクラスで必ず実装する必要があります。

```ts:abstract-class.ts
abstract class Shape {
    constructor(protected color: string) {}

    // 具体的な実装を持つメソッド
    describe(): void {
        console.log(`This is a ${this.color} shape.`);
    }

    // 抽象メソッド（署名のみ定義）
    // サブクラスで必ず getArea を実装しなければならない
    abstract getArea(): number;
}

class Circle extends Shape {
    constructor(color: string, private radius: number) {
        super(color);
    }

    // 抽象メソッドの実装
    getArea(): number {
        return Math.PI * this.radius ** 2;
    }
}

// const shape = new Shape("red"); // エラー: 抽象クラスはインスタンス化できない

const circle = new Circle("blue", 5);
circle.describe(); // 親クラスのメソッド
console.log(`Area: ${circle.getArea().toFixed(2)}`); // 実装したメソッド
```

```ts-exec:abstract-class.ts
This is a blue shape.
Area: 78.54
```
```js-readonly:abstract-class.js
```
