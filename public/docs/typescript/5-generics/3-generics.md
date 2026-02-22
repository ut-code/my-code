---
id: typescript-generics-3-generics
title: Genericsクラス
level: 2
---

## Genericsクラス

クラスでも同様にジェネリクスを使用できます。リストやキュー、スタックなどのデータ構造を実装する際によく使われます。

ここではシンプルな「スタック（後入れ先出し）」クラスを作ってみましょう。

```ts:simple_stack.ts
class SimpleStack<T> {
  private items: T[] = [];

  // データを追加する
  push(item: T): void {
    this.items.push(item);
  }

  // データを取り出す
  pop(): T | undefined {
    return this.items.pop();
  }

  // 現在の中身を表示（デバッグ用）
  print(): void {
    console.log(this.items);
  }
}

// 数値専用のスタック
const numberStack = new SimpleStack<number>();
numberStack.push(10);
numberStack.push(20);
// numberStack.push("30"); // エラー: number以外は入れられない
console.log("Pop:", numberStack.pop());

// 文字列専用のスタック
const stringStack = new SimpleStack<string>();
stringStack.push("A");
stringStack.push("B");
stringStack.print();
```

```ts-exec:simple_stack.ts
Pop: 20
[ 'A', 'B' ]
```
```js-readonly:simple_stack.js
```

もしジェネリクスを使わずにこれを実装しようとすると、`NumberStack`クラスと`StringStack`クラスを個別に作るか、`any`を使って安全性を犠牲にするしかありません。ジェネリクスを使えば、1つのクラス定義で安全に様々な型に対応できます。
