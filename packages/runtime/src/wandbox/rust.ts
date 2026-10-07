import {
  Diagnostic,
  DiagnosticFrame,
  DiagnosticSeverity,
  ReplOutput,
} from "../interface";
import { compileAndRun, CompilerInfo, SelectedCompiler } from "./api";

import prog_rs from "./rust/prog.rs?raw";

const RUSTC_HEADER_REGEX =
  /^(error(?:\[[A-Z0-9]+\])?|warning(?:\[[A-Z0-9]+\])?|note(?:\[[A-Z0-9]+\])?):\s*(.*)$/;
const RUSTC_SPAN_REGEX = /^\s*-->\s*([^:\n]+):(\d+):(\d+)/;

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
    prettyLangName: "Rust",
    version: selectedCompiler.version,
  };
}

export async function rustRunFiles(
  options: SelectedCompiler,
  files: Record<string, string | undefined>,
  filenames: string[],
  onOutput: (output: ReplOutput) => void,
  onDiagnostic?: (diagnostic: Diagnostic) => void
): Promise<void> {
  // Regular expressions for parsing stack traces
  const STACK_FRAME_PATTERN = /^\s*\d+:/;
  const LOCATION_PATTERN = /^\s*at\s+/;

  const isSystemCode = (msg: string) => {
    return (
      msg.includes("prog.rs") ||
      msg.includes("/rustc/") ||
      msg.includes("/library/") ||
      msg.includes("/alloc/") ||
      msg.includes("/core/") ||
      msg.includes("/std/") ||
      msg.includes("/.cargo/") ||
      msg.includes("/.rustup/") ||
      msg.includes("<")
    );
  };

  // Track state for processing panic traces
  let inPanicHook = false;
  let foundBacktraceHeader = false;
  let panicLoc: DiagnosticFrame | null = null;
  const panicMessages: string[] = [];
  const runtimeFrames: DiagnosticFrame[] = [];
  const traceLines: string[] = [];

  // Track state for processing compile diagnostics
  let currentHeader: { level: DiagnosticSeverity; message: string } | null =
    null;

  const mainModule = filenames[0].replace(/\.rs$/, "");
  await compileAndRun(
    {
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
    },
    (event) => {
      const { ndjsonType, output } = event;

      // Parse compiler messages for diagnostics
      if (ndjsonType === "CompilerMessageE") {
        const headerMatch = RUSTC_HEADER_REGEX.exec(output.message);
        if (headerMatch) {
          const level = headerMatch[1];
          const msg = headerMatch[2];
          if (
            !msg.startsWith("aborting due to") &&
            !msg.startsWith("For more information about this error")
          ) {
            const severity: DiagnosticSeverity = level.startsWith("error")
              ? "error"
              : level.startsWith("warning")
                ? "warning"
                : "info";
            currentHeader = { level: severity, message: msg };
          } else {
            currentHeader = null;
          }
        }

        const spanMatch = RUSTC_SPAN_REGEX.exec(output.message);
        if (spanMatch && currentHeader) {
          const rawFilename = spanMatch[1]
            .replace(/^\.\//, "")
            .replace(/^\//, "");
          const lineNum = parseInt(spanMatch[2], 10);
          const colNum = parseInt(spanMatch[3], 10);

          if (rawFilename !== "prog.rs" && !rawFilename.startsWith("<")) {
            onDiagnostic?.({
              frames: [
                {
                  filename: rawFilename,
                  startLineNumber: lineNum,
                  startColumn: colNum,
                },
              ],
              message: currentHeader.message,
              severity: currentHeader.level,
            });
          }
          currentHeader = null;
        }
      }

      // Check for panic hook marker
      if (
        ndjsonType === "StdErr" &&
        output.message === "#!my_code_panic_hook:"
      ) {
        inPanicHook = true;
        return;
      }

      if (inPanicHook && ndjsonType === "StdErr") {
        if (!foundBacktraceHeader) {
          // Check for panic location in header line (e.g. thread 'main' panicked at sub.rs:2:5:)
          const locMatch =
            /thread '.*?' panicked at (?:(?:\.\/)?([^:\s]+)):(\d+):(\d+):/.exec(
              output.message
            );
          if (locMatch) {
            const fn = locMatch[1].replace(/^\.\//, "").replace(/^\//, "");
            if (fn !== "prog.rs" && !fn.startsWith("<")) {
              panicLoc = {
                filename: fn,
                startLineNumber: parseInt(locMatch[2], 10),
                startColumn: parseInt(locMatch[3], 10),
              };
            }
            onOutput({
              type: "error",
              message: output.message,
            });
            return;
          }

          // Check for stack backtrace header
          if (output.message === "stack backtrace:") {
            foundBacktraceHeader = true;
            onOutput({
              type: "trace",
              message: "Stack trace (filtered):",
            });
            return;
          }

          // Capture panic message lines
          if (output.message.trim() && !output.message.startsWith("thread ")) {
            panicMessages.push(output.message.trim());
          }

          // Output panic messages as errors
          onOutput({
            type: "error",
            message: output.message,
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
              const lastTraceLine = traceLines[traceLines.length - 1];
              // Check if this is user code (not system / std library / prog.rs)
              if (
                !isSystemCode(output.message) &&
                !isSystemCode(lastTraceLine)
              ) {
                onOutput({
                  type: "trace",
                  message: lastTraceLine.replace("prog::", ""),
                });
                onOutput({
                  type: "trace",
                  message: output.message,
                });

                const m = /^\s*at\s+(?:.*\/)?([^:\s]+):(\d+):?(\d+)?/.exec(
                  output.message
                );
                if (m) {
                  const fn = m[1].replace(/^\.\//, "").replace(/^\//, "");
                  if (!isSystemCode(fn)) {
                    runtimeFrames.push({
                      filename: fn,
                      startLineNumber: parseInt(m[2], 10),
                      startColumn: m[3] ? parseInt(m[3], 10) : undefined,
                    });
                  }
                }
              }
              traceLines.pop(); // Remove the associated trace line (regardless of match)
            }
          }
          return;
        }
      }

      // Output normally
      onOutput(output);
    }
  );

  if (inPanicHook) {
    const loc = panicLoc as DiagnosticFrame | null;
    const finalFrames =
      runtimeFrames.length > 0 ? runtimeFrames : loc ? [loc] : [];
    if (finalFrames.length > 0) {
      const fallbackMsg = loc
        ? `panicked at ${loc.filename}:${loc.startLineNumber}`
        : "Panic";
      const message = panicMessages.filter(Boolean).join("\n") || fallbackMsg;
      onDiagnostic?.({
        frames: finalFrames,
        message,
        severity: "error",
      });
    }
  }
}
