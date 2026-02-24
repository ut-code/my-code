---
id: cpp-raii
title: RAIIイディオム
level: 2
---

## RAIIイディオム

**RAII (Resource Acquisition Is Initialization)** は、「リソースの確保は、オブジェクトの初期化時に行い、リソースの解放は、オブジェクトの破棄時に行う」という設計パターンです。日本語では「リソース取得は初期化である」と訳されます。

C++では、オブジェクトがそのスコープ（変数が宣言された `{}` の範囲）を抜けるときに、そのオブジェクトの**デストラクタ**が自動的に呼び出されます。この仕組みは、関数が正常に終了した場合だけでなく、**例外が投げられてスコープを抜ける場合でも保証されています**。

RAIIはこの性質を利用して、リソースの解放処理をデストラクタに記述することで、リソースの解放を自動化し、`delete` の呼び忘れや例外発生時のリソースリークを防ぎます。

簡単なRAIIクラスの例を見てみましょう。

```cpp:raii_concept.cpp
#include <iostream>

class ResourceWrapper {
private:
    int* m_data;

public:
    // コンストラクタでリソースを確保
    ResourceWrapper() {
        m_data = new int[10];
        std::cout << "Resource acquired." << std::endl;
    }

    // デストラクタでリソースを解放
    ~ResourceWrapper() {
        delete[] m_data;
        std::cout << "Resource released." << std::endl;
    }
};

void use_resource() {
    ResourceWrapper rw; // オブジェクトが生成され、コンストラクタでリソースが確保される
    std::cout << "Using resource..." << std::endl;

    // この関数が終了するとき (正常終了でも例外でも)、
    // rwのデストラクタが自動的に呼ばれ、リソースが解放される
}

int main() {
    std::cout << "Entering main." << std::endl;
    use_resource();
    std::cout << "Exiting main." << std::endl;
    return 0;
}
```

```cpp-exec:raii_concept.cpp
Entering main.
Resource acquired.
Using resource...
Resource released.
Exiting main.
```

`use_resource` 関数が終了すると、`rw` オブジェクトがスコープを抜けるため、`ResourceWrapper` のデストラクタが自動的に呼び出され、`delete[]` が実行されます。もし `use_resource` の中で例外が発生したとしても、デストラクタは保証付きで呼び出されます。

この強力なRAIIイディオムを、動的メモリ管理のために標準ライブラリが提供してくれているのが**スマートポインタ**です。
