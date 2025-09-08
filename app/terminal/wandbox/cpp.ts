import { ReplOutput } from "../repl";
import { compileAndRun, CompilerInfo } from "./api";

const CPP_STACKTRACE_HANDLER = `
#define BOOST_STACKTRACE_USE_ADDR2LINE
#include <boost/stacktrace.hpp>
#include <iostream>
#include <signal.h>
void signal_handler(int signum) {
    signal(signum, SIG_DFL);
    switch(signum) {
    case SIGILL:
        std::cerr << "Illegal instruction" << std::endl;
        break;
    case SIGABRT:
        std::cerr << "Aborted" << std::endl;
        break;
    case SIGBUS:
        std::cerr << "Bus error" << std::endl;
        break;
    case SIGFPE:
        std::cerr << "Floating point exception" << std::endl;
        break;
    case SIGSEGV:
        std::cerr << "Segmentation fault" << std::endl;
        break;
    default:
        std::cerr << "Signal " << signum << " received" << std::endl;
        break;
    }
    std::cerr << "Stack trace:" << std::endl;
    std::cerr << boost::stacktrace::stacktrace();
    raise(signum);
}
struct _init_signal_handler {
    _init_signal_handler() {
        signal(SIGILL, signal_handler);
        signal(SIGABRT, signal_handler);
        signal(SIGBUS, signal_handler);
        signal(SIGFPE, signal_handler);
        signal(SIGSEGV, signal_handler);
    }
} _init_signal_handler_instance;
`;

interface CppOptions {
  compilerName: string;
  compilerOptions: string[];
  compilerOptionsRaw: string[];
  commandline: string[]; // 表示用
}

// 使用可能なコンパイラーの情報からコンパイルオプションを決定する
// コマンドライン文字列表示用と実行時用で処理を共通化するため
function cppOptions(compilerList: CompilerInfo[]): CppOptions {
  const compilerListForLang = compilerList.filter((c) => c.language === "C++");
  // headでない最初のgccを使う
  const selectedCompiler = compilerListForLang.find(
    (c) => c.name.includes("gcc") && !c.name.includes("head")
  );
  if (!selectedCompiler) {
    throw new Error("compiler not found");
  }

  const options: CppOptions = {
    compilerName: selectedCompiler.name,
    compilerOptions: [],
    commandline: ["g++"], // selectedCompiler["display-compile-command"]
    compilerOptionsRaw: [],
  };

  // singleオプション:
  const warningSwitch = selectedCompiler.switches.find(
    (s) => s.name === "warning"
  );
  if (warningSwitch && warningSwitch.type === "single") {
    options.compilerOptions.push("warning");
    options.commandline.push(warningSwitch["display-flags"]);
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
        options.commandline.push(stdLatestOption["display-flags"]);
      } else {
        console.warn("std option not found");
      }
    } else {
      const defaultOption = switchSelect.options.find(
        (o) => o.name === switchSelect.default
      );
      options.compilerOptions.push(switchSelect.default);
      options.commandline.push(defaultOption!["display-flags"]);
    }
  }

  // その他オプション
  options.compilerOptionsRaw.push("-g");
  // options.commandline.push("-g");

  return options;
}

export function getCppCommandlineStr(
  compilerList: CompilerInfo[],
  filenames: string[]
) {
  return [
    ...cppOptions(compilerList).commandline,
    ...filenames,
    "&&",
    "./a.out",
  ].join(" ");
}

export async function cppRunFiles(
  compilerList: CompilerInfo[],
  files: Record<string, string | undefined>,
  filenames: string[]
) {
  const options = cppOptions(compilerList);
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
      { file: "_stacktrace.cpp", code: CPP_STACKTRACE_HANDLER },
    ],
  });

  const traceIndex = result.programError.findIndex(
    (line) => line.message === "Stack trace:"
  );
  const outputs: ReplOutput[] = [
    ...result.compilerOutput,
    ...result.compilerError,
    ...result.programOutput,
    ...(traceIndex >= 0
      ? result.programError.slice(0, traceIndex)
      : result.programError),
  ];
  if (traceIndex >= 0) {
    // CPP_STACKTRACE_HANDLER のコードで出力されるスタックトレースを、js側でパースしていい感じに表示する
    outputs.push({
      type: "trace" as const,
      message: "Stack trace (filtered):",
    });
    for (const line of result.programError.slice(traceIndex + 1)) {
      // ユーザーのソースコードだけを対象にする
      if (line.message.includes("/home/wandbox")) {
        outputs.push({
          type: "trace" as const,
          message: line.message.replace("/home/wandbox/", ""),
        });
      }
    }
  }
  if (result.status !== "0") {
    outputs.push({
      type: "system" as const,
      message: `ステータス ${result.status} で異常終了しました`,
    });
  }
  // TODO: result.signal はいつ使われるのか？

  return outputs;
}
