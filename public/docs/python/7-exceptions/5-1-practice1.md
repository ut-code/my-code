---
id: python-exceptions-practice1
title: '練習問題1: 安全なリスト要素の取得'
level: 3
question:
  - この問題では、どの例外を捕捉する必要がありますか？
  - '`IndexError`はどんな時に起こりますか？'
  - '`TypeError`はどんな時に起こりますか？'
  - '`print(safe_get(data, 1))`のように正常な場合でも`print`が必要なのはなぜですか？'
---

### 練習問題1: 安全なリスト要素の取得

リストとインデックスを受け取り、そのインデックスに対応する要素を返す `safe_get(my_list, index)` という関数を作成してください。

**要件:**

1.  インデックスがリストの範囲外の場合 (`IndexError`)、「指定されたインデックスは範囲外です。」と表示してください。
2.  インデックスが整数でない場合 (`TypeError`)、「インデックスは整数で指定してください。」と表示してください。
3.  正常に要素を取得できた場合は、その要素を返してください。

```python:practice8_1.py
def safe_get(my_list, index):


data = ['apple', 'banana', 'cherry']
print(safe_get(data, 1))
print(safe_get(data, 3))
print(safe_get(data, 'zero'))
```

```python-exec:practice8_1.py
(出力例)
banana
指定されたインデックスは範囲外です。
インデックスは整数で指定してください。
```
