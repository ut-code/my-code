import { MutexInterface } from "async-mutex";

/**
 * Common runtime context interface for different languages
 *
 * see README.md for details
 *
 */
export interface RuntimeContext {
  init?: () => void;
  ready: boolean;
  mutex?: MutexInterface;
  interrupt?: () => void;
  // repl
  runCommand?: (
    command: string,
    onOutput: (output: ReplOutput | UpdatedFile) => void
  ) => Promise<void>;
  checkSyntax?: (code: string) => Promise<SyntaxStatus>;
  splitReplExamples?: (content: string) => ReplCommand[];
  // file
  runFiles: (
    filenames: string[],
    files: Readonly<Record<string, string>>,
    onOutput: (output: ReplOutput | UpdatedFile) => void
  ) => Promise<void>;
  getCommandlineStr?: (filenames: string[]) => string;
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
