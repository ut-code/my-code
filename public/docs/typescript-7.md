# 第7章: クラスとアクセス修飾子

JavaScript（ES6以降）に慣れ親しんでいる方であれば、`class`構文自体はすでにご存知かと思います。TypeScriptにおけるクラスは、JavaScriptのクラス機能をベースにしつつ、**型安全性**と**アクセス制御（カプセル化）**を強化するための機能が追加されています。

本章では、TypeScript特有のクラスの書き方、特にプロパティの定義、アクセス修飾子、そしてインターフェースとの連携について学びます。

## JSのクラス構文の復習: constructor, extends

まずは、基本的なJavaScriptのクラス構文をTypeScriptのファイルとして書いてみましょう。TypeScriptはJavaScriptのスーパーセット（上位互換）であるため、標準的なJSの書き方もほぼそのまま動作しますが、少しだけ「型」の意識が必要です。

```ts:basic-animal.ts
class Animal {
  // TypeScriptでは、ここでプロパティ（フィールド）を宣言するのが一般的ですが、
  // JSのようにconstructor内でthis.name = nameするだけだとエラーになることがあります。
  // (詳しくは次のセクションで解説します)
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}

class Snake extends Animal {
  constructor(name: string) {
    // 派生クラスのコンストラクタでは super() の呼び出しが必須
    super(name);
  }

  move(distanceInMeters: number = 5) {
    console.log("Slithering...");
    super.move(distanceInMeters);
  }
}

const sam = new Snake("Sammy the Python");
sam.move();
```

```ts-exec:basic-animal.ts
Slithering...
Sammy the Python moved 5m.
```
```js-readonly:basic-animal.js
```

基本構造はJSと同じですが、引数に型注釈（`: string`, `: number`）が付いている点が異なります。

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

## アクセス修飾子: public, private, protected

TypeScriptには、クラスのメンバー（プロパティやメソッド）へのアクセスを制御するための3つの修飾子があります。これはJavaやC\#などの言語と同様の概念です。

1.  **`public` (デフォルト)**: どこからでもアクセス可能。
2.  **`private`**: 定義されたクラスの内部からのみアクセス可能。
3.  **`protected`**: 定義されたクラス、およびそのサブクラス（継承先）からアクセス可能。

### 従来の書き方と省略記法（パラメータプロパティ）

TypeScriptには、コンストラクタの引数にアクセス修飾子を付けることで、**「プロパティ宣言」と「代入」を同時に行う省略記法（パラメータプロパティ）**があります。実務ではこの書き方が非常によく使われます。

```ts:access-modifiers.ts
class User {
    // 通常の書き方
    public name: string;
    private _age: number; // 慣習的にprivateフィールドには_をつけることがあります

    // 省略記法（パラメータプロパティ）
    // constructor引数に修飾子をつけることで、自動的にプロパティとして定義・代入される
    constructor(name: string, age: number, protected email: string) {
        this.name = name;
        this._age = age;
        // this.email = email; // 自動で行われるため記述不要
    }

    public getProfile(): string {
        // privateやprotectedはクラス内部ではアクセス可能
        return `${this.name} (${this._age}) - ${this.email}`;
    }
}

const user = new User("Alice", 30, "alice@example.com");

console.log(user.name);         // OK (public)
console.log(user.getProfile()); // OK (public)

// 以下の行はコンパイルエラーになります
// console.log(user._age);   // Error: Property '_age' is private...
// console.log(user.email);  // Error: Property 'email' is protected...
```

```ts-exec:access-modifiers.ts
Alice
Alice (30) - alice@example.com
```

```js-readonly:access-modifiers.js
```

> **Note:** TypeScriptの `private` はあくまでコンパイル時のチェックです。JavaScriptにトランスパイルされると単なるプロパティになるため、実行時にはアクセスしようと思えばできてしまいます。厳密な実行時プライベートが必要な場合は、JavaScript標準の `#` (例: `#field`) を使用してください。

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

## この章のまとめ

  * **プロパティ定義:** TypeScriptではクラスボディ内でプロパティの宣言が必要です。
  * **アクセス修飾子:** `public`, `private`, `protected` でカプセル化を制御します。
  * **パラメータプロパティ:** コンストラクタ引数に修飾子をつけることで、宣言と初期化を簡潔に書けます。
  * **readonly:** プロパティを不変（読み取り専用）にします。
  * **implements:** クラスが特定のインターフェースの仕様を満たすことを強制します。
  * **abstract:** インスタンス化できない基底クラスや、実装を強制する抽象メソッドを定義します。

### 練習問題 1: 従業員クラスの作成

以下の要件を満たす `Employee` クラスを作成し、動作確認コードを書いてください。

1.  **プロパティ**:
      * `name` (string): パブリック
      * `id` (number): 読み取り専用
      * `salary` (number): プライベート
2.  **コンストラクタ**: 省略記法（パラメータプロパティ）を使ってこれらを初期化してください。
3.  **メソッド**:
      * `getSalaryInfo()`: "従業員 [name] の給与は [salary] です" と出力するメソッド（クラス内部からは `salary` にアクセスできることを確認）。

```ts:practice7_1.ts
```
```ts-exec:practice7_1.ts
```
```js-readonly:practice7_1.js
```

### 練習問題 2: 図形クラスの継承

以下の要件でコードを書いてください。

1.  **インターフェース `AreaCalculator`**: `calculateArea(): number` メソッドを持つ。
2.  **クラス `Rectangle`**: `AreaCalculator` を実装(`implements`)する。
      * プロパティ: `width` (number), `height` (number)
      * メソッド: `calculateArea` を実装して面積を返す。
3.  `Rectangle` のインスタンスを作成し、面積をコンソールに出力してください。

```ts:practice7_2.ts
```
```ts-exec:practice7_2.ts
```
```js-readonly:practice7_2.js
```