import { ReplOutput } from "../repl";
import { compileAndRun, CompilerInfo, SelectedCompiler } from "./api";

import _stacktrace_cpp from "./cpp/_stacktrace.cpp?raw";

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
  options.compilerOptionsRaw.push("-g");
  commandline.push("-g");

  options.getCommandlineStr = (filenames: string[]) => {
    return [...commandline, ...filenames, "&&", "./a.out"].join(" ");
  };

  return options;
}

export async function cppRunFiles(
  options: SelectedCompiler,
  files: Record<string, string | undefined>,
  filenames: string[],
  onOutput: (output: ReplOutput) => void
): Promise<string> {
  // Track state for processing stack traces
  let inStackTrace = false;
  let foundSignal = false;

  const result = await compileAndRun({
    ...options,
    compilerOptionsRaw: [
      ...options.compilerOptionsRaw,
      ...filenames,
      "_stacktrace.cpp",
    ],
    codes: { ...files, "_stacktrace.cpp": _stacktrace_cpp },
  }, (event) => {
    const { ndjsonType, output } = event;
    
    // Check for signal marker in stderr
    if (ndjsonType === "StdErr" && output.message.startsWith("#!my_code_signal:")) {
      foundSignal = true;
      onOutput({
        type: "error",
        message: output.message.slice(17),
      });
      return;
    }
    
    // Check for stack trace marker
    if (ndjsonType === "StdErr" && output.message === "#!my_code_stacktrace:") {
      inStackTrace = true;
      onOutput({
        type: "trace",
        message: "Stack trace (filtered):",
      });
      return;
    }
    
    // Process stack trace lines
    if (inStackTrace && ndjsonType === "StdErr") {
      // Filter to show only user source code
      if (output.message.includes("/home/wandbox")) {
        onOutput({
          type: "trace",
          message: output.message.replace("/home/wandbox/", ""),
        });
      }
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
