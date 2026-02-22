---
id: ruby-intro-0-ruby
title: Rubyの哲学と特徴
level: 2
---

## Rubyの哲学と特徴

Rubyは、まつもとゆきひろ（Matz）氏によって開発された、**シンプルさ**と**生産性**を重視した動的オブジェクト指向言語です。

  * **すべてがオブジェクト (Everything is an Object)**
    JavaやPythonでは`int`や`float`などのプリミティブ型がオブジェクトとは別に存在しますが、Rubyでは**すべてがメソッドを持つオブジェクト**です。`5`のような数値や`"hello"`のような文字列はもちろん、`nil`（nullに相当）や`true`/`false`さえもオブジェクトです。

    ```ruby-repl:1
    irb(main):001> 5.class
    => Integer
    irb(main):002> "hello".upcase
    => "HELLO"
    irb(main):003> nil.nil?
    => true
    ```

  * **開発者を楽しませる (MINASWAN)**
    Rubyの設計思想の核は、プログラマがストレスなく、楽しくコーディングできることを最適化する点にあります。これはしばしば「**MINASWAN** (Matz Is Nice And So We Are Nice)」というコミュニティの標語にも表れています。言語仕様が厳格さよりも「驚き最小の原則」や表現力を優先することがあります。

  * **柔軟性と表現力**
    Rubyは非常に柔軟で、既存のクラスを後から変更する（オープンクラス）ことや、コードによってコードを操作するメタプログラミングが容易です。これにより、Ruby on Railsのような強力なフレームワークや、RSpecのようなDSL（ドメイン固有言語）が生まれています。
