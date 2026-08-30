export interface ParsedStackFrame {
  functionName?: string;
  filename?: string;
  lineNumber?: number;
  columnNumber?: number;
}

export interface DiagnosticFrameInfo {
  filename: string;
  startLineNumber: number;
  startColumn?: number;
  endLineNumber?: number;
  endColumn?: number;
}

export interface ParsedErrorInfo {
  formattedStackTrace: string;
  diagnostic: {
    frames: DiagnosticFrameInfo[];
    message: string;
    severity: "error";
  } | null;
}

/**
 * Parses the raw `Error.stack` string from various browser JavaScript engines
 * (V8 / Chrome, SpiderMonkey / Firefox, JavaScriptCore / Safari)
 * and extracts frames belonging to the evaluated user code.
 */
export function parseStackTrace(
  stack: string,
  defaultFilename: string = "main.js"
): ParsedStackFrame[] {
  if (!stack) return [];
  const lines = stack
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const frames: ParsedStackFrame[] = [];

  for (const line of lines) {
    // 1. Chrome / V8 / Node format (starts with "at ")
    if (line.startsWith("at ")) {
      // Skip pure eval invocation frames (e.g. "at eval (<anonymous>)", "at eval (native)")
      if (/^at\s+eval\s*\((?:<anonymous>|native)\)$/.test(line)) {
        continue;
      }

      // Pattern 1a: eval at ... with function name
      // e.g. "at foo (eval at runFile (webpack-internal://...), <anonymous>:2:9)"
      // e.g. "at eval (eval at runFile (webpack-internal://...), <anonymous>:5:3)"
      const evalAtWithFn = line.match(
        /^at\s+(?:async\s+)?([^\s(]+)\s+\(eval at [^,]+(?:,\s*eval at [^,]+)*,\s*(?:([^:]+):)?(\d+):(\d+)\)$/
      );

      // Pattern 1b: eval at ... without function name (or at eval at ...)
      // e.g. "at (eval at runFile (...), <anonymous>:2:9)"
      // e.g. "at eval at runFile (webpack-internal://...), <anonymous>:5:3"
      const evalAtWithoutFn =
        line.match(
          /^at\s+(?:async\s+)?\(eval at [^,]+(?:,\s*eval at [^,]+)*,\s*(?:([^:]+):)?(\d+):(\d+)\)$/
        ) ||
        line.match(
          /^at\s+(?:async\s+)?eval at [^,]+(?:,\s*eval at [^,]+)*,\s*(?:([^:]+):)?(\d+):(\d+)$/
        );

      if (evalAtWithFn) {
        const rawFn = evalAtWithFn[1];
        const fn =
          rawFn && rawFn !== "eval" && rawFn !== "<anonymous>"
            ? rawFn
            : undefined;
        const rawFile = evalAtWithFn[2];
        const filename =
          rawFile && rawFile !== "<anonymous>" ? rawFile : defaultFilename;
        const lineNumber = parseInt(evalAtWithFn[3], 10);
        const columnNumber = parseInt(evalAtWithFn[4], 10);

        frames.push({
          functionName: fn,
          filename,
          lineNumber,
          columnNumber,
        });
        continue;
      } else if (evalAtWithoutFn) {
        const rawFile = evalAtWithoutFn[1];
        const filename =
          rawFile && rawFile !== "<anonymous>" ? rawFile : defaultFilename;
        const lineNumber = parseInt(evalAtWithoutFn[2], 10);
        const columnNumber = parseInt(evalAtWithoutFn[3], 10);

        frames.push({
          functionName: undefined,
          filename,
          lineNumber,
          columnNumber,
        });
        continue;
      }

      // Pattern 2a: direct file reference with function name
      // e.g. "at foo (main.js:2:9)", "at eval (main.js:5:3)"
      const directWithFn = line.match(
        /^at\s+(?:async\s+)?([^\s(]+)\s+\(([^:]+):(\d+):(\d+)\)$/
      );

      // Pattern 2b: direct file reference without function name
      // e.g. "at (main.js:5:3)" or "at main.js:5:3"
      const directWithoutFn =
        line.match(/^at\s+(?:async\s+)?\(([^:]+):(\d+):(\d+)\)$/) ||
        line.match(/^at\s+(?:async\s+)?([^:()\s]+):(\d+):(\d+)$/);

      if (directWithFn) {
        const rawFn = directWithFn[1];
        const file = directWithFn[2];
        // Skip internal runtime / bundler / worker frames
        if (
          file.startsWith("http:") ||
          file.startsWith("https:") ||
          file.startsWith("webpack-internal:") ||
          file.startsWith("webpack:") ||
          file.startsWith("node:") ||
          file.includes("node_modules") ||
          file.includes("worker")
        ) {
          if (
            file !== defaultFilename &&
            !file.endsWith("/" + defaultFilename)
          ) {
            continue;
          }
        }

        const fn =
          rawFn &&
          rawFn !== "eval" &&
          rawFn !== "<anonymous>" &&
          rawFn !== "Object.<anonymous>"
            ? rawFn
            : undefined;
        const filename =
          file === "<anonymous>"
            ? defaultFilename
            : file.endsWith("/" + defaultFilename)
            ? defaultFilename
            : file;
        const lineNumber = parseInt(directWithFn[3], 10);
        const columnNumber = parseInt(directWithFn[4], 10);

        frames.push({
          functionName: fn,
          filename,
          lineNumber,
          columnNumber,
        });
        continue;
      } else if (directWithoutFn) {
        const file = directWithoutFn[1];
        // Skip internal runtime / bundler / worker frames
        if (
          file.startsWith("http:") ||
          file.startsWith("https:") ||
          file.startsWith("webpack-internal:") ||
          file.startsWith("webpack:") ||
          file.startsWith("node:") ||
          file.includes("node_modules") ||
          file.includes("worker")
        ) {
          if (
            file !== defaultFilename &&
            !file.endsWith("/" + defaultFilename)
          ) {
            continue;
          }
        }

        const filename =
          file === "<anonymous>"
            ? defaultFilename
            : file.endsWith("/" + defaultFilename)
            ? defaultFilename
            : file;
        const lineNumber = parseInt(directWithoutFn[2], 10);
        const columnNumber = parseInt(directWithoutFn[3], 10);

        frames.push({
          functionName: undefined,
          filename,
          lineNumber,
          columnNumber,
        });
        continue;
      }

      // Other "at " lines are runtime/framework frames; skip them.
      continue;
    }

    // 2. Firefox / Safari format (contains "@")
    if (line.includes("@")) {
      const atIdx = line.indexOf("@");
      const rawFn = line.slice(0, atIdx).trim();
      const location = line.slice(atIdx + 1).trim();

      // Safari eval boundary: "eval@[native code]"
      if (rawFn === "eval" && location === "[native code]") {
        // Stop parsing further down the stack as lower frames are worker/comlink infrastructure
        break;
      }

      // Firefox eval pattern: location contains "> eval" or "> Function"
      // e.g. "... line 84 > eval line 66 > eval:2:9"
      if (location.includes("> eval") || location.includes("> Function")) {
        const match = location.match(/(?:> eval|> Function):(\d+):(\d+)$/);
        if (match) {
          const fn =
            rawFn && rawFn !== "eval" && rawFn !== "<anonymous>"
              ? rawFn
              : undefined;
          frames.push({
            functionName: fn,
            filename: defaultFilename,
            lineNumber: parseInt(match[1], 10),
            columnNumber: parseInt(match[2], 10),
          });
          continue;
        }
      }

      // Direct location pattern in Firefox / Safari:
      // e.g. "foo@main.js:2:9", "@main.js:5:3", "eval code@main.js:5:3"
      const locMatch = location.match(/^([^:]+):(\d+):(\d+)$/);
      if (locMatch) {
        const file = locMatch[1];
        if (
          file.startsWith("http:") ||
          file.startsWith("https:") ||
          file.startsWith("webpack-internal:") ||
          file.startsWith("webpack:") ||
          file.includes("node_modules") ||
          file.includes("worker")
        ) {
          if (
            file !== defaultFilename &&
            !file.endsWith("/" + defaultFilename)
          ) {
            continue;
          }
        }
        const fn =
          rawFn &&
          rawFn !== "eval" &&
          rawFn !== "eval code" &&
          rawFn !== "<anonymous>"
            ? rawFn
            : undefined;
        frames.push({
          functionName: fn,
          filename: file.endsWith("/" + defaultFilename)
            ? defaultFilename
            : file,
          lineNumber: parseInt(locMatch[2], 10),
          columnNumber: parseInt(locMatch[3], 10),
        });
        continue;
      }

      // Safari without line numbers:
      // e.g. "foo@", "eval code@", "@"
      if (location === "") {
        const fn =
          rawFn &&
          rawFn !== "eval" &&
          rawFn !== "eval code" &&
          rawFn !== "<anonymous>"
            ? rawFn
            : undefined;
        frames.push({
          functionName: fn,
          filename: defaultFilename,
        });
        continue;
      }

      // Skip other frames (e.g. runFile@..., L@https://...)
      continue;
    }
  }

  return frames;
}

/**
 * Formats parsed stack frames into a standardized stack trace output.
 * Example:
 * ```
 * Error: test
 *     at foo (main.js:2:9)
 *     at (main.js:5:3)
 * ```
 */
export function formatStackTrace(
  error: unknown,
  frames: ParsedStackFrame[],
  defaultFilename: string = "main.js"
): string {
  let header: string;
  if (error instanceof Error) {
    header = `${error.name}: ${error.message}`;
  } else {
    header = String(error);
  }

  if (frames.length === 0) {
    return header;
  }

  const lines = [header];
  for (const frame of frames) {
    const fnStr = frame.functionName ? ` ${frame.functionName}` : "";
    const filename = frame.filename || defaultFilename;
    let locationStr = "";
    if (frame.lineNumber !== undefined && frame.columnNumber !== undefined) {
      locationStr = `${filename}:${frame.lineNumber}:${frame.columnNumber}`;
    } else if (frame.lineNumber !== undefined) {
      locationStr = `${filename}:${frame.lineNumber}`;
    } else if (filename) {
      locationStr = `${filename}`;
    }

    if (locationStr) {
      lines.push(`    at${fnStr} (${locationStr})`);
    } else if (fnStr) {
      lines.push(`    at${fnStr}`);
    }
  }

  return lines.join("\n");
}

/**
 * Finds the line number where a SyntaxError occurred by progressively
 * checking prefixes of the code.
 */
export function findSyntaxErrorLine(code: string): {
  lineNumber: number;
  columnNumber?: number;
} {
  if (!code) return { lineNumber: 1 };
  const rawLines = code.split("\n");

  for (let i = 1; i <= rawLines.length; i++) {
    const slice = rawLines.slice(0, i).join("\n");
    try {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      (0, eval)(`() => {\n${slice}\n}`);
    } catch (e) {
      if (e instanceof SyntaxError) {
        const msg = e.message;
        if (
          !msg.includes("Unexpected end of input") &&
          !msg.includes("Unexpected token '}'") &&
          !msg.includes("Expected '}'")
        ) {
          return { lineNumber: i };
        }
      }
    }
  }

  // If entire code had "Unexpected end of input", find the last non-empty line
  for (let i = rawLines.length; i >= 1; i--) {
    if (rawLines[i - 1].trim().length > 0) {
      return { lineNumber: i };
    }
  }

  return { lineNumber: 1 };
}

/**
 * Parses an error object, formats its stack trace, and constructs Diagnostic data.
 */
export function parseError(
  error: unknown,
  code?: string,
  filename: string = "main.js"
): ParsedErrorInfo {
  const errorMessage =
    error instanceof Error ? `${error.name}: ${error.message}` : String(error);

  const rawStack =
    error instanceof Error && typeof error.stack === "string"
      ? error.stack
      : "";

  let frames = parseStackTrace(rawStack, filename);

  // If it's a SyntaxError or no frames with line numbers were found, try finding line number
  if (
    error instanceof SyntaxError ||
    (frames.length === 0 && code !== undefined)
  ) {
    // Check if error object itself has line info (e.g. in some engines e.lineNumber)
    const errObj = error as {
      lineNumber?: number;
      columnNumber?: number;
      line?: number;
      column?: number;
    };
    const errLine = errObj?.lineNumber ?? errObj?.line;
    const errCol = errObj?.columnNumber ?? errObj?.column;

    if (errLine !== undefined) {
      frames = [
        {
          filename,
          lineNumber: errLine,
          columnNumber: errCol,
        },
      ];
    } else if (code) {
      const loc = findSyntaxErrorLine(code);
      frames = [
        {
          filename,
          lineNumber: loc.lineNumber,
          columnNumber: loc.columnNumber,
        },
      ];
    }
  }

  const formattedStackTrace = formatStackTrace(error, frames, filename);

  const diagnosticFrames: DiagnosticFrameInfo[] = frames
    .filter((f) => f.lineNumber !== undefined)
    .map((f) => ({
      filename: f.filename || filename,
      startLineNumber: f.lineNumber!,
      startColumn: f.columnNumber,
      endLineNumber: f.lineNumber!,
      endColumn: f.columnNumber,
    }));

  const diagnostic =
    diagnosticFrames.length > 0
      ? {
          frames: diagnosticFrames,
          message: errorMessage,
          severity: "error" as const,
        }
      : null;

  return {
    formattedStackTrace,
    diagnostic,
  };
}
