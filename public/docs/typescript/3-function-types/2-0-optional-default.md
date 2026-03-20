---
id: typescript-function-types-optional-default
title: オプショナル引数とデフォルト引数
level: 2
question:
  - JavaScriptでは引数を省略するとundefinedになるのに、TypeScriptでは必須とみなされるのはなぜですか
  - オプショナル引数とデフォルト引数は、どちらを優先して使うべきですか
---

## オプショナル引数とデフォルト引数

JavaScriptでは引数を省略すると `undefined` になりますが、TypeScriptでは定義された引数は**必須**とみなされます。引数を省略可能にするには、特別な構文が必要です。
