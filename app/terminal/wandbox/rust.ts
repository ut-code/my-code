import { ReplOutput } from "../repl";
import { compileAndRun, CompilerInfo, SelectedCompiler } from "./api";

import prog_rs from "./rust/prog.rs?raw";

export function selectRustCompiler(
  compilerList: CompilerInfo[]
): SelectedCompiler {
  // 最初のRustコンパイラを使う
  const selectedCompiler = compilerList.find((c) => c.language === "Rust");
  if (!selectedCompiler) {
    throw new Error("compiler not found");
  }

  return {
    compilerName: selectedCompiler.name,
    compilerOptions: [],
    compilerOptionsRaw: ["-Cdebuginfo=1"],
    getCommandlineStr: (filenames: string[]) =>
      [
        "rustc",
        "-Cdebuginfo=1",
        filenames[0],
        "&&",
        "./" + filenames[0].replace(/\.rs$/, ""),
      ].join(" "),
  };
}

export async function rustRunFiles(
  options: SelectedCompiler,
  files: Record<string, string | undefined>,
  filenames: string[],
  onOutput: (output: ReplOutput) => void
): Promise<string> {
  // Regular expressions for parsing stack traces
  const STACK_FRAME_PATTERN = /^\s*\d+:/;
  const LOCATION_PATTERN = /^\s*at .\//;
  const SYSTEM_CODE_PATTERN = /^\s*at .\/prog.rs/;
  
  // Track state for processing panic traces
  let inPanicHook = false;
  let foundBacktraceHeader = false;
  const traceLines: string[] = [];

  const mainModule = filenames[0].replace(/\.rs$/, "");
  const result = await compileAndRun({
    ...options,
    // メインファイルでmod宣言したものをこちらに移す
    code:
      [...(files[filenames[0]]?.matchAll(/mod\s+\w+\s*;/g) ?? [])].reduce(
        (prev, m) => prev + `${m}\n`,
        ""
      ) + prog_rs.replaceAll("__user_main_module__", mainModule),
    codes: {
      ...files,
      // メインファイルのみ:
      // main()を強制的にpubに書き換え、
      // mod foo; を use super::foo; に書き換える
      [filenames[0]]: files[filenames[0]]
        ?.replace(/(?:pub\s+)?(fn\s+main\s*\()/g, "pub $1")
        .replaceAll(/mod\s+(\w+)\s*;/g, "use super::$1;"),
    },
  }, (event) => {
    const { ndjsonType, output } = event;
    
    // Check for panic hook marker
    if (ndjsonType === "StdErr" && output.message === "#!my_code_panic_hook:") {
      inPanicHook = true;
      return;
    }
    
    if (inPanicHook && ndjsonType === "StdErr") {
      // Check for stack backtrace header
      if (output.message === "stack backtrace:") {
        foundBacktraceHeader = true;
        onOutput({
          type: "trace",
          message: "Stack trace (filtered):",
        });
        return;
      }
      
      if (foundBacktraceHeader) {
        // Process stack trace lines
        // Look for pattern: "   N: ..." followed by "      at ./file.rs:line"
        if (STACK_FRAME_PATTERN.test(output.message)) {
          traceLines.push(output.message);
        } else if (LOCATION_PATTERN.test(output.message)) {
          if (traceLines.length > 0) {
            // Check if this is user code (not prog.rs)
            if (!SYSTEM_CODE_PATTERN.test(output.message)) {
              onOutput({
                type: "trace",
                message: traceLines[traceLines.length - 1].replace("prog::", ""),
              });
              onOutput({
                type: "trace",
                message: output.message,
              });
            }
            traceLines.pop(); // Remove the associated trace line (regardless of match)
          }
        }
        return;
      }
      
      // Output panic messages as errors
      onOutput({
        type: "error",
        message: output.message,
      });
      return;
    }
    
    // Output normally
    onOutput(output);
  });

  if (result.status !== "0") {
    onOutput({
      type: "system",
      message: `ステータス ${result.status} で異常終了しました`,
    });
  }

  return result.status;
}
