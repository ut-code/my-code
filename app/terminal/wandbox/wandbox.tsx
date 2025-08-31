"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { ReplOutput } from "../repl";
import { useFile } from "../file";
import useSWR, { Fetcher } from "swr";

type WandboxLang = "C++";

interface IWandboxContext {
  // filesの中から、namesSourceで指定されたファイルをソースコードとして、namesAdditionalで指定されたファイルを追加コードとして渡して実行する
  runFiles: (
    lang: WandboxLang,
    namesSource: string[],
    namesAdditional: string[]
  ) => Promise<ReplOutput[]>;
  cppOptions: WandboxOptions | null;
}
interface WandboxOptions {
  compilerName: string;
  compilerOptions: string[];
  commandline: string;
}

const WandboxContext = createContext<IWandboxContext>(null!);
export function useWandbox() {
  const context = useContext(WandboxContext);
  if (!context) {
    throw new Error("useWandbox must be used within a WandboxProvider");
  }
  return context;
}

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
interface CompileParameter {
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
interface CompileResult {
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

const compilerInfoFetcher: Fetcher<CompilerInfo[]> = () =>
  fetch(new URL("/api/list.json", WANDBOX)).then(
    (res) => res.json() as Promise<CompilerInfo[]>
  );

export function WandboxProvider({ children }: { children: ReactNode }) {
  const { files } = useFile();
  const { data: compilerList, error } = useSWR("list", compilerInfoFetcher);
  if (error) {
    console.error("Failed to fetch compiler list from Wandbox:", error);
  }
  const cppOptions = useMemo<WandboxOptions | null>(() => {
    if (!compilerList) {
      return null;
    }
    const compilerListForLang = compilerList?.filter(
      (c) => c.language === "C++"
    );
    const compilerOptions: string[] = [];
    const commandlineArgs: string[] = [];

    // headでない最初のgccを使う
    const selectedCompiler = compilerListForLang.find(
      (c) => c.name.includes("gcc") && !c.name.includes("head")
    );
    if (!selectedCompiler) {
      throw new Error("compiler not found");
    }
    const compilerName = selectedCompiler.name;
    // commandlineArgs.push(selectedCompiler["display-compile-command"]);
    commandlineArgs.push("g++");

    // singleオプション:
    const warningSwitch = selectedCompiler.switches.find(
      (s) => s.name === "warning"
    );
    if (warningSwitch && warningSwitch.type === "single") {
      compilerOptions.push("warning");
      commandlineArgs.push(warningSwitch["display-flags"]);
    } else {
      console.warn("warning switch not found");
    }

    // selectオプション:
    for (const switchSelect of selectedCompiler.switches.filter(
      (s) => s.type === "select"
    )) {
      // boostはnothing、stdは最新を選ぶ ほかはデフォルト
      if (switchSelect.name.includes("boost")) {
        const boostNothingOption = switchSelect.options.find((o) =>
          o.name.includes("nothing")
        );
        if (boostNothingOption) {
          compilerOptions.push(boostNothingOption.name);
          commandlineArgs.push(boostNothingOption["display-flags"]);
        } else {
          console.warn("boost nothing option not found");
        }
      } else if (switchSelect.name.includes("std")) {
        const stdLatestOption = switchSelect.options
          .filter((o) => o.name.startsWith("c++"))
          .sort()
          .reverse()[0];
        if (stdLatestOption) {
          compilerOptions.push(stdLatestOption.name);
          commandlineArgs.push(stdLatestOption["display-flags"]);
        } else {
          console.warn("std option not found");
        }
      } else {
        const defaultOption = switchSelect.options.find(
          (o) => o.name === switchSelect.default
        );
        compilerOptions.push(switchSelect.default);
        commandlineArgs.push(defaultOption!["display-flags"]);
      }
    }

    return {
      compilerName,
      compilerOptions,
      commandline: commandlineArgs.join(" "),
    } satisfies WandboxOptions;
  }, [compilerList]);

  const runFiles = useCallback(
    async (
      lang: WandboxLang,
      namesSource: string[],
      namesAdditional: string[]
    ) => {
      let options: WandboxOptions | null;
      switch (lang) {
        case "C++":
          options = cppOptions;
          break;
        default:
          return [
            {
              type: "error" as const,
              message: `Unsupported language: ${lang}`,
            },
          ];
      }
      if (!options) {
        return [
          { type: "error" as const, message: "Wandbox is not ready yet." },
        ];
      }
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
            codes: namesSource
              .map((name) => ({
                file: name,
                code: files[name] || "",
              }))
              .concat(
                namesAdditional.map((name) => ({
                  file: name,
                  code: files[name] || "",
                }))
              ),
            options: options.compilerOptions.join(","),
            stdin: "",
            "compiler-option-raw": namesSource.join("\n"),
            "runtime-option-raw": "",
            save: false,
            is_private: true,
          } satisfies CompileParameter),
        }
      ).then((res) => res.json());

      let outputs: ReplOutput[] = [];
      if (result.compiler_output) {
        outputs = outputs.concat(
          result.compiler_output
            .trim()
            .split("\n")
            .map((line) => ({ type: "stdout" as const, message: line }))
        );
      }
      if (result.compiler_error) {
        outputs = outputs.concat(
          result.compiler_error
            .trim()
            .split("\n")
            .map((line) => ({ type: "error" as const, message: line }))
        );
      }
      if (result.program_output) {
        outputs = outputs.concat(
          result.program_output
            .trim()
            .split("\n")
            .map((line) => ({ type: "stdout" as const, message: line }))
        );
      }
      if (result.program_error) {
        outputs = outputs.concat(
          result.program_error
            .trim()
            .split("\n")
            .map((line) => ({ type: "error" as const, message: line }))
        );
      }
      if (result.status !== "0") {
        outputs.push({
          type: "system" as const,
          message: `ステータス ${result.status} で異常終了しました`,
        });
      }
      // TODO: result.signal はいつ使われるのか？

      console.log(outputs);
      return outputs;
    },
    [files, cppOptions]
  );

  return (
    <WandboxContext.Provider value={{ runFiles, cppOptions }}>
      {children}
    </WandboxContext.Provider>
  );
}
