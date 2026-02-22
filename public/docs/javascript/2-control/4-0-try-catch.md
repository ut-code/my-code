---
id: javascript-control-try-catch
title: 例外処理 (try...catch...finally)
level: 2
---

## 例外処理 (`try...catch...finally`)

JavaScriptの例外処理は `try...catch...finally` 構文を使用します。

実行時にエラーが発生すると、処理が中断され `catch` ブロックに移行します。

```js:try_catch.js
function parseJson(jsonString) {
    try {
        const result = JSON.parse(jsonString);
        console.log("パース成功:", result);
        return result;
    } catch (e) {
        // エラーオブジェクトが e に入る
        console.error("パース失敗:", e.name, e.message);
    } finally {
        console.log("処理終了（成功・失敗に関わらず実行）");
    }
}

parseJson('{"valid": true}');
console.log("---");
parseJson('Invalid JSON');
```

```js-exec:try_catch.js
パース成功: { valid: true }
処理終了（成功・失敗に関わらず実行）
---
パース失敗: SyntaxError Unexpected token I in JSON at position 0
処理終了（成功・失敗に関わらず実行）
```
