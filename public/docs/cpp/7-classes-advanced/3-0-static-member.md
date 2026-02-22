---
id: cpp-classes-advanced-static-member
title: staticメンバ
level: 2
---

## staticメンバ

通常、クラスのメンバ変数はオブジェクトごとに個別のメモリ領域を持ちます。しかし、あるクラスの**全てのオブジェクトで共有したい**情報もあります。例えば、「これまでに生成されたオブジェクトの総数」などです。このような場合、**staticメンバ**を使用します。

`static` キーワードを付けて宣言されたメンバ変数は、特定のオブジェクトに属さず、クラスそのものに属します。そのため、全オブジェクトでただ1つの実体を共有します。これを**クラス変数**と呼ぶこともあります。

  * **宣言**: クラス定義の中で `static` を付けて行います。
  * **定義**: クラス定義の外（ソースファイル）で、メモリ上の実体を確保し、初期化します。

`static` キーワードを付けて宣言されたメンバ関数は、特定のオブジェクトに依存せずに呼び出せます。そのため、`this` ポインタ（後述）を持ちません。

  * **アクセス**: staticメンバ変数や他のstaticメンバ関数にはアクセスできますが、非staticなメンバ（インスタンスごとのメンバ変数やメンバ関数）にはアクセスできません。
  * **呼び出し**: `クラス名::関数名()` のように、オブジェクトを生成しなくても呼び出せます。

ゲームに登場する `Player` クラスがあり、現在何人のプレイヤーが存在するかを管理する例を見てみましょう。

```cpp:static_members.cpp
#include <iostream>
#include <string>

class Player {
private:
    std::string name;
    // (1) staticメンバ変数の宣言
    static int playerCount;

public:
    Player(const std::string& name) : name(name) {
        playerCount++; // オブジェクトが生成されるたびにインクリメント
        std::cout << name << " がゲームに参加しました。現在のプレイヤー数: " << playerCount << std::endl;
    }

    ~Player() {
        playerCount--; // オブジェクトが破棄されるたびにデクリメント
        std::cout << name << " がゲームから退出しました。現在のプレイヤー数: " << playerCount << std::endl;
    }

    // (2) staticメンバ関数の宣言
    static int getPlayerCount() {
        // name などの非staticメンバにはアクセスできない
        return playerCount;
    }
};

// (3) staticメンバ変数の定義と初期化
int Player::playerCount = 0;

int main() {
    // オブジェクトがなくてもstaticメンバ関数を呼び出せる
    std::cout << "ゲーム開始時のプレイヤー数: " << Player::getPlayerCount() << std::endl;
    std::cout << "---" << std::endl;

    Player p1("Alice");
    Player p2("Bob");

    {
        Player p3("Charlie");
        std::cout << "現在のプレイヤー数 (p1経由): " << p1.getPlayerCount() << std::endl;
    } // p3のスコープが終わり、デストラクタが呼ばれる

    std::cout << "---" << std::endl;
    std::cout << "ゲーム終了時のプレイヤー数: " << Player::getPlayerCount() << std::endl;

    return 0;
}
```

```cpp-exec:static_members.cpp
ゲーム開始時のプレイヤー数: 0
---
Alice がゲームに参加しました。現在のプレイヤー数: 1
Bob がゲームに参加しました。現在のプレイヤー数: 2
Charlie がゲームに参加しました。現在のプレイヤー数: 3
現在のプレイヤー数 (p1経由): 3
Charlie がゲームから退出しました。現在のプレイヤー数: 2
---
ゲーム終了時のプレイヤー数: 2
Alice がゲームから退出しました。現在のプレイヤー数: 1
Bob がゲームから退出しました。現在のプレイヤー数: 0
```

`playerCount` は `p1`, `p2`, `p3` の全てで共有されており、一つの値が更新されていることがわかります。
