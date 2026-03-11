---
id: python-modules-find-std-library
title: 標準ライブラリの探索
level: 3
question:
  - 標準ライブラリの公式ドキュメントは、英語が苦手でも読めますか？
  - REPLとは何ですか？
  - '`dir()`と`help()`はどんな時に使うと便利ですか？'
  - '`dir(datetime)`の出力にある`__all__`や`__builtins__`のような特殊な名前は何ですか？'
---

### 標準ライブラリの探索

どんなライブラリがあるかを知るには、公式ドキュメントが最も信頼できます。

  * [**The Python Standard Library — Python 3.x documentation**](https://docs.python.org/3/library/index.html)

また、REPLの `help()` や `dir()` を使うと、モジュールの内容を簡単に確認できます。

```python-repl
>>> import datetime
>>> # datetimeモジュールが持つ属性や関数のリストを表示
>>> dir(datetime)
['MAXYEAR', 'MINYEAR', '__all__', '__builtins__', ..., 'date', 'datetime', 'time', 'timedelta', 'timezone', 'tzinfo']
>>>
>>> # dateクラスのヘルプドキュメントを表示
>>> help(datetime.date)
Help on class date in module datetime:

class date(builtins.object)
 |  date(year, month, day) --> a date object
 |
 |  Methods defined here:
(ヘルプ情報が続く) ...
```
