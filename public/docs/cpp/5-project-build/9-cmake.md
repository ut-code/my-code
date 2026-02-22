---
id: cpp-project-build-9-cmake
title: CMakeによるモダンなビルド管理
level: 3
---

### CMakeによるモダンなビルド管理

`Makefile`は強力ですが、OSやコンパイラに依存する部分があり、複雑なプロジェクトでは管理が難しくなります。

**CMake**は、`Makefile`やVisual Studioのプロジェクトファイルなどを自動的に生成してくれる、クロスプラットフォーム対応のビルドシステムジェネレータです。`CMakeLists.txt`という設定ファイルに、より抽象的なビルドのルールを記述します。

```cmake
# CMakeの最低要求バージョン
cmake_minimum_required(VERSION 3.10)

# プロジェクト名を設定
project(MyAwesomeApp)

# C++の標準バージョンを設定
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 実行可能ファイルを追加
# add_executable(実行ファイル名 ソースファイル1 ソースファイル2 ...)
add_executable(my_app math_app.cpp math_utils.cpp)
```

この`CMakeLists.txt`を使ってビルドする一般的な手順は以下の通りです。

```bash
# 1. ビルド用の中間ファイルを置くディレクトリを作成し、移動する
mkdir build
cd build

# 2. CMakeを実行して、ビルドシステム（この場合はMakefile）を生成する
cmake ..

# 3. make (または cmake --build .) を実行してビルドする
make

# 4. 実行する
./my_app
```

CMakeは、ライブラリの検索、依存関係の管理、テストの実行など、大規模プロジェクトに必要な多くの機能を備えており、現在のC++開発における標準的なツールとなっています。
