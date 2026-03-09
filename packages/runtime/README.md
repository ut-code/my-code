# my.code(); Runtime API

## RuntimeContext (interface.ts)

各言語の実行環境は`RuntimeContext`インターフェースの実装を返すフックを実装する必要があります。

## context.tsx

* RuntimeProvider がすべての言語の実行環境のコンテキストを管理します。
* useRuntime() で使用したい言語のコンテキストを取得します。
* useRuntimeAll() ですべての言語のコンテキストを取得します。ただしinit()は自動的に呼び出されません

## languages.ts

* markdownで指定される可能性のある言語名をすべて列挙します。
* ReactAce, ReactSyntaxHighlighter, Prism.js における言語名との対応関係を定義します。
* ReactAceで利用可能な言語の場合tab幅も指定します。
* REPL実行環境が利用可能な言語の場合プロンプト文字列などのパラメータを指定します。

## tests

* `npm run test -w packages/runtime` でvitestを使ってテストを実行できます
* my.code(); の /terminal ページでMochaを使ってテストを実行できます
* どちらからでも実行できるようテスト本体は ./tests/repl.ts, ./tests/fileExecution.ts に記述しています。
新しい言語の実行環境を追加した場合、ここにテストケースを追加してください。

## 各言語の実装

### Worker

web worker でコードを実行する実装です。
workerとの通信部分は言語によらず共通なので、それをworker/runtime.tsxで定義しています。

* Python (Pyodide)
    * PyodideにはKeyboardInterruptを送信する機能があるのでinterrupt()でそれを利用しています。
    * next.config.tsで指定しているwebpackのPyodidePluginにより、pyodide本体は `/_next/static/pyodide/バージョン/` 以下に出力され、それをimportします。
    * ただしvitest時には利用できないのでCDNにフォールバックしています
* Ruby (ruby.wasm)
* JavaScript (eval)
    * 実装は複雑になるので別パッケージ (packages/jsEval) に分離し、独立したテストもそちらに記述しています

### Wandbox

wandbox.org のAPIを利用してコードを実行します。

APIから利用可能なコンパイラとオプションのリストが得られるので、言語ごとにそこからオプションを選択するロジックを実装しています。

* C++
    * g++の中でheadでない最新のものを選択し、warningスイッチオン、boost有効、std=最新を指定しています。
    * また、コード実行時にシグナルハンドラーをユーザーのコードに挿入し、エラー時にスタックトレースを表示する処理とそれをjs側でパースする処理を実装しています。
* Rust
    * 最新のrustcを選択し、-Cdebuginfo=1を追加しています。
    * ユーザーのコードをモジュールとしてprog.rsのmain()から呼び出す形に変更しており、ユーザーのコードに `mod foo;` → `use super::foo;`, `fn main()` → `pub fn main()` の改変を加えています。

### TypeScript

[@typescript/vfs](https://www.npmjs.com/package/@typescript/vfs) を使用してブラウザ上でTypeScriptコードをコンパイルし、jsEvalランタイムに渡します。
