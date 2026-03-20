---
id: cpp-project-build-pragma-once
title: '#pragma once'
level: 3
question:
  - '`#pragma once` と伝統的なインクルードガードは、どちらを使うべきですか？'
  - '`#pragma once` がサポートされていないコンパイラではどうなりますか？'
  - '`#pragma once` を書く場所は、ファイルの先頭でなければいけませんか？'
---

### \#pragma once

より現代的で簡潔な方法として `#pragma once` があります。多くのモダンなコンパイラがサポートしています。

```cpp
#pragma once

#include <string>

std::string to_upper(const std::string& str);
```

この一行をヘッダファイルの先頭に書くだけで、コンパイラがそのファイルが一度しかインクルードされないように処理してくれます。特別な理由がない限り、現在では `#pragma once` を使うのが主流です。
