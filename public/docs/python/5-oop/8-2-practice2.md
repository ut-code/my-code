---
id: python-oop-practice2
title: '練習問題2: 継承を使ったEBookクラスの作成'
level: 3
question:
  - Bookクラスを継承する具体的な書き方を教えてください。
  - EBookクラスの__init__でBookクラスの__init__を呼び出す方法がわかりません。
  - info()メソッドのオーバーライドの具体的な書き方を教えてください。
  - from practice6_1 import Bookは何のために書くのですか。
---

### 練習問題2: 継承を使った`EBook`クラスの作成

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
