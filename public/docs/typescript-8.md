# 第8章: 非同期処理とユーティリティ型

JavaScriptにおいて `Promise` や `async/await` は日常的に使用しますが、TypeScriptでは「将来どのような値が返ってくるか」を明示する必要があります。
また、既存の型を再利用して新しい型を作る「ユーティリティ型」を学ぶことで、コードの重複を劇的に減らすことができます。

## 非同期処理の型: Promise と async/await

JavaScriptでは、非同期関数の戻り値は常に `Promise` オブジェクトです。TypeScriptでは、このPromiseが**解決（Resolve）されたときに持つ値の型**をジェネリクスを使って `Promise<T>` の形式で表現します。

### 基本的な定義

  * 戻り値が文字列の場合: `Promise<string>`
  * 戻り値が数値の場合: `Promise<number>`
  * 戻り値がない（void）場合: `Promise<void>`

`async` キーワードがついた関数は、自動的に戻り値が `Promise` でラップされます。

```ts:async-fetch.ts
type User = {
  id: number;
  name: string;
  email: string;
};

// 擬似的なAPIコール関数
// 戻り値の型として Promise<User> を指定します
const fetchUser = async (userId: number): Promise<User> => {
  // 実際はfetchなどを行いますが、ここでは擬似的に遅延させて値を返します
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        name: "Yamada Taro",
        email: "taro@example.com",
      });
    }, 500);
  });
};

const main = async () => {
  console.log("Fetching data...");
  
  // awaitを使うことで、user変数の型は自動的に User 型（Promiseが解けた状態）になります
  const user = await fetchUser(1);
  
  console.log(`ID: ${user.id}`);
  console.log(`Name: ${user.name}`);
};

main();
```

```ts-exec:async-fetch.ts
Fetching data...
ID: 1
Name: Yamada Taro
```
```js-readonly:async-fetch.js
```

### エラーハンドリングと型

Promiseが拒否（Reject）される場合のエラー型は、現状のTypeScriptではデフォルトで `any` または `unknown` として扱われます（`try-catch` ブロックの `error` オブジェクトなど）。

## ユーティリティ型 (Utility Types)

TypeScriptには、既存の型定義を変換して新しい型を生成するための便利な型が標準で用意されています。これらを使うと、「一部のプロパティだけ変更したい」「全てオプショナルにしたい」といった場合に、いちいち新しい型を定義し直す必要がなくなります。

ここでは、特によく使われる4つのユーティリティ型を紹介します。

### ベースとなる型

以下の `Product` 型を例に使用します。

```ts
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}
```

### 1\. Partial\<T\>: 全てをオプショナルにする

`Partial<T>` は、型 `T` のすべてのプロパティを「必須」から「任意（Optional / `?`付き）」に変更します。データの更新処理（パッチ）などで、一部のフィールドだけ送信したい場合に便利です。

```ts:utility-partial.ts
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

// プロパティの一部だけを更新する関数
// updateDataは { name?: string; price?: number; ... } のようになります
function updateProduct(id: number, updateData: Partial<Product>) {
  console.log(`Updating product ${id} with:`, updateData);
}

// nameとpriceだけ更新（descriptionやidがなくてもエラーにならない）
updateProduct(100, {
  name: "New Product Name",
  price: 5000
});
```

```ts-exec:utility-partial.ts
Updating product 100 with: { name: 'New Product Name', price: 5000 }
```
```js-readonly:utility-partial.js
```

### 2\. Readonly\<T\>: 全てを読み取り専用にする

`Readonly<T>` は、型 `T` のすべてのプロパティを書き換え不可（readonly）にします。関数内でオブジェクトを変更されたくない場合や、ReactのState管理などで役立ちます。

```ts:utility-readonly.ts
interface Product {
  id: number;
  name: string;
  price: number;
}

const originalProduct: Product = { id: 1, name: "Pen", price: 100 };

// 変更不可のオブジェクトとして扱う
const frozenProduct: Readonly<Product> = originalProduct;

// 読み取りはOK
console.log(frozenProduct.name); 

// コンパイルエラー: 値の代入はできません
// frozenProduct.price = 200; 
```

```ts-exec:utility-readonly.ts
Pen
```
```js-readonly:utility-readonly.js
```

### 3\. Pick\<T, K\>: 特定のキーだけ抜き出す

`Pick<T, K>` は、型 `T` から `K` で指定したプロパティのみを抽出して新しい型を作ります。
「ユーザー情報全体から、表示用の名前と画像URLだけ欲しい」といった場合に使います。

```ts:utility-pick.ts
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
}

// 商品一覧表示用に、IDと名前と価格だけが必要な型を作る
type ProductPreview = Pick<Product, "id" | "name" | "price">;

const item: ProductPreview = {
  id: 1,
  name: "Laptop",
  price: 120000,
  // description: "..." // エラー: ProductPreviewにはdescriptionは存在しません
};

console.log(item);
```

```ts-exec:utility-pick.ts
{ id: 1, name: 'Laptop', price: 120000 }
```
```js-readonly:utility-pick.js
```

### 4\. Omit\<T, K\>: 特定のキーだけ除外する

`Omit<T, K>` は `Pick` の逆で、指定したプロパティを除外します。
「データベースのモデルから、機密情報や内部管理用のIDを除外してクライアントに返したい」といった場合に有用です。

```ts:utility-omit.ts
interface Product {
  id: number;
  name: string;
  price: number;
  secretCode: string; // 外部に出したくない情報
  internalId: string; // 外部に出したくない情報
}

// 外部公開用の型（secretCodeとinternalIdを除外）
type PublicProduct = Omit<Product, "secretCode" | "internalId">;

const publicItem: PublicProduct = {
  id: 1,
  name: "Mouse",
  price: 3000
};

console.log(publicItem);
```

```ts-exec:utility-omit.ts
{ id: 1, name: 'Mouse', price: 3000 }
```
```js-readonly:utility-omit.js
```

## 高度な型操作（概要）

ここでは詳細な文法までは踏み込みませんが、ライブラリの型定義などを読む際に遭遇する高度な概念を紹介します。これらは上記のユーティリティ型の内部実装にも使われています。

### Mapped Types (マップ型)

既存の型のプロパティをループ処理して、新しい型を作る機能です。配列の `.map()` の型バージョンと考えると分かりやすいでしょう。

```ts
type Item = { a: string; b: number };

// 既存のItemのキー(P)をすべて boolean 型に変換する
type BooleanItem = {
  [P in keyof Item]: boolean;
};
// 結果: { a: boolean; b: boolean; } と等価
```

### Conditional Types (条件付き型)

型の三項演算子のようなものです。「もし型Tが型Uを継承しているならX型、そうでなければY型」という条件分岐を定義できます。

```ts
// Tがstringなら number[] を、それ以外なら T[] を返す型
type StringArrayOrGeneric<T> = T extends string ? number[] : T[];

type A = StringArrayOrGeneric<string>; // number[] になる
type B = StringArrayOrGeneric<boolean>; // boolean[] になる
```

## この章のまとめ

  * **非同期処理**: `async` 関数の戻り値は `Promise<T>` で定義する。
  * **Utility Types**: TypeScriptには型の再利用性を高める便利な型が組み込まれている。
      * `Partial<T>`: 全プロパティを任意にする。
      * `Readonly<T>`: 全プロパティを読み取り専用にする。
      * `Pick<T, K>`: 必要なプロパティだけ抽出する。
      * `Omit<T, K>`: 不要なプロパティを除外する。
  * **高度な型**: `Mapped Types` や `Conditional Types` を使うことで、動的で柔軟な型定義が可能になる。

JavaScriptの柔軟性を保ちつつ、堅牢さを加えるためにこれらの機能は非常に重要です。特にユーティリティ型は、冗長なコードを減らす即戦力の機能ですので、ぜひ活用してください。

### 練習問題1: 非同期データの取得

1.  `Post` というインターフェースを定義してください（`id: number`, `title: string`, `body: string`）。
2.  `fetchPost` という `async` 関数を作成してください。この関数は引数に `id` (number) を受け取り、戻り値として `Promise<Post>` を返します。
3.  関数内部では、引数で受け取ったデータをそのまま含むオブジェクトを返してください（`setTimeout`などは不要です）。
4.  作成した関数を実行し、結果をコンソールに表示してください。

```ts:practice8_1.ts
```
```ts-exec:practice8_1.ts
```
```js-readonly:practice8_1.js
```

### 練習問題2: ユーティリティ型の活用

アプリケーションの設定を表す `AppConfig` インターフェースがあります。
以下の要件を満たす新しい型と変数を定義してください。

1.  `AppConfig` から `debugMode` を**除外**した型 `ProductionConfig` を定義してください (`Omit`を使用)。
2.  `AppConfig` のすべてのプロパティを**任意（Optional）**にした型 `OptionalConfig` を定義してください (`Partial`を使用)。
3.  `ProductionConfig` 型を持つ変数 `prodConfig` を定義し、適切な値を代入してください。

```ts:practice8_2.ts
interface AppConfig {
  apiUrl: string;
  retryCount: number;
  timeout: number;
  debugMode: boolean;
}
```
```ts-exec:practice8_2.ts
```
```js-readonly:practice8_2.js
```
