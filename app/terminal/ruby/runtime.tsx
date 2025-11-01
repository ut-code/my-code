'use client';

import { ReplCommand, ReplOutput } from '../repl';
import { createWorkerRuntime } from '../worker-runtime';

const config = {
  languageName: 'Ruby',
  providerName: 'RubyProvider',
  workerUrl: '/ruby.worker.js',
  splitReplExamples: (content: string): ReplCommand[] => {
    const initCommands: { command: string; output: ReplOutput[] }[] = [];
    for (const line of content.split('\n')) {
      if (line.startsWith('>> ')) {
        // Ruby IRB uses >> as the prompt
        initCommands.push({ command: line.slice(3), output: [] });
      } else if (line.startsWith('?> ')) {
        // Ruby IRB uses ?> for continuation
        if (initCommands.length > 0) {
          initCommands[initCommands.length - 1].command += '\n' + line.slice(3);
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
  getCommandlineStr: (filenames: string[]) => `ruby ${filenames[0]}`,
};

const { Provider, useRuntime } = createWorkerRuntime(config);

export const RubyProvider = Provider;
export const useRuby = useRuntime;