---
id: cpp-intro-run
title: コンパイルと実行
level: 3
---

### コンパイルと実行

このコードを実行するには、まず**コンパイル**して実行可能ファイルを生成する必要があります。ターミナル（Windowsの場合はコマンドプロンプトやPowerShell）で以下のコマンドを実行します。

```bash
# g++ (GCC) または clang++ (Clang) を使ってコンパイル
# -o main は出力ファイル名を main にするという意味
g++ main.cpp -o main

# 生成された実行可能ファイルを実行
./main
```

```powershell
# Visual C++ (MSVC) を使う場合
cl main.cpp /Fe:main.exe

# 生成された実行可能ファイルを実行
main.exe
```

このウェブサイト上の実行環境で動かす場合は、以下の実行ボタンをクリックしてください。
実行すると、ターミナルに以下のように表示されるはずです。

```cpp-exec:main.cpp
Hello, World!
```

PythonやJavaScriptのようなインタプリタ言語とは異なり、C++では「コンパイル」という一手間が必要です。このステップにより、実行前にコード全体がチェックされ、高速なネイティブコードが生成されます。
