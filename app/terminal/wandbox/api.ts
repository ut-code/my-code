import { type Fetcher } from "swr";
import { type ReplOutput } from "../repl";
import { RuntimeInfo } from "../runtime";

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
/**
 * Represents a single line in the ndjson response from /api/compile.ndjson
 */
export interface CompileNdjsonResult {
  type: string;
  data: string;
}

/**
 * Output event with original NDJSON type and converted ReplOutput
 */
export interface CompileOutputEvent {
  ndjsonType: string;
  output: ReplOutput;
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

export interface SelectedCompiler extends RuntimeInfo {
  compilerName: string;
  compilerOptions: string[];
  compilerOptionsRaw: string[];
  getCommandlineStr: (filenames: string[]) => string; // 表示用
}
interface CompileProps {
  compilerName: string;
  compilerOptions: string[];
  compilerOptionsRaw: string[];
  code?: string;
  codes: Record<string, string | undefined>;
  // codes: Code[];
}

export async function compileAndRun(
  options: CompileProps,
  onOutput: (event: CompileOutputEvent) => void
): Promise<void> {
  // Helper function to process NDJSON result and call onOutput
  const processNdjsonResult = (r: CompileNdjsonResult) => {
    switch (r.type) {
      case "CompilerMessageS":
        if (r.data.trim()) {
          for (const line of r.data.trim().split("\n")) {
            onOutput({ 
              ndjsonType: r.type, 
              output: { type: "stdout", message: line } 
            });
          }
        }
        break;
      case "CompilerMessageE":
        if (r.data.trim()) {
          for (const line of r.data.trim().split("\n")) {
            onOutput({ 
              ndjsonType: r.type, 
              output: { type: "error", message: line } 
            });
          }
        }
        break;
      case "StdOut":
        if (r.data.trim()) {
          for (const line of r.data.trim().split("\n")) {
            onOutput({ 
              ndjsonType: r.type, 
              output: { type: "stdout", message: line } 
            });
          }
        }
        break;
      case "StdErr":
        if (r.data.trim()) {
          for (const line of r.data.trim().split("\n")) {
            onOutput({ 
              ndjsonType: r.type, 
              output: { type: "stderr", message: line } 
            });
          }
        }
        break;
      case "ExitCode":
        if(r.data !== "0"){
        onOutput({
          ndjsonType: r.type,
          output: {
            type: "system",
            message: `ステータス ${r.data} で異常終了しました`,
          }
        })
        }
        break;
      case "Signal":
        // TODO
        break;
      default:
        // Ignore unknown types
        console.warn(`Unknown ndjson type: ${r.type}`);
        break;
    }
  };

  // Call the ndjson API instead of json API
  const response = await fetch(new URL("/api/compile.ndjson", WANDBOX), {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      compiler: options.compilerName,
      code: options.code ?? "",
      codes: Object.entries(options.codes).map(([name, code]) => ({
        file: name,
        code: code ?? "",
      })) satisfies Code[],
      options: options.compilerOptions.join(","),
      stdin: "",
      "compiler-option-raw": options.compilerOptionsRaw.join("\n"),
      "runtime-option-raw": "",
      save: false,
      is_private: true,
    } satisfies CompileParameter),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Read the ndjson response as a stream
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Response body is not readable");
  }

  const decoder = new TextDecoder();
  let buffer = "";
  const ndjsonResults: CompileNdjsonResult[] = [];

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.trim().length > 0) {
          const r = JSON.parse(line) as CompileNdjsonResult;
          ndjsonResults.push(r);
          // Call onOutput in real-time as we receive data
          processNdjsonResult(r);
        }
      }
    }

    // Process any remaining data in the buffer
    if (buffer.trim().length > 0) {
      const r = JSON.parse(buffer) as CompileNdjsonResult;
      ndjsonResults.push(r);
      // Call onOutput for remaining data
      processNdjsonResult(r);
    }
  } finally {
    reader.releaseLock();
  }
}
