---
id: cpp-intro-setup
title: おすすめのセットアップ
level: 3
question:
  - Visual Studio Communityは無料ですか？
  - macOSでxcode-select --installを実行すると何がインストールされますか？
  - Linuxのインストールコマンドは何をしていますか？
  - Visual Studio Codeの拡張機能とは、具体的にどのようなものをインストールすれば良いですか？
---

### おすすめのセットアップ

  * **Windows:** **Visual Studio Community** をインストールするのが最も簡単です。インストーラーで「C++によるデスクトップ開発」ワークロードを選択すれば、必要なものがすべて揃います。
  * **macOS:** ターミナルで `xcode-select --install` を実行し、**Xcode Command Line Tools** をインストールします。これにはClangコンパイラが含まれます。エディタは **Visual Studio Code** がおすすめです。
  * **Linux (Ubuntu/Debian系):** ターミナルで `sudo apt update && sudo apt install build-essential g++` を実行してGCCコンパイラをインストールします。エディタは **Visual Studio Code** がおすすめです。
