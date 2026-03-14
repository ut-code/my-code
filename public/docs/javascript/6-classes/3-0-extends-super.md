---
id: javascript-classes-extends-super
title: 継承 (extends と super)
level: 2
question:
  - '`extends` キーワードを使うと何が便利になるのですか？'
  - '`super` キーワードは具体的に何をするものですか？'
  - 子クラスのコンストラクタで `this` を使う前に `super()` を呼び出す必要があるのはなぜですか？
  - メソッドのオーバーライドとは何ですか？
  - '`instanceof` は何を確認するために使うのですか？'
---

## 継承 (`extends` と `super`)

他の言語同様、`extends` キーワードを使用して既存のクラスを継承できます。親クラスのコンストラクタやメソッドには `super` を使ってアクセスします。

ここで重要なルールが1つあります。**子クラスの `constructor` 内では、`this` を使用する前に必ず `super()` を呼び出す必要があります。**

```js:inheritance.js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a noise.`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    // thisを使う前に親のコンストラクタを呼ぶ必須ルール
    super(name); 
    this.breed = breed;
  }

  // メソッドのオーバーライド
  speak() {
    // 親クラスのメソッド呼び出し
    const parentSound = super.speak(); 
    return `${parentSound} But specifically, ${this.name} barks!`;
  }
}

const d = new Dog("Pochi", "Shiba");
console.log(d.speak());
console.log(d instanceof Dog);    // true
console.log(d instanceof Animal); // true
```

```js-exec:inheritance.js
Pochi makes a noise. But specifically, Pochi barks!
true
true
```
