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
  filenames: string[]
): Promise<ReplOutput[]> {
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
  });

  let outputs = result.output;

  // Find stack trace in the output
  const panicIndex = outputs.findIndex(
    (line) => line.type === "stderr" && line.message === "#!my_code_panic_hook:"
  );

  if (panicIndex >= 0) {
    const traceIndex =
      panicIndex +
      outputs
        .slice(panicIndex)
        .findLastIndex(
          (line) =>
            line.type === "stderr" && line.message === "stack backtrace:"
        );
    const otherOutputs = outputs.slice(0, panicIndex);
    const traceOutputs: ReplOutput[] = [
      {
        type: "trace",
        message: "Stack trace (filtered):",
      },
    ];
    for (const line of outputs.slice(panicIndex + 1, traceIndex)) {
      if (line.type === "stderr") {
        otherOutputs.push({
          type: "error",
          message: line.message,
        });
      } else {
        otherOutputs.push(line);
      }
    }
    for (let i = traceIndex + 1; i < outputs.length; i++) {
      const line = outputs.at(i)!;
      const nextLine = outputs.at(i + 1);
      if (line.type === "stderr") {
        // ユーザーのソースコードだけを対象にする
        if (
          /^\s*\d+:/.test(line.message) &&
          nextLine &&
          /^\s*at .\//.test(nextLine.message) &&
          !/^\s*at .\/prog.rs/.test(nextLine.message)
        ) {
          traceOutputs.push({
            type: "trace",
            message: line.message.replace("prog::", ""),
          });
          traceOutputs.push({
            type: "trace",
            message: nextLine.message,
          });
          i++; // skip next line
        }
      } else {
        otherOutputs.push(line);
      }
    }

    outputs = [...otherOutputs, ...traceOutputs];
  }

  if (result.status !== "0") {
    outputs.push({
      type: "system",
      message: `ステータス ${result.status} で異常終了しました`,
    });
  }

  return outputs;
}
