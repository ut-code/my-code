---
id: python-oop-practice1
title: '練習問題1: Bookクラスの作成'
level: 3
question:
  - Bookクラスの作成で、どの部分から手をつければ良いかヒントをください。
  - info()メソッドと__str__メソッドの役割は似ていますが、使い分けはありますか。
  - if __name__ == "__main__":は何のために書くのですか。
---

### 練習問題1: `Book`クラスの作成

書籍の情報を管理する`Book`クラスを作成してください。

**要件:**

1.  インスタンス化する際に、`title`（タイトル）と`author`（著者）を引数で受け取る。
2.  `info()`というメソッドを持ち、呼び出すと`「{タイトル}」- {著者}`という形式の文字列を返す。
3.  `print()`でインスタンスを直接表示した際に、`info()`メソッドと同じ文字列が表示されるようにする。

```python:practice6_1.py
class Book:


if __name__ == "__main__":
    harry_potter = Book("ハリー・ポッターと賢者の石", "J.K. ローリング")
    print(harry_potter.info())
    print(harry_potter)
```

```python-exec:practice6_1.py
「ハリー・ポッターと賢者の石」- J.K. ローリング
「ハリー・ポッターと賢者の石」- J.K. ローリング
```
