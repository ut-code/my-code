---
id: cpp-classes-advanced-static-member-example
title: 実装例
level: 3
---

### 実装例

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
