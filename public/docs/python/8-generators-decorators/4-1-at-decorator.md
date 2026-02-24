---
id: python-generators-decorators-at-decorator
title: '@ 構文'
level: 3
---

### `@` 構文
この書き方をより簡単にするための構文が `@`（アットマーク）、シンタックスシュガーです。

```python-repl
>>> @my_decorator
... def say_goodbye():
...     print("さようなら！")
...

>>> say_goodbye()
--- 処理を開始します ---
さようなら！
--- 処理が完了しました ---
```

`@my_decorator` は、`say_goodbye = my_decorator(say_goodbye)` と同じ意味になります。こちらのほうが直感的で、Pythonのコードで広く使われています。

ジェネレータとデコレータは、最初は少し複雑に感じるかもしれませんが、使いこなせばよりクリーンで効率的なPythonコードを書くための強力な武器となります。ぜひ積極的に活用してみてください。
