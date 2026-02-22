---
id: cpp-data-containers-string
title: '文字列の扱い：std::string'
level: 2
---

## 文字列の扱い：std::string

C言語では文字列を扱うために `char*` や `char[]` を使い、ヌル終端文字 `\0` を意識する必要がありました。これはバグの温床です。
C++では、標準ライブラリの `std::string` クラスを使用します。これはPythonの `str` や Javaの `String` のように直感的に扱えます。
