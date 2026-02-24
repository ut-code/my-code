---
id: javascript-this-practice1
title: '練習問題1: 失われたコンテキストの修復'
level: 3
---

### 練習問題1: 失われたコンテキストの修復

以下のコードは、ボタンクリック時（ここではシミュレーション）にユーザー名を表示しようとしていますが、エラーになります。

1.  `bind` を使って修正してください。
2.  `greet` メソッド自体をアロー関数に変更するアプローチではなく、呼び出し側を修正する形で解答してください。

```js:practice5_1.js
const user = {
    name: "Tanaka",
    greet: function() {
        console.log(`Hello, ${this.name}`);
    }
};

// クリックイベントのシミュレーター（変更不可）
function simulateClick(callback) {
    // 内部で単なる関数呼び出しとして実行される
    callback(); 
}

// --- 以下を修正してください ---
simulateClick(user.greet); 
```

```js-exec:practice5_1.js
```
