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
  onOutput: (output: ReplOutput | UpdatedFile) => void
): Promise<void> {
  try {
    const res = await fetch(`${DART_PAD_API_BASE}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ source }),
    });

    if (!res.ok) return;

    const data: AnalysisResponse = await res.json();
    if (Array.isArray(data.issues)) {
      for (const issue of data.issues) {
        const line = issue.location?.line ?? 1;
        const column = issue.location?.column ?? 1;
        const kindStr = (issue.kind || "info").toUpperCase();
        const correctionStr = issue.correction ? ` (${issue.correction})` : "";
        const formattedMsg = `[ANALYZER ${kindStr}] line ${line}:${column} - ${issue.message}${correctionStr}`;

        onOutput({
          type: issue.kind === "error" ? "error" : "stderr",
          message: formattedMsg,
        });
      }
    }
  } catch (err) {
    console.warn("Failed to perform Dart static analysis:", err);
  }
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
      onOutput: (output: ReplOutput | UpdatedFile) => void
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
        const [_, response] = await Promise.all([
          performAnalysis(source, onOutput),
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
