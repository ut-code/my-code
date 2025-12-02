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
  filenames: string[]
): Promise<ReplOutput[]> {
  const result = await compileAndRun({
    compilerName: options.compilerName,
    compilerOptions: options.compilerOptions,
    compilerOptionsRaw: [
      ...options.compilerOptionsRaw,
      ...filenames,
      "_stacktrace.cpp",
    ],
    codes: [
      ...Object.entries(files).map(([name, code]) => ({
        file: name,
        code: code || "",
      })),
      { file: "_stacktrace.cpp", code: _stacktrace_cpp },
    ],
  });

  let outputs = result.output;

  // Find stack trace in the output
  const signalIndex = outputs.findIndex(
    (line) =>
      line.type === "stderr" && line.message.startsWith("#!my_code_signal:")
  );
  const traceIndex = outputs.findIndex(
    (line) => line.type === "stderr" && line.message === "#!my_code_stacktrace:"
  );

  if (signalIndex >= 0) {
    outputs[signalIndex] = {
      type: "error",
      message: outputs[signalIndex].message.slice(17),
    } as const;
  }
  if (traceIndex >= 0) {
    // CPP_STACKTRACE_HANDLER のコードで出力されるスタックトレースを、js側でパースしていい感じに表示する
    const trace = outputs.slice(traceIndex + 1);
    outputs = outputs.slice(0, traceIndex);
    outputs.push({
      type: "trace",
      message: "Stack trace (filtered):",
    });

    for (const line of trace) {
      // ユーザーのソースコードだけを対象にする
      if (line.type === "stderr" && line.message.includes("/home/wandbox")) {
        outputs.push({
          type: "trace",
          message: line.message.replace("/home/wandbox/", ""),
        });
      }
    }
  }

  if (result.status !== "0") {
    outputs.push({
      type: "system",
      message: `ステータス ${result.status} で異常終了しました`,
    });
  }
  // TODO: result.signal はいつ使われるのか？

  return outputs;
}
