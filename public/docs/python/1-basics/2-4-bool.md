---
id: python-basics-bool
title: 真偽値（bool）
level: 3
question:
  - '`True`と`False`の他に、真偽値として扱われるものはありますか？'
  - '`True`や`False`は、具体的なコードのどのような部分で使われることが多いですか？'
  - 小文字の`true`や`false`を使うとエラーになりますか？
  - '`and`や`or`の他に、条件を組み合わせるための演算子はありますか？'
---

### 真偽値（bool）

真偽値は `True` と `False` の2つの値を持ちます（先頭が大文字であることに注意してください）。論理演算子には `and`, `or`, `not` を使います。

```python-repl
>>> is_active = True
>>> has_permission = False
>>> type(is_active)
<class 'bool'>
>>> # 論理積 (AND)
>>> is_active and has_permission
False
>>> # 論理和 (OR)
>>> is_active or has_permission
True
>>> # 否定 (NOT)
>>> not is_active
False
```
