---
id: cpp-classes-basics-practice2
title: '練習問題2: 書籍クラス'
level: 3
question:
  - privateで定義した複数のメンバ変数（タイトル、著者、ページ数）をコンストラクタで初期化するにはどう書けばよいですか？
  - 本の情報を整形して出力するprintInfo()メソッドの具体的な実装方法が知りたいです。
  - main関数でBookクラスのインスタンスを生成し、その情報を表示する具体的なコード例が知りたいです。
---

### 練習問題2: 書籍クラス

タイトル(`title`)、著者(`author`)、ページ数(`pages`)を[[メンバ変数]]として持つ`Book`[[クラス]]を作成してください。

  - [[メンバ変数]]は[[`private`]]で定義してください。
  - [[コンストラクタ]]で、タイトル、著者、ページ数を初期化できるようにしてください。
  - 本の情報を整形してコンソールに出力する`printInfo()`メソッドを[[`public`]]で実装してください。（例: `Title: [タイトル], Author: [著者], Pages: [ページ数] pages`）
  - [[`main`関数]]で`Book`クラスの[[インスタンス]]を生成し、その情報を表示してください。

```cpp:practice7_2.cpp
#include <iostream>
#include <string>
// ここにBookクラスを定義してください

int main() {
    // ここでBookクラスのインスタンスを生成し、情報を表示してください

    return 0;
}
```

```cpp-exec:practice7_2.cpp
Title: The Great Gatsby, Author: F. Scott Fitzgerald, Pages: 180 pages
```
