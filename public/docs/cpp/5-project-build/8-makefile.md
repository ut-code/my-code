---
id: cpp-project-build-8-makefile
title: Makefileによる自動化
level: 3
---

### Makefileによる自動化

`make`は、ファイルの依存関係と更新ルールを記述した`Makefile`というファイルに従って、ビルドプロセスを自動化するツールです。

以下は、非常にシンプルな`Makefile`の例です。

```makefile
# コンパイラを指定
CXX = g++
# コンパイルオプションを指定
CXXFLAGS = -std=c++17 -Wall

# 最終的なターゲット（実行可能ファイル名）
TARGET = my_app

# ソースファイルとオブジェクトファイル
SRCS = math_app.cpp math_utils.cpp
OBJS = $(SRCS:.cpp=.o)

# デフォルトのターゲット (makeコマンド実行時に最初に実行される)
all: $(TARGET)

# 実行可能ファイルの生成ルール
$(TARGET): $(OBJS)
    $(CXX) $(CXXFLAGS) -o $(TARGET) $(OBJS)

# オブジェクトファイルの生成ルール (%.o: %.cpp)
# .cppファイルから.oファイルを作るための汎用ルール
%.o: %.cpp
    $(CXX) $(CXXFLAGS) -c $< -o $@

# 中間ファイルなどを削除するルール
clean:
    rm -f $(OBJS) $(TARGET)
```

この`Makefile`があるディレクトリで、ターミナルから`make`と入力するだけで、必要なコンパイルとリンクが自動的に実行されます。`math_app.cpp`だけを変更した場合、`make`は`main.o`だけを再生成し、再リンクするため、ビルド時間が短縮されます。
