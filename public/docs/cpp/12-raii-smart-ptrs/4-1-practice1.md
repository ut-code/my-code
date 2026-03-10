---
id: cpp-raii-smartptr-practice1
title: '練習問題1: unique_ptr と所有権の移動'
level: 3
question:
  - Employeeクラスの定義方法を教えてください。
  - promote_employee関数でunique_ptrを引数として受け取るには、どのように記述すればよいですか？
  - std::moveはどこで、どのように使えば良いですか？
---

### 練習問題1: `unique_ptr` と所有権の移動

`Employee` という名前のクラスを作成してください。このクラスは、コンストラクタで社員名を受け取って表示し、デストラクタで「(社員名) is leaving.」というメッセージを表示します。

`main` 関数で、`"Alice"` という名前の `Employee` オブジェクトを `std::make_unique` で作成し、その `unique_ptr` を `promote_employee` という関数に渡してください。`promote_employee` 関数は `unique_ptr` を引数として受け取り（所有権が移動します）、「(社員名) has been promoted\!」というメッセージを表示します。

プログラムを実行し、コンストラクタとデストラクタのメッセージが期待通りに表示されることを確認してください。

```cpp:practice13_1.cpp
#include <iostream>
#include <memory>
#include <string>

// ここにEmployeeクラスを定義


int main() {


}
```

```cpp-exec:practice13_1.cpp
Employee Alice has joined the company.
Alice has been promoted!
Employee Alice is leaving.
```
