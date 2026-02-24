---
id: cpp-control-loop
title: ループ構文
level: 3
---

### ループ構文

`while`, `for` も標準的です。

```cpp:control-loop.cpp
#include <iostream>

int main() {
    // --- 基本的なforループ ---
    std::cout << "Countdown: ";
    for (int i = 3; i > 0; --i) {
        std::cout << i << " ";
    }
    std::cout << "Start!" << std::endl;

    return 0;
}
```

```cpp-exec:control-loop.cpp
Countdown: 3 2 1 Start!
```
