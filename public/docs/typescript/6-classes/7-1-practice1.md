---
id: typescript-classes-practice1
title: '練習問題 1: 従業員クラスの作成'
level: 3
question:
  - 練習問題1のヒントをもっとください。
  - private プロパティをコンストラクタの省略記法で初期化する方法を教えてください。
  - readonly プロパティはどのように宣言して初期化すれば良いですか？
  - getSalaryInfo() メソッド内で salary にアクセスできることを確認するにはどうすれば良いですか？
  - この問題を解く上で特に注意すべき点は何ですか？
---

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
