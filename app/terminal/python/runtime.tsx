'use client';

import { ReplCommand, ReplOutput } from '../repl';
import { createWorkerRuntime } from '../worker-runtime';

const config = {
  languageName: 'Python',
  providerName: 'PyodideProvider',
  workerUrl: '/pyodide.worker.js',
  splitReplExamples: (content: string): ReplCommand[] => {
    const initCommands: { command: string; output: ReplOutput[] }[] = [];
    for (const line of content.split('\n')) {
      if (line.startsWith('>>> ')) {
        // Remove the prompt from the command
        initCommands.push({ command: line.slice(4), output: [] });
      } else if (line.startsWith('... ')) {
        if (initCommands.length > 0) {
          initCommands[initCommands.length - 1].command += '\n' + line.slice(4);
        }
      } else {
        // Lines without prompt are output from the previous command
        if (initCommands.length > 0) {
          initCommands[initCommands.length - 1].output.push({
            type: 'stdout',
            message: line,
          });
        }
      }
    }
    return initCommands;
  },
  getCommandlineStr: (filenames: string[]) => `python ${filenames[0]}`,
};

const { Provider, useRuntime } = createWorkerRuntime(config);

export const PyodideProvider = Provider;
export const usePyodide = useRuntime;