import { render, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RuntimeProvider, useRuntime } from '../src/context';
import { RuntimeLang } from '../src/languages';
import { ReplOutput, RuntimeContext } from '../src/interface';
import { ReactNode } from 'react';

const testLangs: RuntimeLang[] = ['python', 'ruby', 'javascript', 'typescript', 'cpp', 'rust'];

const TestComponent = ({ lang, onReady }: { lang: RuntimeLang, onReady: (runtime: RuntimeContext) => void }) => {
  const runtime = useRuntime(lang);
  if (runtime.ready) {
    onReady(runtime);
  }
  return null;
};

const AllProviders = ({ children }: { children: ReactNode }) => {
  return <RuntimeProvider>{children}</RuntimeProvider>;
};

describe.each(testLangs)('%s Runtime', (lang) => {
  const defaultTimeout = 30000;

  const printCode = (
    {
      python: `print("Hello, World!")`,
      ruby: `puts "Hello, World!"`,
      javascript: `console.log("Hello, World!")`,
    } as Record<string, string>
  )[lang];

  it.skipIf(!printCode)('should capture stdout in REPL', async () => {
    let runtimeContext: RuntimeContext | undefined = undefined;
    const outputs: ReplOutput[] = [];

    render(
      <TestComponent
        lang={lang}
        onReady={(runtime) => {
          runtimeContext = runtime;
        }}
      />,
      { wrapper: AllProviders }
    );
    
    await waitFor(() => expect(runtimeContext).toBeDefined(), { timeout: defaultTimeout });
    if (!runtimeContext) throw new Error("Runtime context not initialized");

    await runtimeContext.mutex.runExclusive(() => 
      runtimeContext!.runCommand!(printCode, (output: ReplOutput) => {
        if (output.type !== "file") outputs.push(output);
      })
    );
    
    expect(outputs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'stdout', message: "Hello, World!" })
      ])
    );
  }, defaultTimeout);
});
