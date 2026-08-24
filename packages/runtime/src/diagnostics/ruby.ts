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
  const primaryErrorRegex = /^(\/?[^:\n\t]+):(\d+)(?::in [`']([^']+)['])?: (.*)$/;
  const stackFromRegex = /^\s*from (\/?[^:\n\t]+):(\d+)(?::in [`']([^']+)['])?/;

  let mainErrorMsg = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Skip internal evaluation files
    if (line.includes("-e:in 'Kernel.eval'") || line.startsWith("eval:1:in") || line.startsWith("(eval)")) {
      continue;
    }

    const primaryMatch = primaryErrorRegex.exec(line);
    if (primaryMatch) {
      let rawFilename = primaryMatch[1];
      const lineNum = parseInt(primaryMatch[2], 10);
      const message = primaryMatch[4];

      if (!mainErrorMsg) {
        mainErrorMsg = message;
      }

      if (rawFilename.startsWith("/")) {
        rawFilename = rawFilename.slice(1);
      }

      if (rawFilename === "eval" || rawFilename === "-e" || rawFilename.startsWith("(eval)")) {
        continue;
      }

      frames.push({
        filename: rawFilename,
        startLineNumber: lineNum,
        endLineNumber: lineNum,
      });
      continue;
    }

    const fromMatch = stackFromRegex.exec(line);
    if (fromMatch) {
      let rawFilename = fromMatch[1];
      const lineNum = parseInt(fromMatch[2], 10);

      if (rawFilename.startsWith("/")) {
        rawFilename = rawFilename.slice(1);
      }

      if (rawFilename === "eval" || rawFilename === "-e" || rawFilename.startsWith("(eval)")) {
        continue;
      }

      frames.push({
        filename: rawFilename,
        startLineNumber: lineNum,
        endLineNumber: lineNum,
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
