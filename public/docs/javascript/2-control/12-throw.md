---
id: javascript-control-12-throw
title: throw について
level: 3
---

### throw について

JavaScriptでは `throw` で例外を投げることができます。`Error` オブジェクトを投げるのが一般的ですが、技術的には文字列や数値など、任意の値を投げることが可能です（ただし、スタックトレースが取れなくなるため推奨されません）。

```js-repl:5
> try { throw new Error("Something went wrong"); } catch (e) { console.log(e.message); }
Something went wrong

> // プリミティブ値を投げることも可能だが非推奨
> try { throw "Just a string"; } catch (e) { console.log(typeof e, e); }
string Just a string
```
