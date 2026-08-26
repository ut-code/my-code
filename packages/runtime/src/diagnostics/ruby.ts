import { Diagnostic, DiagnosticFrame } from "../interface";

/**
 * Parses Ruby error/traceback string into a single Diagnostic with multiple frames.
 *
 * @param errorMessage - The error message from Ruby VM
 * @returns Array of Diagnostic objects (at most 1 per error)
 */
export function parseRubyError(errorMessage: string): Diagnostic[] {
  if (!errorMessage) return [];

  const lines = errorMessage.trim().split("\n");
  if (lines.length === 0) return [];

  const frames: DiagnosticFrame[] = [];

  // Matches formats like:
  // "test_error.rb:1:in '<main>': This is a test error (RuntimeError)"
  // "/test_error.rb:2:in 'bar': This is a test error (RuntimeError)"
  // "test_syntax.rb:1: syntax error, unexpected end-of-input, expecting '}'"
  // "\tfrom /test_error.rb:5:in 'foo'"
  // "test_multiframe.rb:6:in 'bar'"
  const stackLineRegex = /^\s*(?:from\s+)?(\/?[^:\n\t]+):(\d+)(?::in [`']([^']+)['])?(?::\s*(.*))?$/;

  let mainErrorMsg = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Skip internal evaluation files
    if (line.includes("-e:in 'Kernel.eval'") || line.startsWith("eval:1:in") || line.startsWith("(eval)")) {
      continue;
    }

    const match = stackLineRegex.exec(line);
    if (match) {
      let rawFilename = match[1];
      const lineNum = parseInt(match[2], 10);
      const message = match[4];

      if (message && !mainErrorMsg) {
        mainErrorMsg = message;
      }

      if (rawFilename.startsWith("/")) {
        rawFilename = rawFilename.replace(/^\/+/, "");
      }

      if (
        rawFilename === "eval" ||
        rawFilename === "eval_async" ||
        rawFilename.startsWith("eval_async") ||
        rawFilename === "-e" ||
        rawFilename.startsWith("(eval)") ||
        rawFilename.startsWith("bundle/") ||
        rawFilename.includes("/bundle/") ||
        (rawFilename.startsWith("<") && rawFilename.endsWith(">"))
      ) {
        continue;
      }

      // Check if there is a column indicator on subsequent lines (e.g. for Ruby 3.1+ error highlight with ^)
      let startColumn: number | undefined = undefined;
      let endColumn: number | undefined = undefined;
      for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
        const nextLine = lines[j];
        if (stackLineRegex.test(nextLine)) break;
        const caretIndex = nextLine.indexOf("^");
        if (caretIndex !== -1) {
          startColumn = caretIndex + 1;
          const caretEnd = nextLine.lastIndexOf("^");
          if (caretEnd > caretIndex) {
            endColumn = caretEnd + 2;
          }
          break;
        }
      }

      frames.push({
        filename: rawFilename,
        startLineNumber: lineNum,
        startColumn,
        endLineNumber: lineNum,
        endColumn,
      });
    }
  }

  if (frames.length === 0) return [];

  // Return a single Diagnostic with all frames (1 error = 1 Diagnostic)
  return [
    {
      frames,
      message: mainErrorMsg || errorMessage,
      severity: "error",
    },
  ];
}
