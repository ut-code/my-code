---
id: cpp-raii-smart-ptrs-uniqueptr
title: 'std::unique_ptr'
level: 3
---

### `std::unique_ptr`

`std::unique_ptr` は、管理するオブジェクトの**所有権を唯一に保つ**スマートポインタです。つまり、あるオブジェクトを指す `unique_ptr` は、常に一つしか存在できません。

  * **唯一の所有権**: コピーが禁止されています。オブジェクトの所有権を別の `unique_ptr` に移したい場合は、**ムーブ (`std::move`)** を使います。
  * **軽量**: ポインタ一つ分のサイズしかなく、オーバーヘッドが非常に小さいです。

`unique_ptr` を作成するには、`std::make_unique` を使うのが安全で推奨されています。

```cpp:unique_ptr_example.cpp
#include <iostream>
#include <memory> // スマートポインタのために必要
#include <utility> // std::moveのために必要

struct MyData {
    MyData() { std::cout << "MyData constructor" << std::endl; }
    ~MyData() { std::cout << "MyData destructor" << std::endl; }
    void greet() { std::cout << "Hello from MyData!" << std::endl; }
};

void process_ptr(std::unique_ptr<MyData> ptr) {
    std::cout << "Inside process_ptr" << std::endl;
    ptr->greet();
    // ptrがこの関数のスコープを抜けるときにデストラクタが呼ばれる
}

int main() {
    std::cout << "--- Block 1 ---" << std::endl;
    {
        // std::make_unique を使ってオブジェクトを生成し、unique_ptrで管理
        std::unique_ptr<MyData> u_ptr1 = std::make_unique<MyData>();
        
        // 生ポインタと同じように -> や * でメンバにアクセスできる
        u_ptr1->greet();

        // コピーはコンパイルエラーになる
        // std::unique_ptr<MyData> u_ptr2 = u_ptr1; // ERROR!

        // 所有権を u_ptr3 に移動 (ムーブ)
        std::unique_ptr<MyData> u_ptr3 = std::move(u_ptr1);
        
        // ムーブ後、u_ptr1 は空(nullptr)になる
        if (u_ptr1 == nullptr) {
            std::cout << "u_ptr1 is now empty." << std::endl;
        }

        u_ptr3->greet();
    } // ブロックを抜けると u_ptr3 が破棄され、MyDataのデストラクタが呼ばれる
    
    std::cout << "\n--- Block 2 ---" << std::endl;
    {
        auto u_ptr4 = std::make_unique<MyData>();
        // 関数の引数に渡すことで所有権を譲渡する
        process_ptr(std::move(u_ptr4));
        std::cout << "Returned from process_ptr" << std::endl;
    }
    
    std::cout << "\nProgram finished." << std::endl;
    return 0;
}
```

```cpp-exec:unique_ptr_example.cpp
--- Block 1 ---
MyData constructor
Hello from MyData!
u_ptr1 is now empty.
Hello from MyData!
MyData destructor

--- Block 2 ---
MyData constructor
Inside process_ptr
Hello from MyData!
MyData destructor
Returned from process_ptr

Program finished.
```

`unique_ptr` は、オブジェクトの所有者が誰であるかが明確な場合に最適です。基本的にはまず `unique_ptr` を使うことを検討しましょう。
