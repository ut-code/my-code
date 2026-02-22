---
id: cpp-types-control-8-switch
title: switch文とフォールスルー
level: 3
---

### switch文とフォールスルー

`switch` 文は `break` を書かない限り、次の `case` へ処理が流れます（フォールスルー）。意図的なフォールスルーでない限り、`break` を忘れないように注意が必要です。C++17以降では `[[fallthrough]];` 属性をつけることで、「意図的なものである」とコンパイラに伝え、警告を抑制できます。
