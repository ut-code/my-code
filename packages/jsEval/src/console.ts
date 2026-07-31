import inspect from "object-inspect";

export type ConsoleOutput =
  | { type: "stdout"; message: string }
  | { type: "stderr"; message: string };

export type ConsoleEmitter = (output: ConsoleOutput) => void;

export interface ReplConsole {
  time: (label?: unknown) => void;
  timeEnd: (label?: unknown) => void;
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
}

function format(...args: unknown[]): string {
  // TODO: console.logの第1引数はフォーマット指定文字列を取ることができる
  // https://nodejs.org/api/util.html#utilformatformat-args
  return args.map((a) => (typeof a === "string" ? a : inspect(a))).join(" ");
}

function formatElapsedTime(ms: number): string {
  if (ms < 1000) return `${ms.toFixed(3)}ms`;
  return `${(ms / 1000).toFixed(3)}s`;
}

/**
 * REPL用のconsole実装を作成します。
 * console.time/timeEndのラベル管理を含め、出力はすべてemitに渡されます。
 */
export function createReplConsole(emit: ConsoleEmitter): ReplConsole {
  const timers = new Map<string, number>();

  return {
    time: (label: unknown = "default") => {
      const key = String(label);
      if (timers.has(key)) {
        emit({
          type: "stderr",
          message: `Warning: Label '${key}' already exists for console.time()`,
        });
        return;
      }
      timers.set(key, performance.now());
    },
    timeEnd: (label: unknown = "default") => {
      const key = String(label);
      const start = timers.get(key);
      if (start === undefined) {
        emit({
          type: "stderr",
          message: `Warning: No such label '${key}' for console.timeEnd()`,
        });
        return;
      }
      timers.delete(key);
      emit({
        type: "stdout",
        message: `${key}: ${formatElapsedTime(performance.now() - start)}`,
      });
    },
    log: (...args: unknown[]) => {
      emit({ type: "stdout", message: format(...args) });
    },
    error: (...args: unknown[]) => {
      emit({ type: "stderr", message: format(...args) });
    },
    warn: (...args: unknown[]) => {
      emit({ type: "stderr", message: format(...args) });
    },
    info: (...args: unknown[]) => {
      emit({ type: "stdout", message: format(...args) });
    },
  };
}
