---
id: cpp-raii-smartptr-practice2
title: '問題2: shared_ptr と所有権の共有'
level: 3
question:
  - shared_ptrの参照カウントは、どのように取得するのですか？
  - vectorをclear()すると、shared_ptrの参照カウントが減るのはなぜですか？
---

### 問題2: `shared_ptr` と所有権の共有

`Project` という名前の[[クラス]]を作成してください。[[コンストラクタ]]でプロジェクト名を受け取り、[[デストラクタ]]で「Project (プロジェクト名) is finished.」と表示します。

[[`main` 関数]]で、`"Project Phoenix"` という名前の `Project` [[オブジェクト]]を `std::make_shared` で作成してください。
次に、`std::vector<std::shared_ptr<Project>>` を作成し、作成した `shared_ptr` を2回 `push_back` してください。
その後、`shared_ptr` の参照カウント (`use_count()`) を表示してください。
最後に、`vector` を `clear()` して、再度参照カウントを表示してください。
プログラムの実行が終了するときに `Project` の[[デストラクタ]]が呼ばれることを確認してください。

```cpp:practice13_2.cpp
#include <iostream>
#include <memory>
#include <vector>
#include <string>

// ここにProjectクラスを定義


int main() {


}
```

```cpp-exec:practice13_2.cpp
Project Project Phoenix is started.
Initial use count: 1
Use count after pushing to vector: 3
Use count after clearing vector: 1
Project Project Phoenix is finished.
```
