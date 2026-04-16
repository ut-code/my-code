# コード実行環境について

my.code(); では、プログラミング言語ごとに異なる仕組みでコードを実行しています。
以下にそれぞれの言語の実行環境について説明します。

## ブラウザ内で実行される言語

以下の言語は、サーバーへの通信を行わず、すべてお使いのブラウザ内で実行されます。
そのため、インターネット接続が不安定な環境でも、一度ページが読み込まれれば実行可能です。

### Python

Python は [Pyodide](https://pyodide.org/) を使用して実行されます。
Pyodide は CPython（Python の公式実装）を WebAssembly にコンパイルしたものです。
Python コードはブラウザ内の Web Worker 上で動作するため、ページの描画をブロックせずに実行できます。

### Ruby

Ruby は [ruby.wasm](https://ruby.github.io/ruby.wasm/) を使用して実行されます。
ruby.wasm は公式の CRuby を WebAssembly にコンパイルしたものです。
Python と同様に Web Worker 上で動作します。

### JavaScript

JavaScript はブラウザ自身の JavaScript エンジンを利用して実行されます。
コードは安全なサンドボックス環境内で評価されます。

### TypeScript

TypeScript は [@typescript/vfs](https://www.npmjs.com/package/@typescript/vfs) を使用してブラウザ内でコンパイルされ、その後 JavaScript と同じ仕組みで実行されます。

## 外部サービスを利用して実行される言語

以下の言語は、外部のコンパイル・実行サービス（[Wandbox](https://wandbox.org/)）の API を通じて実行されます。
コードはサーバーに送信されてコンパイル・実行され、結果がブラウザに返されます。
そのため、実行にはインターネット接続が必要です。
また、入力したコードが Wandbox のサーバーに送信されることをご了承ください。

### C++

Wandbox の g++ (GNU C++ Compiler) を使用してコンパイル・実行されます。
最新の安定版コンパイラが使用され、Boost ライブラリも利用可能です。
実行時にエラーが発生した場合は、スタックトレースが表示されます。

### Rust

Wandbox の rustc (Rust コンパイラ) を使用してコンパイル・実行されます。
最新版のコンパイラが使用されます。

---

外部サービスを利用して実行される言語（C++・Rust）では、入力したコードが外部サーバーに送信されます。
個人情報や機密情報を含むコードは入力しないようにしてください。
