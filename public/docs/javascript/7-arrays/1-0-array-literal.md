---
id: javascript-arrays-basic
title: 配列リテラルと基本的な操作
level: 2
question:
  - JavaScriptの配列リテラル [] と Array オブジェクトの違いは何ですか？
  - push、pop、shift、unshift はそれぞれどのような時に使い分けるべきですか？
  - push や pop を実行した後に返ってくる数値や undefined は何を意味するのですか？
  - 存在しないインデックス番号で配列にアクセスするとどうなりますか？
---

## 配列リテラルと基本的な操作

JavaScriptの配列は`Array`オブジェクトですが、通常はリテラル `[]` を使用して生成します。
基本的な操作として、スタック操作（`push`, `pop`）やキュー操作に近いこと（`shift`, `unshift`）、そして万能な要素操作メソッド`splice`があります。

```js-repl
> const fruits = ['Apple', 'Banana'];
undefined
> // 末尾に追加 (push)
> fruits.push('Orange');
3
> fruits
[ 'Apple', 'Banana', 'Orange' ]

> // 末尾から削除 (pop)
> const last = fruits.pop();
undefined
> last
'Orange'

> // 先頭に追加 (unshift)
> fruits.unshift('Grape');
3
> fruits
[ 'Grape', 'Apple', 'Banana' ]

> // インデックスによるアクセス
> fruits[1]
'Apple'
```
