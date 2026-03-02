import { MutexInterface } from "async-mutex";

/**
 * 各言語の実行環境のインタフェース
 *
 * ここでは、runtimeを利用する側の注意点を @remarks
 * runtimeを実装する側の注意点を @privateRemarks
 * で表記します。
 *
 * @privateRemarks
 * このインタフェースのプロパティのうち関数やオブジェクトはすべてuseCallbackやuseMemoなどを用いレンダリングごとに同じインスタンスを返すように実装してください。
 *
 */
export interface RuntimeContext {
  /**
   * 実行環境を初期化します。
   *
   * @remarks
   * useRuntime() 内のuseEffectで呼び出されます。
   * useRuntime()でコンテキストを取得する場合はinitを呼び出す必要はないです。
   *
   * @privateRemarks
   * 初期化にコストがかかるものは、init()で初期化フラグがトリガーされたときだけ初期化するようにします。
   * useRuntime() が複数回使われた場合はinitも複数回呼ばれるため、
   * init()はフラグを立てるだけにし、完了する前にreturnしてよいです。
   * 初期化とcleanupはuseEffect()で非同期に行うのがよいです。
   *
   */
  init?: () => void;
  /**
   * ランタイムの初期化が完了したか、不要である場合true
   */
  ready: boolean;
  /**
   * 実行環境を排他制御するmutex
   * 排他制御が不要な場合はundefined
   *
   * @privateRemarks
   * 実行環境に排他制御が必要な場合、MutexInterfaceのインスタンスを返してください。
   */
  mutex?: MutexInterface;
  /**
   * 実行中のコマンドを中断
   *
   * @remarks
   * 呼び出し側でmutexのロックはしません。
   * interrupt()を呼ぶ際にはrunCommand()やrunFiles()が実行中であるためmutexはすでにロックされているはずです。
   *
   * @privateRemarks
   * interrupt関数自体は同期関数で、mutexのロック状態に関わらず即座にreturnしてください。
   * 実行環境を中断したあと再起動する際の処理に必要であればmutexをロックして非同期に処理を続行することも可能です。
   *
   */
  interrupt?: () => void;

  /**
   * コマンドを実行します。
   *
   * @param command - 実行するコマンド
   * @param onOutput - 実行結果を返すコールバック
   * @returns 実行が完了した際に解決するPromise
   * ただし、onOutputコールバックは実行完了後に呼ばれる可能性もあります(実行したコマンドが非同期処理を含む場合)。
   *
   * @remarks
   * runCommandを呼び出す際には呼び出し側でmutexをロックします。
   * 複数のコマンドを連続実行したい場合があるからです。
   * @privateRemarks
   * runCommandの中ではmutexはロックしないでください。
   * mutexがロックされていなかったらthrowするチェックを入れても良い
   */
  runCommand?: (
    command: string,
    onOutput: (output: ReplOutput | UpdatedFile) => void
  ) => Promise<void>;
  /**
   * コードの構文チェックを行います。
   * REPLでEnterを押した際の動作に影響します。
   *
   * @param code - チェックするコード
   * @returns 行がコマンドとして完結していれば`complete`、次の行に続く場合は`incomplete`
   *
   * @remarks
   * 呼び出し側でmutexのロックはしません。
   * @privateRemarks
   * 必要であればcheckSyntax()内でmutexをロックしても良い。
   */
  checkSyntax?: (code: string) => Promise<SyntaxStatus>;
  /**
   * markdown内に記述されているREPLのサンプルコードをパースします。
   *
   * @example
   * ```
   * >>> if True:
   * ...     print("Hello")
   * Hello
   * ```
   * をsplitReplExamplesに通すと
   * ```
   * [
   *   {
   *     command: 'if True:\n    print("Hello")',
   *     output: {
   *       type: 'output',
   *       content: 'Hello'
   *     }
   *   }
   * ]
   * ```
   * が返されるようにします。
   */
  splitReplExamples?: (content: string) => ReplCommand[];

  /**
   * 指定されたファイルを実行します。
   *
   * filenames パラメーターの意味は言語の実装により異なります。
   * 例えばRustではメインの.rsファイル1つのみを指定し、
   * C++ではコンパイルする.cppファイルをすべて指定します。
   *
   * @param filenames - 実行するファイル名
   * @param files - 実行環境に渡すファイル(実行するものと無関係のものを含んでも良い)
   * @param onOutput - 実行結果を返すコールバック
   * @returns 実行が完了した際に解決するPromise
   * ただし、onOutputコールバックは実行完了後に呼ばれる可能性もあります(実行したコマンドが非同期処理を含む場合)。
   *
   * @remarks
   * 呼び出し側でmutexのロックはしません。
   * @privateRemarks
   * 必要であればrunFiles()内でmutexをロックしても良い。
   */
  runFiles: (
    filenames: string[],
    files: Readonly<Record<string, string>>,
    onOutput: (output: ReplOutput | UpdatedFile) => void
  ) => Promise<void>;
  /**
   * 指定されたファイルを実行するためのコマンドライン引数文字列を返します。
   * 表示用です。
   */
  getCommandlineStr?: (filenames: string[]) => string;
  /**
   * 実行環境の名前、バージョン番号などの情報を返します。
   */
  runtimeInfo?: RuntimeInfo;
}
export interface RuntimeInfo {
  prettyLangName: string;
  version?: string;
}

export type ReplOutputType =
  | "stdout"
  | "stderr"
  | "error"
  | "return"
  | "trace"
  | "system";
export interface ReplOutput {
  type: ReplOutputType; // 出力の種類
  message: string; // 出力メッセージ
}
export interface UpdatedFile {
  type: "file";
  filename: string;
  content: string;
}

export interface ReplCommand {
  command: string;
  output: ReplOutput[];
  commandId?: string; // Optional for backward compatibility
}
export type SyntaxStatus = "complete" | "incomplete" | "invalid"; // 構文チェックの結果

export const emptyMutex: MutexInterface = {
  async runExclusive<T>(fn: () => Promise<T> | T) {
    const result = fn();
    return result instanceof Promise ? result : Promise.resolve(result);
  },
  acquire: async () => {
    return () => {}; // Release function (no-op)
  },
  waitForUnlock: async () => {},
  isLocked: () => false,
  cancel: () => {},
  release: () => {},
};
