---
id: cpp-functions-practice2
title: 問題2：ベクター統計
level: 3
---

### 問題2：ベクター統計

`std::vector<int>` を受け取り、その中の「最大値」を見つけて返す関数 `findMax` を作成してください。
ただし、以下の条件を守ってください。

1.  ベクターはコピーされないようにしてください（**参照渡し**）。
2.  関数内でベクターの内容が変更されないことを保証してください（**const**）。
3.  ベクターが空の場合は `0` を返すなどの処理を入れてください。

<!-- end list -->

```cpp:practice5_2.cpp
#include <iostream>
#include <vector>
#include <algorithm> // maxを使うなら便利ですが、for文でも可

// ここに findMax を作成


int main() {
    std::vector<int> data = {10, 5, 8, 42, 3};
    std::cout << "Max: " << findMax(data) << std::endl;
    return 0;
}
```
```cpp-exec:practice5_2.cpp
Max: 42
```
