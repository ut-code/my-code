---
id: cpp-control-switch
title: switch文とフォールスルー
level: 3
question:
  - switch文の「フォールスルー」とは具体的にどういうことですか？意図的でない場合にどのような問題が起こりますか？
  - '[[fallthrough]]; を使わない場合、コンパイラはどのような警告を出すのですか？'
  - breakを書き忘れた場合、プログラムはどのように動作するのですか？
  - switch文のcaseに書ける値の型に制限はありますか？
  - defaultのcaseは必ず書くべきですか？
---

### `switch`文とフォールスルー

`switch` 文は `break` を書かない限り、次の `case` へ処理が流れます（フォールスルー）。意図的なフォールスルーでない限り、`break` を忘れないように注意が必要です。C++17以降では `[[fallthrough]];` 属性をつけることで、「意図的なものである」とコンパイラに伝え、警告を抑制できます。

```cpp:control-switch.cpp
#include <iostream>

int main() {
    // --- switch文 ---
    const int rank = 2;
    std::cout << "Rank " << rank << ": ";

    switch (rank) {
        case 1:
            std::cout << "Gold" << std::endl;
            break;
        case 2:
            std::cout << "Silver" << std::endl;
            // breakを忘れるとcase 3も実行される
            [[fallthrough]]; // C++17: 意図的に下に流すことを明示
        case 3:
            std::cout << "(Medalist)" << std::endl;
            break;
        default:
            std::cout << "Participant" << std::endl;
    }

    return 0;
}
```

```cpp-exec:control-switch.cpp
Rank 2: Silver
(Medalist)
```
