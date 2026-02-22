---
id: cpp-smartptr-sharedptr
title: 'std::shared_ptr'
level: 3
---

### `std::shared_ptr`

`std::shared_ptr` は、管理するオブジェクトの**所有権を複数のポインタで共有できる**スマートポインタです。

  * **共有された所有権**: `shared_ptr` は自由にコピーできます。コピーされるたびに、内部の**参照カウンタ**が増加します。
  * **自動解放**: `shared_ptr` が破棄される（デストラクタが呼ばれる）と参照カウンタが減少し、**参照カウンタが0になったとき**に、管理しているオブジェクトが解放（`delete`）されます。
  * **オーバーヘッド**: 参照カウンタを管理するための追加のメモリと処理が必要なため、`unique_ptr` よりもわずかにオーバーヘッドが大きいです。

`shared_ptr` を作成するには、`std::make_shared` を使うのが効率的で安全です。

```cpp:shared_ptr_example.cpp
#include <iostream>
#include <memory>
#include <vector>

struct MyResource {
    MyResource() { std::cout << "MyResource constructor" << std::endl; }
    ~MyResource() { std::cout << "MyResource destructor" << std::endl; }
};

int main() {
    std::shared_ptr<MyResource> s_ptr1; // 空のshared_ptr

    std::cout << "--- Block 1 ---" << std::endl;
    {
        // std::make_shared を使ってオブジェクトを生成し、shared_ptrで管理
        s_ptr1 = std::make_shared<MyResource>();
        std::cout << "Use count: " << s_ptr1.use_count() << std::endl; // 1

        {
            // s_ptr2 は s_ptr1 と同じオブジェクトを指す
            std::shared_ptr<MyResource> s_ptr2 = s_ptr1;
            std::cout << "Use count: " << s_ptr1.use_count() << std::endl; // 2
            std::cout << "Use count: " << s_ptr2.use_count() << std::endl; // 2
        } // s_ptr2がスコープを抜ける。参照カウンタが1に減る

        std::cout << "Use count after s_ptr2 is gone: " << s_ptr1.use_count() << std::endl; // 1
    } // s_ptr1がスコープを抜ける。参照カウンタが0になり、オブジェクトが破棄される

    std::cout << "\n--- Block 2 ---" << std::endl;
    {
        auto shared_res = std::make_shared<MyResource>();
        std::cout << "Initial use count: " << shared_res.use_count() << std::endl; // 1

        std::vector<std::shared_ptr<MyResource>> ptr_vec;
        ptr_vec.push_back(shared_res); // コピー。参照カウンタは2
        ptr_vec.push_back(shared_res); // コピー。参照カウンタは3
        
        std::cout << "Use count after pushing to vector: " << shared_res.use_count() << std::endl; // 3
    } // shared_resとptr_vecがスコープを抜ける。
      // 全てのshared_ptrが破棄され、最後に参照カウンタが0になり、オブジェクトが破棄される

    std::cout << "\nProgram finished." << std::endl;
    return 0;
}
```

```cpp-exec:shared_ptr_example.cpp
--- Block 1 ---
MyResource constructor
Use count: 1
Use count: 2
Use count: 2
Use count after s_ptr2 is gone: 1
MyResource destructor

--- Block 2 ---
MyResource constructor
Initial use count: 1
Use count after pushing to vector: 3
MyResource destructor

Program finished.
```

`shared_ptr` は、オブジェクトの寿命が単一のスコープや所有者に縛られず、複数のオブジェクトから共有される必要がある場合に便利です。ただし、所有権の関係が複雑になりがちなので、本当に共有が必要な場面に限定して使いましょう。
