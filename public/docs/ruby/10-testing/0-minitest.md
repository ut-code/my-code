---
id: ruby-testing-0-minitest
title: 標準添付のテスティングフレームワーク「Minitest」
level: 2
---

## 標準添付のテスティングフレームワーク「Minitest」

Minitestは、Rubyに標準で含まれている（＝別途インストール不要）軽量かつ高速なテストフレームワークです。

Ruby on Railsなどの主要なフレームワークもデフォルトでMinitestを採用しており、Rubyのエコシステムで広く使われています。（RSpecという、よりDSL（ドメイン固有言語）ライクに記述できる人気のフレームワークもありますが、まずは標準のMinitestを理解することが基本となります。）

Minitestは、`Minitest::Test` を継承する「Unitスタイル」と、`describe` ブロックを使う「Specスタイル」の2種類の書き方を提供しますが、この章では最も基本的なUnitスタイルを学びます。
