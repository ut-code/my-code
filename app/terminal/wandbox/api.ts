import { type Fetcher } from "swr";
import { type ReplOutput } from "../repl";

const WANDBOX = "https://wandbox.org";
// https://github.com/melpon/wandbox/blob/ajax/kennel2/API.rst  <- 古いけど、説明と例がある
// https://github.com/melpon/wandbox/blob/master/feline/src/types.rs
/* RustのVec<u8>はバイト配列ですが、serialize_with = "serialize_utf8"という指定があるため、
JSONにシリアライズされる際にはUTF-8文字列に変換されると解釈し、TypeScriptの型はstringとします。
by gemini
*/
export interface SwitchOption {
  name: string;
  "display-flags": string;
  "display-name": string;
}
export interface SwitchSingle {
  type: "single";
  name: string;
  "display-name": string;
  "display-flags": string;
  default: boolean;
}
export interface SwitchSelect {
  type: "select";
  name: string;
  options: SwitchOption[];
  default: string;
}
/**
 * Rustの 'Switch' enum に対応するディスクリミネேテッドユニオン型です。
 * 'type' プロパティの値によって `SwitchSingle` か `SwitchSelect` かを判別できます。
 */
export type Switch = SwitchSingle | SwitchSelect;
export interface CompilerInfo {
  name: string;
  version: string;
  language: string;
  "display-name": string;
  templates: string[];
  "compiler-option-raw": boolean;
  "runtime-option-raw": boolean;
  "display-compile-command": string;
  switches: Switch[];
}
interface Code {
  file: string;
  code: string;
}
export interface CompileParameter {
  compiler: string;
  code: string;
  codes?: Code[];
  options?: string;
  stdin?: string;
  "compiler-option-raw"?: string;
  "runtime-option-raw"?: string;
  github_user?: string;
  title?: string;
  description?: string;
  save?: boolean;
  created_at?: number;
  is_private?: boolean;
  "compiler-info"?: CompilerInfo;
}
export interface CompileResult {
  status: string;
  signal: string;
  compiler_output: string;
  compiler_error: string;
  compiler_message: string;
  program_output: string;
  program_error: string;
  program_message: string;
  permlink: string;
  url: string;
}

export const compilerInfoFetcher: Fetcher<CompilerInfo[]> = () =>
  fetch(new URL("/api/list.json", WANDBOX)).then(
    (res) => res.json() as Promise<CompilerInfo[]>
  );

export interface SelectedCompiler {
  compilerName: string;
  compilerOptions: string[];
  compilerOptionsRaw: string[];
  getCommandlineStr: (filenames: string[]) => string; // 表示用
};
interface CompileProps {
  compilerName: string;
  compilerOptions: string[];
  compilerOptionsRaw: string[];
  codes: Code[];
}
export interface CompileResultWithOutput extends CompileResult {
  compilerOutput: ReplOutput[];
  compilerError: ReplOutput[];
  programOutput: ReplOutput[];
  programError: ReplOutput[];
}

export async function compileAndRun(
  options: CompileProps
): Promise<CompileResultWithOutput> {
  const result: CompileResult = await fetch(
    new URL("/api/compile.json", WANDBOX),
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        compiler: options.compilerName,
        code: "",
        codes: options.codes,
        options: options.compilerOptions.join(","),
        stdin: "",
        "compiler-option-raw": options.compilerOptionsRaw.join("\n"),
        "runtime-option-raw": "",
        save: false,
        is_private: true,
      } satisfies CompileParameter),
    }
  ).then((res) => res.json());
  return {
    ...result,
    compilerOutput: result.compiler_output.trim()
      ? result.compiler_output
          .trim()
          .split("\n")
          .map((line) => ({ type: "stdout" as const, message: line }))
      : [],
    compilerError: result.compiler_error.trim()
      ? result.compiler_error
          .trim()
          .split("\n")
          .map((line) => ({ type: "error" as const, message: line }))
      : [],
    programOutput: result.program_output.trim()
      ? result.program_output
          .trim()
          .split("\n")
          .map((line) => ({ type: "stdout" as const, message: line }))
      : [],
    programError: result.program_error.trim()
      ? result.program_error
          .trim()
          .split("\n")
          .map((line) => ({ type: "error" as const, message: line }))
      : [],
  };
}
