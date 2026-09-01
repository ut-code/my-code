"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import useSWR from "swr";
import {
  Diagnostic,
  DiagnosticFrame,
  DiagnosticSeverity,
  ReplOutput,
  RuntimeContext,
  RuntimeErrorHandler,
  RuntimeInfo,
  UpdatedFile,
} from "../interface";
import dartRunnerHtml from "./dart-runner.html?raw";

const DART_PAD_API_BASE = "https://stable.api.dartpad.dev/api/v3";

interface DartVersionResponse {
  dartVersion?: string;
  flutterVersion?: string;
}

interface AnalysisIssue {
  kind: "error" | "warning" | "info";
  message: string;
  location: {
    charStart: number;
    charLength: number;
    line: number;
    column: number;
  };
  code?: string;
  correction?: string;
  url?: string;
}

interface AnalysisResponse {
  issues: AnalysisIssue[];
  imports?: unknown[];
}

const versionFetcher = async (url: string): Promise<DartVersionResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch Dart version: ${res.statusText}`);
  }
  return res.json();
};

const DartContext = createContext<{
  init: (onError?: RuntimeErrorHandler) => void;
  ready: boolean;
  dartVersion?: string;
}>({
  init: () => undefined,
  ready: true,
});

export function DartProvider({ children }: { children: ReactNode }) {
  const onErrorRef = useRef<RuntimeErrorHandler | undefined>(undefined);
  const init = useCallback((onError?: RuntimeErrorHandler) => {
    onErrorRef.current = onError;
  }, []);

  const { data, error } = useSWR<DartVersionResponse>(
    `${DART_PAD_API_BASE}/version`,
    versionFetcher
  );

  useEffect(() => {
    if (error) {
      console.error("Failed to fetch Dart version info:", error);
      onErrorRef.current?.(error);
    }
  }, [error]);

  return (
    <DartContext.Provider
      value={{
        init,
        ready: true,
        dartVersion: data?.dartVersion,
      }}
    >
      {children}
    </DartContext.Provider>
  );
}

async function performAnalysis(
  source: string,
  onOutput: (output: ReplOutput | UpdatedFile) => void,
  onDiagnostic?: (diagnostic: Diagnostic) => void,
  filename: string = "main.dart"
): Promise<{ hasError: boolean }> {
  try {
    const res = await fetch(`${DART_PAD_API_BASE}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ source }),
    });

    if (!res.ok) return { hasError: false };

    const data: AnalysisResponse = await res.json();
    let hasError = false;
    if (Array.isArray(data.issues)) {
      for (const issue of data.issues) {
        if (issue.kind === "error") {
          hasError = true;
        }
        const line = issue.location?.line ?? 1;
        const column = issue.location?.column ?? 1;
        const kindStr = (issue.kind || "info").toUpperCase();
        const correctionStr = issue.correction ? ` (${issue.correction})` : "";
        const formattedMsg = `[ANALYZER ${kindStr}] line ${line}:${column} - ${issue.message}${correctionStr}`;

        onOutput({
          type: issue.kind === "error" ? "error" : "stderr",
          message: formattedMsg,
        });

        let severity: DiagnosticSeverity = "error";
        if (issue.kind === "warning") {
          severity = "warning";
        } else if (issue.kind === "info") {
          severity = "info";
        }

        let endLineNumber: number | undefined = undefined;
        let endColumn: number | undefined = undefined;
        if (
          issue.location?.column !== undefined &&
          issue.location?.charLength !== undefined
        ) {
          endLineNumber = line;
          endColumn = column + issue.location.charLength;
        }

        onDiagnostic?.({
          frames: [
            {
              filename,
              startLineNumber: line,
              startColumn: column,
              endLineNumber,
              endColumn,
            },
          ],
          message:
            issue.message + (issue.correction ? ` (${issue.correction})` : ""),
          severity,
        });
      }
    }
    return { hasError };
  } catch (err) {
    console.warn("Failed to perform Dart static analysis:", err);
    return { hasError: false };
  }
}

export function parseDartRuntimeError(
  rawMessage: string,
  source: string,
  filename: string = "main.dart"
): Diagnostic {
  const lines = rawMessage
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const errorMessage = lines[0] || "Runtime error";

  const rawFnNames: string[] = [];
  for (const line of lines) {
    if (
      line.includes("dart_sdk") ||
      line.includes("ddc_module_loader") ||
      line.includes("contextLoaded") ||
      line.includes("bootstrap.dart") ||
      line.includes("require.js") ||
      line.includes("require.min.js")
    ) {
      continue;
    }
    let fn = "";
    const v8Match = line.match(
      /^at\s+(?:Object\.|Proxy\.)?([a-zA-Z0-9_$]+)(?:\s+\[as\s+([a-zA-Z0-9_$]+)\])?/
    );
    if (v8Match) {
      fn = (v8Match[2] || v8Match[1]).replace(/\$$/, "");
    } else {
      const ffMatch = line.match(/^([a-zA-Z0-9_$]+)@/);
      if (ffMatch) {
        fn = ffMatch[1].replace(/\$$/, "");
      }
    }
    if (
      fn &&
      fn !== "throw" &&
      fn !== "throw_" &&
      fn !== "eval" &&
      fn !== "anonymous"
    ) {
      if (rawFnNames[rawFnNames.length - 1] !== fn) {
        rawFnNames.push(fn);
      }
    }
  }

  const sourceLines = source.split("\n");
  const frames: DiagnosticFrame[] = [];

  for (let i = 0; i < rawFnNames.length; i++) {
    const fnName = rawFnNames[i];
    const isInnermost = i === 0;
    const calleeName = i > 0 ? rawFnNames[i - 1] : undefined;

    let defLineIndex = sourceLines.findIndex((line) =>
      new RegExp(`\\b${fnName}\\s*\\(`).test(line)
    );
    if (defLineIndex === -1) {
      defLineIndex = sourceLines.findIndex((line) => line.includes(fnName));
    }
    if (defLineIndex === -1) {
      defLineIndex = 0;
    }

    const scopeStart = defLineIndex;
    let scopeEnd = sourceLines.length - 1;
    let braceCount = 0;
    let started = false;
    for (let j = defLineIndex; j < sourceLines.length; j++) {
      for (const ch of sourceLines[j]) {
        if (ch === "{") {
          braceCount++;
          started = true;
        } else if (ch === "}") {
          braceCount--;
          if (started && braceCount === 0) {
            scopeEnd = j;
            break;
          }
        }
      }
      if (started && braceCount === 0) break;
    }

    let lineNum = defLineIndex + 1;
    if (calleeName) {
      const callIdx = sourceLines
        .slice(scopeStart, scopeEnd + 1)
        .findIndex((line) => new RegExp(`\\b${calleeName}\\s*\\(`).test(line));
      if (callIdx !== -1) {
        lineNum = scopeStart + callIdx + 1;
      }
    } else if (isInnermost) {
      const throwIdx = sourceLines
        .slice(scopeStart, scopeEnd + 1)
        .findIndex((line) =>
          /\b(?:throw|rethrow|Exception|Error)\b/.test(line)
        );
      if (throwIdx !== -1) {
        lineNum = scopeStart + throwIdx + 1;
      } else if (scopeStart + 1 <= scopeEnd) {
        lineNum = scopeStart + 2;
      }
    }

    frames.push({
      filename,
      startLineNumber: lineNum,
    });
  }

  if (frames.length === 0) {
    frames.push({
      filename,
      startLineNumber: 1,
    });
  }

  return {
    frames,
    message: errorMessage,
    severity: "error",
  };
}

export function useDart(): RuntimeContext {
  const { init: dartInit, ready, dartVersion } = useContext(DartContext);
  const onErrorRef = useRef<RuntimeErrorHandler | undefined>(undefined);
  const activeIframeRef = useRef<HTMLIFrameElement | null>(null);

  const init = useCallback(
    (onError?: RuntimeErrorHandler) => {
      onErrorRef.current = onError;
      dartInit(onError);
    },
    [dartInit]
  );

  const interrupt = useCallback(() => {
    if (activeIframeRef.current) {
      if (activeIframeRef.current.parentNode) {
        activeIframeRef.current.parentNode.removeChild(activeIframeRef.current);
      }
      activeIframeRef.current = null;
    }
  }, []);

  const runFiles = useCallback(
    async (
      filenames: string[],
      files: Readonly<Record<string, string>>,
      onOutput: (output: ReplOutput | UpdatedFile) => void,
      onDiagnostic?: (diagnostic: Diagnostic) => void
    ) => {
      if (typeof window === "undefined") {
        onOutput({
          type: "error",
          message: "Dart runtime requires browser environment.",
        });
        return;
      }

      const filename = filenames[0] ?? Object.keys(files)[0];
      const source = files[filename] ?? Object.values(files)[0];

      if (!source) {
        onOutput({ type: "error", message: "No source code provided to run." });
        return;
      }

      try {
        const [analysisResult, response] = await Promise.all([
          performAnalysis(source, onOutput, onDiagnostic, filename),
          fetch(`${DART_PAD_API_BASE}/compileNewDDC`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ source }),
          }),
        ]);

        if (!response.ok) {
          const errorText = await response.text();
          onOutput({
            type: "error",
            message:
              errorText || `Compilation failed with status ${response.status}`,
          });

          if (!analysisResult.hasError && errorText) {
            const lines = errorText.split("\n");
            for (const line of lines) {
              const match =
                /^(?:.*\/)?([^:\n]+):(\d+):(?:(\d+):)?\s*(Error|Warning|Info):\s*(.*)$/i.exec(
                  line
                );
              if (match) {
                const lineNum = parseInt(match[2], 10);
                const colNum = match[3] ? parseInt(match[3], 10) : undefined;
                const kind = match[4].toLowerCase();
                const msg = match[5];
                let severity: DiagnosticSeverity = "error";
                if (kind === "warning") severity = "warning";
                else if (kind === "info") severity = "info";

                onDiagnostic?.({
                  frames: [
                    {
                      filename: match[1] || filename,
                      startLineNumber: lineNum,
                      startColumn: colNum,
                    },
                  ],
                  message: msg,
                  severity,
                });
              }
            }
          }
          return;
        }

        const data = await response.json();
        if (!data.result) {
          onOutput({
            type: "error",
            message: "Compilation returned empty result.",
          });
          return;
        }

        const jsCode: string = data.result;

        // Execute compiled JS inside a temporary iframe
        await new Promise<void>((resolve) => {
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";
          iframe.srcdoc = dartRunnerHtml;
          document.body.appendChild(iframe);
          activeIframeRef.current = iframe;

          let resolved = false;
          const cleanup = () => {
            if (resolved) return;
            resolved = true;
            window.removeEventListener("message", handleMessage);
            if (activeIframeRef.current === iframe) {
              activeIframeRef.current = null;
            }
            if (iframe.parentNode) {
              iframe.parentNode.removeChild(iframe);
            }
            resolve();
          };

          const handleMessage = (event: MessageEvent) => {
            if (event.source !== iframe.contentWindow) return;
            const msgData = event.data;
            if (!msgData || msgData.sender !== "dart_frame") return;

            if (msgData.type === "stdout") {
              onOutput({ type: "stdout", message: String(msgData.message) });
            } else if (msgData.type === "done") {
              cleanup();
            } else if (msgData.type === "jserr") {
              onOutput({ type: "error", message: String(msgData.message) });
              const diag = parseDartRuntimeError(
                String(msgData.message),
                source,
                filename
              );
              onDiagnostic?.(diag);
              cleanup();
            }
          };

          window.addEventListener("message", handleMessage);

          // iframeが読み込まれたら、コンパイル済みのコードを送信して実行させる
          iframe.onload = () => {
            iframe.contentWindow?.postMessage(
              {
                type: "EXECUTE_DART",
                code: jsCode,
              },
              "*"
            );
          };
        });
      } catch (error) {
        onErrorRef.current?.(error);
        onOutput({
          type: "fatalError",
          message: error instanceof Error ? error.message : String(error),
        });
      }
    },
    []
  );

  const runtimeInfo = useMemo<RuntimeInfo>(
    () => ({
      prettyLangName: "Dart",
      version: dartVersion,
    }),
    [dartVersion]
  );

  return {
    init,
    ready,
    runFiles,
    interrupt,
    getCommandlineStr,
    runtimeInfo,
  };
}

function getCommandlineStr(filenames: string[]) {
  return `dart run ${filenames[0] ?? "main.dart"}`;
}
