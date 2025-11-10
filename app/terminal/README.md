# my.code(); Runtime API

## runtime.tsx

各言語のランタイムはRuntimeContextインターフェースの実装を返すフックを実装する必要があります。

runtime.tsx の `useRuntime(lang)` は各言語のフックを呼び出し、その中で指定された言語のランタイムを返します。

関数はすべてuseCallbackやuseMemoなどを用いレンダリングごとに同じインスタンスを返すように実装してください。

### 共通

* ready: `boolean`
    * ランタイムの初期化が完了したか、不要である場合true
* mutex?: `MutexInterface`
    * ランタイムに排他制御が必要な場合、MutexInterfaceのインスタンスを返してください。
* interrupt?: `() => void`
    * 実行中のコマンドを中断します。
    * 呼び出し側でmutexのロックはしません。interrupt()を呼ぶ際にはrunCommand()やrunFiles()が実行中であるためmutexはすでにロックされているはずです。
    * interrupt()内で実行中の処理のPromiseをrejectしたあと、runtimeを再開する際の処理に必要であればmutexをロックすることも可能です。

### REPL用

* runCommand?: `(command: string) => Promise<ReplOutput[]>`
    * コマンドを実行します。実行結果をReplOutputの配列で返します。
    * runCommandを呼び出す際には呼び出し側 (主に repl.tsx) でmutexをロックします。複数のコマンドを連続実行したい場合があるからです。
* checkSyntax?: `(code: string) => Promise<SyntaxStatus>`
    * コードの構文チェックを行います。行がコマンドとして完結していれば`complete`、次の行に続く場合(if文の条件式の途中など)は`incomplete`を返してください。
    * REPLでEnterを押した際の動作に影響します。
    * 呼び出し側でmutexのロックはせず、必要であればcheckSyntax()内でロックします。
* splitReplExamples?: `(code: string) => ReplCommands[]`
    * markdown内に記述されているREPLのサンプルコードをパースします。例えば
    ```
    >>> if True:
    ...     print("Hello")
    Hello
    ```
    をsplitReplExamplesに通すと
    ```ts
    [
      {
        command: 'if True:\n    print("Hello")',
        output: {
          type: 'output',
          content: 'Hello'
        }
      }
    ]
    ```
    が返されるようにします。

### ファイル実行用

* runFiles: `(filenames: string[], files: Record<string, string>) => Promise<ReplOutput[]>`
    * 指定されたファイルを実行します。
    * EmbedContextから取得したfilesを呼び出し側で引数に渡します
    * 呼び出し側でmutexのロックはせず、必要であればrunFiles()内でロックします。
* getCommandlineStr: `(filenames: string[]) => string`
    * 指定されたファイルを実行するためのコマンドライン引数文字列を返します。表示用です。

### LangConstant

言語ごとに固定の定数です。

* tabSize: `number`
    * REPLおよびコードエディターののタブ幅を指定します。1以上
* prompt?: `string`
    * REPLの1行目のプロンプト文字列を指定します。
* promptMore?: `string`
    * REPLの2行目以降のプロンプト文字列を指定します。省略時はpromptが使われます

## embedContext.tsx

Replの実行結果(`replOutputs`)、ユーザーが編集したファイル(`files`)、ファイルの実行結果(`execResults`)の情報を保持します。

## terminal.tsx

xterm.jsを制御する useTerminal() フックを提供します。
リサイズやテーマ切り替えなどの処理を行います。

引数:
* getRows?: `(cols: number) => number`
    * ターミナルの幅がcolsの場合の高さの最小値を指定します。
    * 未指定または5未満の場合5になります。
    * 内部でuseRefを使用しターミナル初期化完了の瞬間のgetRows関数インスタンスが呼び出されるので、一時オブジェクトでも大丈夫
* onReady?: `() => void`
    * ターミナルが初期化された際に呼び出されます。
    * 内部でuseRefを使用しターミナル初期化完了の瞬間のonReady関数インスタンスが呼び出されるので、一時オブジェクトでも大丈夫

返り値:
* terminalRef: `RefObject<HTMLDivElement>`
    * ターミナルを描画するためのdiv要素にこのrefを渡してください。
* terminalInstanceRef: `RefObject<Terminal | null>`
    * xterm.jsのTerminalインスタンスへのrefです。
* termReady: `boolean`
    * ターミナルが初期化されたかどうかを示します。

## repl.tsx

ReplTerminal コンポーネントを提供します。
useRuntimeとuseTerminalを呼び出し、REPLの入出力、キーハンドリング処理を行います。

また、実行したコマンド結果はEmbedContextに送信されます。

シンタックスハイライトはprism.jsでパースしたものを独自処理で色付けしています。(highlight.ts 内の highlightCodeToAnsi 関数)
パース処理の実装は不要ですがhighlight.tsに言語定義のインポートとswitch文分岐の追加が必要です。

## editor.tsx

EditorComponent コンポーネントを提供します。

ファイルの内容はEmbedContextと同期されます。

## exec.tsx

実行ボタンと結果を表示する ExecFile コンポーネントを提供します。

実行結果はEmbedContextに送信されます。

## page.tsx, tests.ts

ブラウザーで localhost:3000/terminal を開くと、各実行環境のテストを行います。

ランタイムを追加した場合、ここにテストケースを追加してください。

## 各言語の実装

### Worker

web worker でコードを実行する実装です。worker側のスクリプトは /public にあります。
workerとの通信部分は言語によらず共通なので、それをworker/runtime.tsxで定義しています。
Contextは言語ごとに分けて(worker/pyodide.ts などで)定義しています。

Pythonの実行環境にはPyodideを使用しています。
PyodideにはKeyboardInterruptを送信する機能があるのでinterrupt()でそれを利用しています。

Rubyの実行環境にはruby.wasmを使用しています。

JavaScriptはeval()を使用しています。runFiles()のAPIだけ実装していません。

### Wandbox

wandbox.org のAPIを利用してC++コードを実行しています。C++以外にもいろいろな言語に対応しています。

APIから利用可能なコンパイラとオプションのリストが得られるので、言語ごとにそこからオプションを選択するロジックを実装しています。

C++ではg++の中でheadでない最新のものを選択し、warningスイッチオン、boost有効、std=最新を指定しています。
また、コード実行時にシグナルハンドラーをユーザーのコードに挿入し、エラー時にスタックトレースを表示する処理とそれをjs側でパースする処理を実装しています。

