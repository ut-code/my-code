import {
  Diagnostic,
  DiagnosticFrame,
  DiagnosticSeverity,
  ReplOutput,
} from "../interface";
import { compileAndRun, CompilerInfo, SelectedCompiler } from "./api";

import _stacktrace_cpp from "./cpp/_stacktrace.cpp?raw";

const GCC_DIAG_REGEX =
  /^(?:.*\/)?([^:\n]+):(\d+):(?:(\d+):)?\s*(fatal error|error|warning|note):\s*(.*)$/;
const LD_DIAG_REGEX =
  /^(?:(?:\/usr\/bin\/ld:\s+)?(?:.*\/)?([^:\n]+)):(\d+):(?:\([^)]+\):)?\s*(undefined reference to .*)$/;

export function selectCppCompiler(
  compilerList: CompilerInfo[]
): SelectedCompiler {
  const compilerListForLang = compilerList.filter((c) => c.language === "C++");
  // headでない最初のgccを使う
  const selectedCompiler = compilerListForLang.find(
    (c) => c.name.includes("gcc") && !c.name.includes("head")
  );
  if (!selectedCompiler) {
    throw new Error("compiler not found");
  }

  const options: SelectedCompiler = {
    compilerName: selectedCompiler.name,
    compilerOptions: [],
    compilerOptionsRaw: [],
    getCommandlineStr: () => "",
    prettyLangName: "GCC",
    version: selectedCompiler.version,
  };
  const commandline: string[] = ["g++"]; // selectedCompiler["display-compile-command"]

  // singleオプション:
  const warningSwitch = selectedCompiler.switches.find(
    (s) => s.name === "warning"
  );
  if (warningSwitch && warningSwitch.type === "single") {
    options.compilerOptions.push("warning");
    commandline.push(warningSwitch["display-flags"]);
  } else {
    console.warn("warning switch not found");
  }

  // selectオプション:
  for (const switchSelect of selectedCompiler.switches.filter(
    (s) => s.type === "select"
  )) {
    // boost最新、stdは最新を選ぶ ほかはデフォルト
    if (switchSelect.name.includes("boost")) {
      const boostLatestOption = switchSelect.options
        .filter((o) => !o.name.includes("nothing"))
        .sort()
        .reverse()[0];
      if (boostLatestOption) {
        options.compilerOptions.push(boostLatestOption.name);
        // options.commandline.push(boostLatestOption["display-flags"]);
      } else {
        console.warn("boost option not found");
      }
    } else if (switchSelect.name.includes("std")) {
      const stdLatestOption = switchSelect.options
        .filter((o) => o.name.startsWith("c++"))
        .sort()
        .reverse()[0];
      if (stdLatestOption) {
        options.compilerOptions.push(stdLatestOption.name);
        commandline.push(stdLatestOption["display-flags"]);
      } else {
        console.warn("std option not found");
      }
    } else {
      const defaultOption = switchSelect.options.find(
        (o) => o.name === switchSelect.default
      );
      options.compilerOptions.push(switchSelect.default);
      commandline.push(defaultOption!["display-flags"]);
    }
  }

  // その他オプション
  options.compilerOptionsRaw.push("-g", "-no-pie");
  commandline.push("-g", "-no-pie");

  options.getCommandlineStr = (filenames: string[]) => {
    return [...commandline, ...filenames, "&&", "./a.out"].join(" ");
  };

  return options;
}

export async function cppRunFiles(
  options: SelectedCompiler,
  files: Record<string, string | undefined>,
  filenames: string[],
  onOutput: (output: ReplOutput) => void,
  onDiagnostic?: (diagnostic: Diagnostic) => void
): Promise<void> {
  // Track state for processing stack traces
  let inStackTrace = false;
  let signal = "";
  let exceptionMessage = "";
  const runtimeFrames: DiagnosticFrame[] = [];

  await compileAndRun(
    {
      ...options,
      compilerOptionsRaw: [
        ...options.compilerOptionsRaw,
        ...filenames,
        "_stacktrace.cpp",
      ],
      codes: { ...files, "_stacktrace.cpp": _stacktrace_cpp },
    },
    (event) => {
      const { ndjsonType, output } = event;

      // Parse compiler messages for diagnostics
      if (ndjsonType === "CompilerMessageE") {
        const gccMatch = GCC_DIAG_REGEX.exec(output.message);
        if (gccMatch) {
          const rawFilename = gccMatch[1].replace(/^\.\//, "");
          if (
            rawFilename !== "_stacktrace.cpp" &&
            !rawFilename.startsWith("<") &&
            !rawFilename.includes("/include/")
          ) {
            const lineNum = parseInt(gccMatch[2], 10);
            const colNum = gccMatch[3] ? parseInt(gccMatch[3], 10) : undefined;
            const sev = gccMatch[4];
            const msg = gccMatch[5];

            let severity: DiagnosticSeverity = "error";
            if (sev === "warning") severity = "warning";
            else if (sev === "note") severity = "info";

            onDiagnostic?.({
              frames: [
                {
                  filename: rawFilename,
                  startLineNumber: lineNum,
                  startColumn: colNum,
                },
              ],
              message: msg,
              severity,
            });
          }
        } else {
          const ldMatch = LD_DIAG_REGEX.exec(output.message);
          if (ldMatch) {
            const rawFilename = ldMatch[1].replace(/^\.\//, "");
            if (
              rawFilename !== "_stacktrace.cpp" &&
              !rawFilename.startsWith("<") &&
              !rawFilename.includes("/include/")
            ) {
              const lineNum = parseInt(ldMatch[2], 10);
              const msg = ldMatch[3];
              onDiagnostic?.({
                frames: [
                  {
                    filename: rawFilename,
                    startLineNumber: lineNum,
                  },
                ],
                message: msg,
                severity: "error",
              });
            }
          }
        }
      }

      // Check for exception / terminate message in stderr
      if (ndjsonType === "StdErr") {
        if (output.message.includes("what():")) {
          const idx = output.message.indexOf("what():");
          exceptionMessage = output.message.slice(idx + 7).trim();
        } else if (
          output.message.includes("terminate called after throwing an instance of")
        ) {
          const m =
            /terminate called after throwing an instance of '([^']+)'/.exec(
              output.message
            );
          if (m && !exceptionMessage) {
            exceptionMessage = m[1];
          }
        }
      }

      // Check for signal marker in stderr
      if (
        ndjsonType === "StdErr" &&
        output.message.startsWith("#!my_code_signal:")
      ) {
        signal = output.message.slice(17).trim();
        onOutput({
          type: "error",
          message: signal,
        });
        return;
      }

      // Check for stack trace marker
      if (
        ndjsonType === "StdErr" &&
        output.message === "#!my_code_stacktrace:"
      ) {
        inStackTrace = true;
        onOutput({
          type: "trace",
          message: "Stack trace (filtered):",
        });
        return;
      }

      // Process stack trace lines
      if (inStackTrace && ndjsonType === "StdErr") {
        const m = /\sat\s+(?:.*\/)?([^:\s]+):(\d+)/.exec(output.message);
        if (
          m &&
          !output.message.includes("/boost/") &&
          !output.message.includes("/include/") &&
          !output.message.includes("/opt/wandbox/")
        ) {
          const filename = m[1].replace(/^\.\//, "");
          if (filename !== "_stacktrace.cpp") {
            const cleanedMessage = output.message.replace(
              /\s+at\s+.*\/([^\/]+:\d+.*)$/,
              " at $1"
            );
            onOutput({
              type: "trace",
              message: cleanedMessage,
            });
            runtimeFrames.push({
              filename,
              startLineNumber: parseInt(m[2], 10),
            });
          }
        }
        return;
      }

      // Output normally
      onOutput(output);
    }
  );

  if (runtimeFrames.length > 0) {
    const message = exceptionMessage || signal || "Runtime error";
    onDiagnostic?.({
      frames: runtimeFrames,
      message,
      severity: "error",
    });
  }
}
