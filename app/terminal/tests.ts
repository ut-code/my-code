import { expect } from "chai";
import { RefObject } from "react";
import { emptyMutex, RuntimeContext, RuntimeLang } from "./runtime";

export function defineTests(
  lang: RuntimeLang,
  runtimeRef: RefObject<Record<RuntimeLang, RuntimeContext>>,
  writeFile: (name: string, content: string) => void
) {
  describe(`${lang} Runtime`, function () {
    this.timeout(
      (
        {
          python: 2000,
          cpp: 10000,
          javascript: 2000,
        } as Record<RuntimeLang, number>
      )[lang]
    );

    beforeEach(async function () {
      this.timeout(60000);
      while (!runtimeRef.current[lang].ready) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    });

    describe("REPL", function () {
      it("should capture stdout", async function () {
        const msg = "Hello, World!";
        const printCode = (
          {
            python: `print("${msg}")`,
            cpp: null,
            javascript: `console.log("${msg}")`,
          } satisfies Record<RuntimeLang, string | null>
        )[lang];
        if (!printCode) {
          this.skip();
        }
        const result = await (
          runtimeRef.current[lang].mutex || emptyMutex
        ).runExclusive(() => runtimeRef.current[lang].runCommand!(printCode));
        console.log(`${lang} REPL stdout test: `, result);
        expect(result).to.be.deep.equal([
          {
            type: "stdout",
            message: msg,
          },
        ]);
      });

      it("should preserve variables across commands", async function () {
        const varName = "testVar";
        const value = 42;
        const [setIntVarCode, printIntVarCode] = (
          {
            python: [`${varName} = ${value}`, `print(${varName})`],
            cpp: [null, null],
            javascript: [`var ${varName} = ${value}`, `console.log(${varName})`],
          } satisfies Record<RuntimeLang, string[] | null[]>
        )[lang];
        if (!setIntVarCode || !printIntVarCode) {
          this.skip();
        }
        const result = await (
          runtimeRef.current[lang].mutex || emptyMutex
        ).runExclusive(async () => {
          await runtimeRef.current[lang].runCommand!(setIntVarCode);
          return runtimeRef.current[lang].runCommand!(printIntVarCode);
        });
        console.log(`${lang} REPL variable preservation test: `, result);
        expect(result).to.be.deep.equal([
          {
            type: "stdout",
            message: value.toString(),
          },
        ]);
      });

      it("should capture errors", async function () {
        const errorMsg = "This is a test error.";
        const errorCode = (
          {
            python: `raise Exception("${errorMsg}")`,
            cpp: null,
            javascript: `throw new Error("${errorMsg}")`,
          } satisfies Record<RuntimeLang, string | null>
        )[lang];
        if (!errorCode) {
          this.skip();
        }
        const result = await (
          runtimeRef.current[lang].mutex || emptyMutex
        ).runExclusive(() => runtimeRef.current[lang].runCommand!(errorCode));
        console.log(`${lang} REPL error capture test: `, result);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(result.filter((r) => r.message.includes(errorMsg))).to.not.be
          .empty;
      });

      it("should be able to be interrupted and recover state", async function () {
        const [setIntVarCode, infLoopCode, printIntVarCode] = (
          {
            python: [`testVar = 42`, `while True:\n    pass`, `print(testVar)`],
            cpp: [null, null, null],
            javascript: [`var testVar = 42`, `while(true) {}`, `console.log(testVar)`],
          } satisfies Record<RuntimeLang, (string | null)[]>
        )[lang];
        if (!setIntVarCode || !infLoopCode || !printIntVarCode) {
          this.skip();
        }
        const result = await (
          runtimeRef.current[lang].mutex || emptyMutex
        ).runExclusive(async () => {
          await runtimeRef.current[lang].runCommand!(setIntVarCode);
          const runPromise = runtimeRef.current[lang].runCommand!(infLoopCode);
          // Wait a bit to ensure the infinite loop has started
          await new Promise((resolve) => setTimeout(resolve, 1000));
          runtimeRef.current[lang].interrupt!();
          await runPromise;
          return runtimeRef.current[lang].runCommand!(printIntVarCode);
        });
        console.log(`${lang} REPL interrupt recovery test: `, result);
        expect(result).to.be.deep.equal([
          {
            type: "stdout",
            message: "42",
          },
        ]);
      });
    });

    describe("File Execution", function () {
      it("should capture stdout", async function () {
        const msg = "Hello from file!";
        const [filename, code] = (
          {
            python: ["test.py", `print("${msg}")`],
            cpp: [
              "test.cpp",
              `#include <iostream>\nint main() {\n  std::cout << "${msg}" << std::endl;\n  return 0;\n}\n`,
            ],
            javascript: [null, null],
          } satisfies Record<RuntimeLang, [string, string] | [null, null]>
        )[lang];
        if (!filename || !code) {
          this.skip();
        }
        writeFile(filename, code);
        // use setTimeout to wait for writeFile to propagate.
        await new Promise((resolve) => setTimeout(resolve, 100));
        const result = await runtimeRef.current[lang].runFiles([filename]);
        console.log(`${lang} single file stdout test: `, result);
        expect(result).to.be.deep.equal([
          {
            type: "stdout",
            message: msg,
          },
        ]);
      });

      it("should capture errors", async function () {
        const errorMsg = "This is a test error";
        const [filename, code] = (
          {
            python: ["test_error.py", `raise Exception("${errorMsg}")\n`],
            cpp: [
              "test_error.cpp",
              `#include <stdexcept>\nint main() {\n  throw std::runtime_error("${errorMsg}");\n  return 0;\n}\n`,
            ],
            javascript: [null, null],
          } satisfies Record<RuntimeLang, [string, string] | [null, null]>
        )[lang];
        if (!filename || !code) {
          this.skip();
        }
        writeFile(filename, code);
        await new Promise((resolve) => setTimeout(resolve, 100));
        const result = await runtimeRef.current[lang].runFiles([filename]);
        console.log(`${lang} single file error capture test: `, result);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(result.filter((r) => r.message.includes(errorMsg))).to.not.be
          .empty;
      });

      it("should capture stdout from multiple files", async function () {
        const msg = "Hello from multifile!";
        const [codes, execFiles] = (
          {
            python: [
              {
                "test_multi_main.py":
                  "from test_multi_sub import print_message\nprint_message()\n",
                "test_multi_sub.py": `def print_message():\n    print("${msg}")\n`,
              },
              ["test_multi_main.py"],
            ],
            cpp: [
              {
                "test_multi_main.cpp":
                  '#include "test_multi_sub.h"\nint main() {\n  print_message();\n  return 0;\n}\n',
                "test_multi_sub.h": "void print_message();\n",
                "test_multi_sub.cpp": `#include <iostream>\nvoid print_message() {\n  std::cout << "${msg}" << std::endl;\n}\n`,
              },
              ["test_multi_main.cpp", "test_multi_sub.cpp"],
            ],
            javascript: [null, null],
          } satisfies Record<RuntimeLang, [Record<string, string>, string[]] | [null, null]>
        )[lang];
        if (!codes || !execFiles) {
          this.skip();
        }
        for (const [filename, code] of Object.entries(codes)) {
          writeFile(filename, code);
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
        const result = await runtimeRef.current[lang].runFiles(execFiles);
        console.log(`${lang} multifile stdout test: `, result);
        expect(result).to.be.deep.equal([
          {
            type: "stdout",
            message: msg,
          },
        ]);
      });
    });
  });
}
