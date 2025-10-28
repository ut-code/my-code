# my.code(); Runtime API

## runtime.ts

各言語のランタイムはRuntimeContextインターフェースの実装を返すフックを実装する必要があります。

runtime.ts の `useRuntime(lang)` は各言語のフックを呼び出し、その中で指定された言語のランタイムを返します。

関数はすべてuseCallbackやuseMemoなどを用いレンダリングごとに同じインスタンスを返すように実装してください。

### 共通

* ready: `boolean`
    * ランタイムの初期化が完了したか、不要である場合true
* tabSize: `number`
    * REPLおよびコードエディターののタブ幅を指定します。
* mutex?: `MutexInterface`
    * ランタイムに排他制御が必要な場合、MutexInterfaceのインスタンスを返してください。
* interrupt?: `() => Promise<void>`
    * 実行中のコマンドを中断します。呼び出し側でmutexのロックはされません

### REPL用

* runCommand?: `(command: string) => Promise<ReplOutput[]>`
    * コマンドを実行します。実行結果をReplOutputの配列で返します。
    * runCommandを呼び出す際には呼び出し側 (主に repl.tsx) でmutexをロックします。複数のコマンドを連続実行したい場合があるからです。
* checkSyntax?: `(code: string) => Promise<SyntaxStatus>`
    * コードの構文チェックを行います。行がコマンドとして完結していれば`complete`、次の行に続く場合(if文の条件式の途中など)は`incomplete`を返してください。
    * REPLでEnterを押した際の動作に影響します。
    * 呼び出し側でmutexのロックはされません
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
* prompt?: `string`
    * REPLの1行目のプロンプト文字列を指定します。
* promptMore?: `string`
    * REPLの2行目以降のプロンプト文字列を指定します。

### ファイル実行用

* runFiles: `(filenames: string[]) => Promise<ReplOutput[]>`
    * 指定されたファイルを実行します。ファイルの中身はEmbedContextから取得されます。
    * 呼び出し側でmutexのロックはされません
* getCommandlineStr: `(filenames: string[]) => string`
    * 指定されたファイルを実行するためのコマンドライン引数文字列を返します。表示用です。

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

## 各言語の実装

### Pyodide (Python)

Pyodide を web worker で動かしています。
ランタイムの初期化に時間がかかるため、バックグラウンドで初期化を行います。

