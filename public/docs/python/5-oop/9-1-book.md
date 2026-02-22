---
id: python-oop-9-1-book
title: '練習問題1: Bookクラスの作成'
level: 3
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

#### 練習問題2: 継承を使った`EBook`クラスの作成

問題1で作成した`Book`クラスを継承して、電子書籍を表す`EBook`クラスを作成してください。

**要件:**

1.  `Book`クラスを継承する。
2.  インスタンス化の際に、`title`、`author`に加えて`file_size`（ファイルサイズ、MB単位）も引数で受け取る。
3.  `info()`メソッドを**オーバーライド**し、呼び出すと`「{タイトル}」- {著者} (ファイルサイズ: {file_size}MB)`という形式の文字列を返すように変更する。

```python:practice6_2.py
from practice6_1 import Book

class EBook(Book):
    

if __name__ == "__main__":
    ebook_version = EBook("Python実践入門", "掌田 津耶乃", 24)
    print(ebook_version.info())
```

```python-exec:practice6_2.py
「Python実践入門」- 掌田 津耶乃 (ファイルサイズ: 24MB)
```
