import { RuntimeLang } from "@my-code/runtime/languages";
import { TestBody } from "./utils";
import {
  emptyMutex,
  ReplOutput,
  UpdatedFile,
} from "@my-code/runtime/interface";
import { expect } from "chai";

export const replTests: Record<string, (lang: RuntimeLang) => TestBody | null> =
  {
    "should capture stdout": (lang) => {
      const msg = "Hello, World!";
      const printCode = (
        {
          python: `print("${msg}")`,
          ruby: `puts "${msg}"`,
          cpp: null,
          rust: null,
          javascript: `console.log("${msg}")`,
          typescript: null,
        } satisfies Record<RuntimeLang, string | null>
      )[lang];
      if (!printCode) return null;

      return async (runtimeRef) => {
        const outputs: ReplOutput[] = [];
        await (runtimeRef.current![lang].mutex || emptyMutex).runExclusive(() =>
          runtimeRef.current![lang].runCommand!(printCode, (output) => {
            if (output.type !== "file") outputs.push(output);
          })
        );
        console.log(`${lang} REPL stdout test: `, outputs);
        expect(outputs).to.be.deep.include({ type: "stdout", message: msg });
      };
    },

    "should preserve variables across commands": (lang) => {
      const varName = "testVar";
      const value = 42;
      const [setIntVarCode, printIntVarCode] = (
        {
          python: [`${varName} = ${value}`, `print(${varName})`],
          ruby: [`${varName} = ${value}`, `puts ${varName}`],
          cpp: [null, null],
          rust: [null, null],
          javascript: [
            `const ${varName} = ${value}`,
            `console.log(${varName})`,
          ],
          typescript: [null, null],
        } satisfies Record<RuntimeLang, string[] | null[]>
      )[lang];
      if (!setIntVarCode || !printIntVarCode) return null;

      return async (runtimeRef) => {
        const outputs: ReplOutput[] = [];
        await (runtimeRef.current![lang].mutex || emptyMutex).runExclusive(
          async () => {
            await runtimeRef.current![lang].runCommand!(
              setIntVarCode,
              () => {}
            );
            await runtimeRef.current![lang].runCommand!(
              printIntVarCode,
              (output) => {
                if (output.type !== "file") outputs.push(output);
              }
            );
          }
        );
        console.log(`${lang} REPL variable preservation test: `, outputs);
        expect(outputs).to.be.deep.include({
          type: "stdout",
          message: value.toString(),
        });
      };
    },

    "should capture errors": (lang) => {
      const errorMsg = "This is a test error.";
      const errorCode = (
        {
          python: `raise Exception("${errorMsg}")`,
          ruby: `raise "${errorMsg}"`,
          cpp: null,
          rust: null,
          javascript: `throw new Error("${errorMsg}")`,
          typescript: null,
        } satisfies Record<RuntimeLang, string | null>
      )[lang];
      if (!errorCode) return null;

      return async (runtimeRef) => {
        const outputs: ReplOutput[] = [];
        await (runtimeRef.current![lang].mutex || emptyMutex).runExclusive(() =>
          runtimeRef.current![lang].runCommand!(errorCode, (output) => {
            if (output.type !== "file") outputs.push(output);
          })
        );
        console.log(`${lang} REPL error capture test: `, outputs);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(outputs.filter((r) => r.message.includes(errorMsg))).to.not.be
          .empty;
      };
    },

    "should be able to be interrupted and recover state": (lang) => {
      const [setIntVarCode, infLoopCode, printIntVarCode] = (
        {
          python: [`testVar = 42`, `while True:\n    pass`, `print(testVar)`],
          ruby: [`testVar = 42`, `loop do\nend`, `puts testVar`],
          cpp: [null, null, null],
          rust: [null, null, null],
          javascript: [
            `const testVar = 42`,
            `while(true) {}`,
            `console.log(testVar)`,
          ],
          typescript: [null, null, null],
        } satisfies Record<RuntimeLang, (string | null)[]>
      )[lang];
      if (!setIntVarCode || !infLoopCode || !printIntVarCode) return null;

      return async (runtimeRef) => {
        const runPromise = (
          runtimeRef.current![lang].mutex || emptyMutex
        ).runExclusive(async () => {
          await runtimeRef.current![lang].runCommand!(setIntVarCode, () => {});
          await runtimeRef.current![lang].runCommand!(infLoopCode, () => {});
        });
        // Wait a bit to ensure the infinite loop has started
        await new Promise((resolve) => setTimeout(resolve, 1000));
        runtimeRef.current![lang].interrupt!();
        await new Promise((resolve) => setTimeout(resolve, 100));
        await runPromise;

        // Wait for it to become ready again
        const start = Date.now();
        while (true) {
          const runtime = runtimeRef.current![lang];
          if (runtime?.ready && !runtime.mutex?.isLocked()) {
            break;
          }
          if (Date.now() - start > 30000) break;
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        const outputs: ReplOutput[] = [];
        await (runtimeRef.current![lang].mutex || emptyMutex).runExclusive(() =>
          runtimeRef.current![lang].runCommand!(printIntVarCode, (output) => {
            if (output.type !== "file") outputs.push(output);
          })
        );
        console.log(`${lang} REPL interrupt recovery test: `, outputs);
        expect(outputs).to.be.deep.include({ type: "stdout", message: "42" });
      };
    },

    "should capture files modified by command": (lang) => {
      const targetFile = "test.txt";
      const msg = "Hello, World!";
      const writeCode = (
        {
          python: `with open("${targetFile}", "w") as f:\n    f.write("${msg}")`,
          ruby: `File.open("${targetFile}", "w") {|f| f.write("${msg}") }`,
          cpp: null,
          rust: null,
          javascript: null,
          typescript: null,
        } satisfies Record<RuntimeLang, string | null>
      )[lang];
      if (!writeCode) return null;

      return async (runtimeRef) => {
        const updatedFiles: UpdatedFile[] = [];
        await (runtimeRef.current![lang].mutex || emptyMutex).runExclusive(() =>
          runtimeRef.current![lang].runCommand!(writeCode, (output) => {
            if (output.type === "file") {
              updatedFiles.push(output);
            }
          })
        );
        expect(
          updatedFiles.find((f) => f.filename === targetFile)?.content
        ).to.equal(msg);
      };
    },
  };
