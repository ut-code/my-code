---
id: typescript-combining-types-2-intersection
title: Intersection型 (交差型)
level: 2
---

## Intersection型 (交差型)

Intersection型（交差型）は、**「A かつ B」**を表します。アンパサンド `&` を使用します。
これは主にオブジェクトの型定義を合成（マージ）して、**「複数の型のすべてのプロパティを持つ新しい型」**を作る際によく使用されます。

```ts:intersection-types.ts
type Person = {
  name: string;
};

type Employee = {
  employeeId: number;
  department: string;
};

// Person かつ Employee の特徴を持つ型
type CompanyMember = Person & Employee;

const member: CompanyMember = {
  name: "Suzuki",
  employeeId: 5001,
  department: "Engineering"
  // どれか一つでも欠けるとエラーになります
};

console.log(member);
```

```ts-exec:intersection-types.ts
{ name: 'Suzuki', employeeId: 5001, department: 'Engineering' }
```
```js-readonly:intersection-types.js
```

> **補足:** プリミティブ型同士で `string & number` のように交差させると、両方を満たす値は存在しないため、型は `never`（ありえない値）になります。Intersection型は主にオブジェクト型の合成に使われます。
