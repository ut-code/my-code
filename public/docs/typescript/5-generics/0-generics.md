---
id: typescript-generics-0-generics
title: 'Genericsの必要性: 型を引数のように扱う'
level: 2
---

## Genericsの必要性: 型を引数のように扱う

プログラミングをしていると、「処理内容は同じだが、扱うデータの型だけが違う」という場面によく遭遇します。

例えば、「引数をそのまま返す関数」を考えてみましょう。

```ts
// 数値を受け取って数値を返す
function returnNumber(arg: number): number {
  return arg;
}

// 文字列を受け取って文字列を返す
function returnString(arg: string): string {
  return arg;
}

// どんな型でも受け取れるが、戻り値の型情報が失われる（any）
function returnAny(arg: any): any {
  return arg;
}
```

`returnNumber` と `returnString` はロジックが完全に重複しています。一方、`returnAny` は重複を防げますが、TypeScriptの利点である型チェックが無効になってしまいます。

ここで登場するのが **ジェネリクス** です。ジェネリクスを使うと、**「型そのもの」を引数のように受け取る**ことができます。
