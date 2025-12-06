# 第13章: モダンC++の流儀：RAIIとスマートポインタ

これまでの章で、`new` と `delete` を使った動的なメモリ管理を学びました。しかし、これらの手動管理は `delete` の呼び忘れによるメモリリークや、複雑なコードでのリソース管理の煩雑さを引き起こす原因となりがちです。

C++11以降の「モダンC++」では、こうした問題を解決するための洗練された仕組みが導入されました。この章では、エラーハンドリングのための**例外処理**、リソース管理の基本思想である **RAIIイディオム**、そしてそれを具現化する**スマートポインタ** (`std::unique_ptr`, `std::shared_ptr`) について学び、より安全で堅牢なコードを書くための流儀を身につけます。

## 例外処理: try, catch を使ったエラーハンドリング

プログラムでは、ファイルの読み込み失敗やメモリ確保の失敗など、予期せぬエラーが発生することがあります。C++では、このような状況を処理するために**例外 (Exception)** という仕組みが用意されています。

例外処理は、以下の3つのキーワードで構成されます。

  * `throw`: 例外的な状況が発生したことを知らせるために、例外オブジェクトを「投げる」。
  * `try`: 例外が発生する可能性のあるコードブロックを囲む。
  * `catch`: `try` ブロック内で投げられた例外を「捕まえて」処理する。

基本的な構文を見てみましょう。

```cpp:exception_basic.cpp
#include <iostream>
#include <stdexcept> // std::runtime_error のために必要

// 0で割ろうとしたら例外を投げる関数
double divide(int a, int b) {
    if (b == 0) {
        // エラー内容を示す文字列を渡して例外オブジェクトを作成し、投げる
        throw std::runtime_error("Division by zero!");
    }
    return static_cast<double>(a) / b;
}

int main() {
    int a = 10;
    int b = 0;

    try {
        // 例外が発生する可能性のあるコード
        std::cout << "Trying to divide..." << std::endl;
        double result = divide(a, b);
        std::cout << "Result: " << result << std::endl; // この行は実行されない
    } catch (const std::runtime_error& e) {
        // std::runtime_error 型の例外をここで捕まえる
        std::cerr << "Caught an exception: " << e.what() << std::endl;
    }

    std::cout << "Program finished." << std::endl;
    return 0;
}
```

```cpp-exec:exception_basic.cpp
Trying to divide...
Caught an exception: Division by zero!
Program finished.
```

`divide` 関数内で `b` が0だった場合に `throw` が実行され、関数の実行は即座に中断されます。制御は呼び出し元の `catch` ブロックに移り、そこでエラー処理が行われます。これにより、エラーが発生してもプログラム全体がクラッシュすることなく、安全に処理を続行できます。

### 例外とリソースリーク

ここで、`new` と `delete` を使った手動のメモリ管理と例外処理が組み合わさると、問題が発生します。

```cpp:raw_pointer_problem.cpp
#include <iostream>
#include <stdexcept>

void process_data() {
    int* data = new int[100]; // リソース確保
    std::cout << "Data allocated." << std::endl;

    // 何らかの処理...
    bool something_wrong = true;
    if (something_wrong) {
        throw std::runtime_error("Something went wrong during processing!");
    }

    // 例外が投げられると、この行には到達しない
    std::cout << "Deleting data..." << std::endl;
    delete[] data; // リソース解放
}

int main() {
    try {
        process_data();
    } catch (const std::runtime_error& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }
    // process_data内で確保されたメモリは解放されないままである！
    return 0;
}
```

```cpp-exec:raw_pointer_problem.cpp
Data allocated.
Error: Something went wrong during processing!
```

この例では、`process_data` 関数内で `throw` が実行されると、関数の実行が中断され `catch` ブロックにジャンプします。その結果、`delete[] data;` の行が実行されず、確保されたメモリが解放されない**メモリリーク**が発生します。

この問題を解決するのが、C++の最も重要な設計思想の一つである **RAII** です。

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

## スマートポインタ: new/deleteを自動化する

スマートポインタは、RAIIを実装したクラステンプレートで、生ポインタ (`int*` など) のように振る舞いながら、リソース (確保したメモリ) の所有権を管理し、適切なタイミングで自動的に解放してくれます。

モダンC++では、メモリ管理に生ポインタを直接使うことはほとんどなく、スマートポインタを使うのが基本です。主に2種類のスマートポインタを使い分けます。

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

## この章のまとめ

  * **例外処理**は `try`, `catch`, `throw` を使い、エラーが発生してもプログラムを安全に継続させるための仕組みです。
  * 手動のメモリ管理下で例外が発生すると、**リソースリーク**を引き起こす危険があります。
  * **RAIIイディオム**は、リソースの確保をコンストラクタ、解放をデストラクタで行うことで、リソース管理を自動化するC++の重要な設計思想です。
  * **スマートポインタ**はRAIIを動的メモリ管理に適用したもので、`new` と `delete` の手動管理を不要にします。
  * **`std::unique_ptr`** はオブジェクトの**唯一の所有権**を管理します。軽量であり、所有権が明確な場合に第一の選択肢となります。
  * **`std::shared_ptr`** はオブジェクトの**所有権を共有**します。参照カウントによって管理され、最後の所有者がいなくなったときにオブジェクトを解放します。

モダンC++プログラミングでは、`new` と `delete` を直接書くことは極力避け、RAIIとスマートポインタを全面的に活用することが、安全でメンテナンス性の高いコードへの第一歩です。

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

### 問題2: `shared_ptr` と所有権の共有

`Project` という名前のクラスを作成してください。コンストラクタでプロジェクト名を受け取り、デストラクタで「Project (プロジェクト名) is finished.」と表示します。

`main` 関数で、`"Project Phoenix"` という名前の `Project` オブジェクトを `std::make_shared` で作成してください。
次に、`std::vector<std::shared_ptr<Project>>` を作成し、作成した `shared_ptr` を2回 `push_back` してください。
その後、`shared_ptr` の参照カウント (`use_count()`) を表示してください。
最後に、`vector` を `clear()` して、再度参照カウントを表示してください。
プログラムの実行が終了するときに `Project` のデストラクタが呼ばれることを確認してください。

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
