---
id: cpp-raii
title: RAIIイディオム
level: 2
question:
  - RAIIという名前は難しいですが、簡単に言うとどのような考え方ですか？
  - デストラクタが例外時でも保証されて呼ばれることが、なぜそんなに重要なんですか？
  - コンストラクタでリソース確保、デストラクタでリソース解放というルールは必ず守るべきですか？
  - RAIIはメモリ管理以外にも利用できるのですか？
  - ResourceWrapperクラスのm_dataはなぜプライベート変数として定義されているのですか？
term:
  - RAII
---

## RAIIイディオム

**RAII (Resource Acquisition Is Initialization)** は、「リソースの確保は、[[オブジェクト]]の初期化時に行い、リソースの解放は、[[オブジェクト]]の破棄時に行う」という設計パターンです。日本語では「リソース取得は初期化である」と訳されます。

C++では、[[オブジェクト]]がそのスコープ（[[変数]]が宣言された `{}` の範囲）を抜けるときに、その[[オブジェクト]]の**[[デストラクタ]]**が自動的に呼び出されます。この仕組みは、関数が正常に終了した場合だけでなく、**[[例外]]が投げられてスコープを抜ける場合でも保証されています**。

RAIIはこの性質を利用して、リソースの解放処理を[[デストラクタ]]に記述することで、リソースの解放を自動化し、[[`delete`]] の呼び忘れや[[例外]]発生時のリソースリークを防ぎます。

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

`use_resource` 関数が終了すると、`rw` [[オブジェクト]]がスコープを抜けるため、`ResourceWrapper` の[[デストラクタ]]が自動的に呼び出され、`delete[]` が実行されます。もし `use_resource` の中で[[例外]]が発生したとしても、[[デストラクタ]]は保証付きで呼び出されます。

この強力なRAIIイディオムを、動的メモリ管理のために標準ライブラリが提供してくれているのが**[[スマートポインタ]]**です。
