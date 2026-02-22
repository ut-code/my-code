---
id: cpp-classes-advanced-shallow-copy
title: 何もしないとどうなる？ (浅いコピー)
level: 3
---

### 何もしないとどうなる？ (浅いコピー)

まず、コピーの機能を自分で作らなかった場合に何が起きるか見てみましょう。
コンパイラは、メンバ変数を単純にコピーするだけの「浅いコピー」を行います。

ここでは、`int`へのポインタを一つだけ持つ`ResourceHolder`（リソース保持者）というクラスを考えます。

```cpp:shallow_copy.cpp
// 悪い例：浅いコピーの問題点
#include <iostream>

class ResourceHolder {
private:
    int* m_data; // 動的に確保したデータへのポインタ
public:
    ResourceHolder(int value) {
        m_data = new int(value); // メモリを確保
        std::cout << "Resource " << *m_data << " created. (at " << m_data << ")" << std::endl;
    }
    ~ResourceHolder() {
        std::cout << "Resource " << *m_data << " destroyed. (at " << m_data << ")" << std::endl;
        delete m_data; // メモリを解放
    }
    // コピーコンストラクタや代入演算子を定義していない！
};

int main() {
    ResourceHolder r1(10);
    ResourceHolder r2 = r1; // 浅いコピーが発生！
    // r1.m_data と r2.m_data は同じアドレスを指してしまう
    
    // main()終了時、r1とr2のデストラクタが呼ばれる
    // 同じメモリを2回deleteしようとしてクラッシュ！💥
    return 0;
}
```
```cpp-exec:shallow_copy.cpp
Resource 10 created. (at 0x139f065e0)
Resource 10 destroyed. (at 0x139f065e0)
Resource 107521 destroyed. (at 0x1a4012b0)
free(): double free detected in tcache 2
```

この例では、`r2`が作られるときに`r1`のポインタ`m_data`の値（メモリアドレス）だけがコピーされます。その結果、2つのオブジェクトが1つのメモリ領域を指してしまいます。プログラム終了時にそれぞれのデストラクタが呼ばれ、同じメモリを2回解放しようとしてエラーになります。
