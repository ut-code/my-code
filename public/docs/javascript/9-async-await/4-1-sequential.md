---
id: javascript-async-await-sequential
title: 直列実行（遅いパターン）
level: 3
question:
  - fetchUser()とfetchPosts()が直列実行になるのはなぜですか？
  - このコードはなぜ「遅いパターン」なのですか？
---

### 直列実行（遅いパターン）

```javascript
// Aが終わってからBを開始する
const user = await fetchUser(); 
const posts = await fetchPosts(); 
```
