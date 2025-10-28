import { MutexInterface } from "async-mutex";
import { ReplOutput, SyntaxStatus, ReplCommand } from "./repl";
import { usePyodide } from "./python/pyodide";
import { useWandbox } from "./wandbox/wandbox";

/**
 * Common runtime context interface for different languages
 */
export interface RuntimeContext {
  init: () => Promise<void>;
  initializing: boolean;
  ready: boolean;
  mutex: MutexInterface;
  runFiles: (filenames: string[]) => Promise<ReplOutput[]>;
  runCommand: (command: string) => Promise<ReplOutput[]>; // For REPL command execution
  checkSyntax?: (code: string) => Promise<SyntaxStatus>;
  interrupt?: () => void;
  splitContents?: (content: string) => ReplCommand[];
  getCommandlineStr?: (filenames: string[]) => string; // For displaying command line
  // Language-specific properties
  prompt?: string;
  promptMore?: string;
  tabSize?: number;
}

/**
 * Hook to get runtime context for a specific language
 */
export function useRuntime(language: string): RuntimeContext {
  const pyodide = usePyodide();
  const wandbox = useWandbox("C++");

  switch (language) {
    case "python":
      return pyodide;
    case "cpp":
      return wandbox;
    default:
      throw new Error(`Runtime not implemented for language: ${language}`);
  }
}
