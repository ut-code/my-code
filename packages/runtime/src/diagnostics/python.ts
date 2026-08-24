import { Diagnostic, DiagnosticFrame } from "../interface";

/**
 * Parses Python error/traceback string into a single Diagnostic with multiple frames.
 *
 * @param traceback - The traceback string or error message from Python
 * @param homePrefix - The virtual home directory prefix to strip (default: "/home/pyodide/")
 * @returns Array of Diagnostic objects (at most 1 per error)
 */
export function parsePythonTraceback(
  traceback: string,
  homePrefix: string = "/home/pyodide/"
): Diagnostic[] {
  if (!traceback) return [];

  const lines = traceback.trim().split("\n");
  if (lines.length === 0) return [];

  // Extract the last error message line (e.g., "Exception: This is a test error" or "SyntaxError: ...")
  let errorMessage = "";
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (line && !line.startsWith("^") && !line.startsWith("File \"") && !line.startsWith("Traceback")) {
      errorMessage = line;
      break;
    }
  }

  const frames: DiagnosticFrame[] = [];
  const fileLineRegex = /File "([^"]+)", line (\d+)(?:, in (.+))?/;

  for (let i = 0; i < lines.length; i++) {
    const match = fileLineRegex.exec(lines[i]);
    if (match) {
      let rawFilename = match[1];
      const lineNum = parseInt(match[2], 10);

      // Normalize filename by removing homePrefix or leading slashes
      if (rawFilename.startsWith(homePrefix)) {
        rawFilename = rawFilename.slice(homePrefix.length);
      } else if (rawFilename.startsWith("/")) {
        rawFilename = rawFilename.slice(1);
      }

      // Ignore internal names like <exec>, <string> if not matching normal files
      if (rawFilename === "<exec>" || rawFilename === "<string>") {
        continue;
      }

      // Check if there is a column indicator on subsequent lines (e.g. for SyntaxError with ^)
      let startColumn: number | undefined = undefined;
      let endColumn: number | undefined = undefined;
      for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
        const nextLine = lines[j];
        if (fileLineRegex.test(nextLine)) break;
        const caretIndex = nextLine.indexOf("^");
        if (caretIndex !== -1) {
          // In Python SyntaxError output, caret points to character (1-indexed)
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
      message: errorMessage,
      severity: "error",
    },
  ];
}
