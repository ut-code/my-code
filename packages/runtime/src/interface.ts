import { MutexInterface } from "async-mutex";
import { ReplCommand, ReplOutput, SyntaxStatus } from "./repl";

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
    onOutput: (output: ReplOutput) => void
  ) => Promise<void>;
  checkSyntax?: (code: string) => Promise<SyntaxStatus>;
  splitReplExamples?: (content: string) => ReplCommand[];
  // file
  runFiles: (
    filenames: string[],
    files: Readonly<Record<string, string>>,
    onOutput: (output: ReplOutput) => void
  ) => Promise<void>;
  getCommandlineStr?: (filenames: string[]) => string;
  runtimeInfo?: RuntimeInfo;
}
export interface RuntimeInfo {
  prettyLangName: string;
  version?: string;
}
export interface LangConstants {
  tabSize: number;
  prompt?: string;
  promptMore?: string;
  returnPrefix?: string;
}

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
