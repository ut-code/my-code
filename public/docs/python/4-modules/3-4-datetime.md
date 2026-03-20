---
id: python-modules-datetime
title: datetime
level: 3
question:
  - '`datetime`モジュールは、他にどのような日付や時刻の操作ができますか？'
  - '`datetime.datetime.now()`と`datetime.date.today()`はどのように違いますか？'
  - '`strftime(''%Y-%m-%d %H:%M:%S'')`の`%Y`や`%m`は何を意味しますか？'
  - 日時の最後の数字`123456`は何を表していますか？
---

### `datetime`

日付や時刻を扱うための機能を提供します。

```python-repl
>>> import datetime
>>> # 現在の日時を取得 (実行時刻による)
>>> now = datetime.datetime.now()
>>> print(now)
2025-08-12 18:26:06.123456
>>> # 日時をフォーマットして文字列にする
>>> now.strftime('%Y-%m-%d %H:%M:%S')
'2025-08-12 18:26:06'
```
