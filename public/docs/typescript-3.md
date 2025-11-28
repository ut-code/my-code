# 第3章: オブジェクト、インターフェース、型エイリアス

JavaScriptでは、オブジェクトはデータを扱うための中心的な存在です。TypeScriptにおいてもそれは変わりませんが、JavaScriptの自由度に「型」という制約を加えることで、開発時の安全性を劇的に高めることができます。

この章では、オブジェクトの形状（Shape）を定義するための主要な方法である**型エイリアス（type）**と**インターフェース（interface）**について学びます。

## オブジェクトの型付け: インラインでの定義

最も基本的な方法は、変数宣言時に直接オブジェクトの構造（型）を記述する方法です。これを「インラインの型定義」や「オブジェクトリテラル型」と呼びます。

```ts:inline-object.ts
// 変数名の後ろに : { プロパティ名: 型; ... } を記述します
const book: { title: string; price: number; isPublished: boolean } = {
  title: "TypeScript入門",
  price: 2500,
  isPublished: true,
};

console.log(`Title: ${book.title}, Price: ${book.price}`);
```

```ts-exec:inline-object.ts
Title: TypeScript入門, Price: 2500
```
```js-readonly:inline-object.js
```

この方法はシンプルですが、同じ構造を持つオブジェクトを複数作成する場合、毎回型定義を書く必要があり、コードが冗長になります。そこで登場するのが「型に名前を付ける」機能です。

## 型エイリアス (type): 型に名前を付ける

**型エイリアス（Type Alias）**を使用すると、特定の型定義に名前を付け、それを再利用することができます。JavaScriptの経験がある方にとって、これは「型の変数」を作るようなものだとイメージしてください。

キーワードは `type` です。慣習として型名には **PascalCase**（大文字始まり）を使用します。

```ts:type-alias.ts
// User型を定義
type User = {
  name: string;
  age: number;
  email: string;
};

// 定義したUser型を使用
const user1: User = {
  name: "Tanaka",
  age: 28,
  email: "tanaka@example.com",
};

const user2: User = {
  name: "Suzuki",
  age: 34,
  email: "suzuki@example.com",
};

// 関数の引数としても利用可能
function greet(user: User): string {
  return `Hello, ${user.name}!`;
}

console.log(greet(user1));
```

```ts-exec:type-alias.ts
Hello, Tanaka!
```

```js-readonly:type-alias.js
```

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

## type vs interface: 使い分けの基本的なガイドライン

「`type` と `interface` のどちらを使うべきか？」は、TypeScriptにおける最大の論点の一つです。
現在のTypeScriptでは機能的な差は非常に少なくなっていますが、基本的な使い分けのガイドラインは以下の通りです。

| 特徴 | type (型エイリアス) | interface (インターフェース) |
| :--- | :--- | :--- |
| **主な用途** | プリミティブ、ユニオン型（第5章で解説）、タプル、関数の型など、**あらゆる型**に名前を付ける。 | **オブジェクトの構造**やクラスの実装ルールを定義する。 |
| **拡張性** | 交差型 (`&`) を使って拡張する。 | `extends` キーワードで継承できる。また、同名のinterfaceを定義すると自動でマージされる（Declaration Merging）。 |
| **推奨シーン** | アプリケーション開発全般、複雑な型の組み合わせ。 | ライブラリ開発（拡張性を残すため）、オブジェクト指向的な設計。 |

**結論としての指針:**
初心者のうちは、**「オブジェクトの定義には `interface`、それ以外（単純な型や複雑な型の合成）には `type`」** というルールで始めるのが無難です。
あるいは、最近のトレンドとして「一貫して `type` を使う」というチームも増えています。重要なのは**プロジェクト内で統一すること**です。

## オプショナルなプロパティ (?)

オブジェクトによっては、特定のプロパティが存在しない（省略可能である）場合があります。
プロパティ名の後ろに `?` を付けることで、そのプロパティを **オプショナル（任意）** に設定できます。

```ts:optional-properties.ts
interface UserProfile {
  username: string;
  avatarUrl?: string; // ? があるので、このプロパティはなくてもエラーにならない
}

const profileA: UserProfile = {
  username: "user_a",
  avatarUrl: "https://example.com/a.png",
};

const profileB: UserProfile = {
  username: "user_b",
  // avatarUrl は省略可能
};

console.log(profileA);
console.log(profileB);
```

```ts-exec:optional-properties.ts
{ username: 'user_a', avatarUrl: 'https://example.com/a.png' }
{ username: 'user_b' }
```
```js-readonly:optional-properties.js
```

この場合、`avatarUrl` の型は実質的に `string | undefined`（文字列 または undefined）として扱われます。

## 読み取り専用プロパティ (readonly)

オブジェクトのプロパティを初期化した後に変更されたくない場合、`readonly` 修飾子を使用します。これは特に、IDや設定値など、不変であるべきデータを扱う際に有用です。

```ts:readonly-properties.ts
type Product = {
  readonly id: number; // 書き換え不可
  name: string;        // 書き換え可能
  price: number;
};

const item: Product = {
  id: 101,
  name: "Laptop",
  price: 98000
};

item.price = 95000; // OK: 通常のプロパティは変更可能

// 以下の行はコンパイルエラーになります
// item.id = 102; // Error: Cannot assign to 'id' because it is a read-only property.

console.log(item);
```

```ts-exec:readonly-properties.ts
{ id: 101, name: 'Laptop', price: 95000 }
```
```js-readonly:readonly-properties.js
```

注意点として、`readonly` はあくまで TypeScript のコンパイル時のチェックです。実行時の JavaScript コードでは通常のオブジェクトとして振る舞うため、無理やり書き換えるコードが混入すると防げない場合があります（ただし、TSを使っている限りはその前にエラーで気づけます）。

## この章のまとめ

  * **インライン定義**: `{ key: type }` でその場限りの型定義が可能。
  * **型エイリアス (`type`)**: 型定義に名前を付けて再利用しやすくする。柔軟性が高い。
  * **インターフェース (`interface`)**: オブジェクトの構造を定義することに特化している。
  * **オプショナル (`?`)**: プロパティを必須ではなく任意にする。
  * **読み取り専用 (`readonly`)**: プロパティの再代入を禁止し、不変性を保つ。

### 練習問題 1: 商品在庫管理

以下の条件を満たす `Item` インターフェースを定義し、そのオブジェクトを作成してください。

1.  `id` は数値で、読み取り専用 (`readonly`) であること。
2.  `name` は文字列であること。
3.  `price` は数値であること。
4.  `description` は文字列だが、省略可能 (`?`) であること。
5.  作成したオブジェクトの `price` を変更し、コンソールに出力してください。

```ts:practice3_1.ts
```
```ts-exec:practice3_1.ts
```
```js-readonly:practice3_1.js
```

### 練習問題 2: ユーザー情報の統合

以下の2つの型エイリアスを定義してください。

1.  `Contact`: `email` (string) と `phone` (string) を持つ。
2.  `Employee`: `id` (number), `name` (string), `contact` (`Contact`型) を持つ。
      * つまり、`Employee` の中に `Contact` 型がネスト（入れ子）されている状態です。
3.  この `Employee` 型を使って、あなたの情報を表現する変数を作成してください。

```ts:practice3_2.ts
```
```ts-exec:practice3_2.ts
```
```js-readonly:practice3_2.js
```
