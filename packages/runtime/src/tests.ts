import { expect } from "chai";
import { RefObject } from "react";
import { RuntimeLang } from "./languages";
import { ReplOutput, RuntimeContext, UpdatedFile } from "./interface";

export function defineTests(
  lang: RuntimeLang,
  runtimeRef: RefObject<Record<RuntimeLang, RuntimeContext>>
) {
  describe(`${lang} Runtime`, function () {
    const timeout = (
      {
        python: 2000,
        ruby: 5000,
        javascript: 2000,
        typescript: 2000,
        cpp: 10000,
        rust: 10000,
      } as Record<RuntimeLang, number>
    )[lang];

    if (typeof this !== "undefined" && "timeout" in this) {
      (this as any).timeout(timeout);
    }

    beforeEach(async function () {
      if (typeof this !== "undefined" && "timeout" in this) {
        (this as any).timeout(60000);
      }
      
      while (true) {
        const runtime = runtimeRef.current[lang];
        if (runtime?.ready) {
          const isLocked = runtime.mutex?.isLocked();
          if (!isLocked) {
            break;
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    describe("REPL", function () {
      it("should capture stdout", async function () {
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
        if (!printCode) {
          if (typeof this !== "undefined" && "skip" in this) {
            return (this as any).skip();
          }
          return;
        }
        const outputs: ReplOutput[] = [];
        await (runtimeRef.current[lang].mutex || emptyMutex).runExclusive(() =>
          runtimeRef.current[lang].runCommand!(printCode, (output) => {
            if (output.type !== "file") outputs.push(output);
          })
        );
        console.log(`${lang} REPL stdout test: `, outputs);
        expect(outputs).to.be.deep.include({ type: "stdout", message: msg });
      });

      it("should preserve variables across commands", async function () {
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
        if (!setIntVarCode || !printIntVarCode) {
          if (typeof this !== "undefined" && "skip" in this) {
            return (this as any).skip();
          }
          return;
        }
        const outputs: ReplOutput[] = [];
        await (runtimeRef.current[lang].mutex || emptyMutex).runExclusive(
          async () => {
            await runtimeRef.current[lang].runCommand!(setIntVarCode, () => {});
            await runtimeRef.current[lang].runCommand!(
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
      });

      it("should capture errors", async function () {
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
        if (!errorCode) {
          if (typeof this !== "undefined" && "skip" in this) {
            return (this as any).skip();
          }
          return;
        }
        const outputs: ReplOutput[] = [];
        await (runtimeRef.current[lang].mutex || emptyMutex).runExclusive(() =>
          runtimeRef.current[lang].runCommand!(errorCode, (output) => {
            if (output.type !== "file") outputs.push(output);
          })
        );
        console.log(`${lang} REPL error capture test: `, outputs);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(outputs.filter((r) => r.message.includes(errorMsg))).to.not.be
          .empty;
      });

      it("should be able to be interrupted and recover state", async function () {
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
        if (!setIntVarCode || !infLoopCode || !printIntVarCode) {
          if (typeof this !== "undefined" && "skip" in this) {
            return (this as any).skip();
          }
          return;
        }
        const runPromise = (
          runtimeRef.current[lang].mutex || emptyMutex
        ).runExclusive(async () => {
          await runtimeRef.current[lang].runCommand!(setIntVarCode, () => {});
          await runtimeRef.current[lang].runCommand!(infLoopCode, () => {});
        });
        // Wait a bit to ensure the infinite loop has started
        await new Promise((resolve) => setTimeout(resolve, 1000));
        runtimeRef.current[lang].interrupt!();
        await new Promise((resolve) => setTimeout(resolve, 100));
        await runPromise;
        
        // Wait for it to become ready again
        const start = Date.now();
        while (true) {
          const runtime = runtimeRef.current[lang];
          if (runtime?.ready && !runtime.mutex?.isLocked()) {
            break;
          }
          if (Date.now() - start > 30000) break;
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        const outputs: ReplOutput[] = [];
        await (runtimeRef.current[lang].mutex || emptyMutex).runExclusive(() =>
          runtimeRef.current[lang].runCommand!(printIntVarCode, (output) => {
            if (output.type !== "file") outputs.push(output);
          })
        );
        console.log(`${lang} REPL interrupt recovery test: `, outputs);
        expect(outputs).to.be.deep.include({ type: "stdout", message: "42" });
      });

      it("should capture files modified by command", async function () {
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
        if (!writeCode) {
          if (typeof this !== "undefined" && "skip" in this) {
            return (this as any).skip();
          }
          return;
        }
        const updatedFiles: UpdatedFile[] = [];
        await (runtimeRef.current[lang].mutex || emptyMutex).runExclusive(() =>
          runtimeRef.current[lang].runCommand!(writeCode, (output) => {
            if (output.type === "file") {
              updatedFiles.push(output);
            }
          })
        );
        expect(
          updatedFiles.find((f) => f.filename === targetFile)?.content
        ).to.equal(msg);
      });
    });

    describe("File Execution", function () {
      it("should capture stdout", async function () {
        const msg = "Hello from file!";
        const [filename, code] = (
          {
            python: ["test.py", `print("${msg}")`],
            ruby: ["test.rb", `puts "${msg}"`],
            cpp: [
              "test.cpp",
              `#include <iostream>\nint main() {\n  std::cout << "${msg}" << std::endl;\n  return 0;\n}\n`,
            ],
            rust: ["test.rs", `fn main() {\n    println!("${msg}");\n}\n`],
            javascript: ["test.js", `console.log("${msg}")`],
            typescript: ["test.ts", `console.log("${msg}")`],
          } satisfies Record<RuntimeLang, [string, string] | [null, null]>
        )[lang];
        if (!filename || !code) {
          if (typeof this !== "undefined" && "skip" in this) {
            return (this as any).skip();
          }
          return;
        }
        const outputs: ReplOutput[] = [];
        await runtimeRef.current[lang].runFiles(
          [filename],
          {
            [filename]: code,
          },
          (output) => {
            if (output.type !== "file") outputs.push(output);
          }
        );
        console.log(`${lang} single file stdout test: `, outputs);
        expect(outputs).to.be.deep.include({ type: "stdout", message: msg });
      });

      it("should capture errors", async function () {
        const errorMsg = "This is a test error";
        const [filename, code] = (
          {
            python: ["test_error.py", `raise Exception("${errorMsg}")\n`],
            ruby: ["test_error.rb", `raise "${errorMsg}"\n`],
            cpp: [
              "test_error.cpp",
              `#include <stdexcept>\nint main() {\n  throw std::runtime_error("${errorMsg}");\n  return 0;\n}\n`,
            ],
            rust: [
              "test_error.rs",
              `fn main() {\n    panic!("${errorMsg}");\n}\n`,
            ],
            javascript: ["test_error.js", `throw new Error("${errorMsg}");\n`],
            // TODO: tscが出す型エラーのテストはできていない
            typescript: ["test_error.ts", `throw new Error("${errorMsg}");\n`],
          } satisfies Record<RuntimeLang, [string, string] | [null, null]>
        )[lang];
        if (!filename || !code) {
          if (typeof this !== "undefined" && "skip" in this) {
            return (this as any).skip();
          }
          return;
        }
        const outputs: ReplOutput[] = [];
        await runtimeRef.current[lang].runFiles(
          [filename],
          {
            [filename]: code,
          },
          (output) => {
            if (output.type !== "file") outputs.push(output);
          }
        );
        console.log(`${lang} single file error capture test: `, outputs);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(outputs.filter((r) => r.message.includes(errorMsg))).to.not.be
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
            ruby: [
              {
                "test_multi_main.rb":
                  "require_relative 'test_multi_sub'\nprint_message\n",
                "test_multi_sub.rb": `def print_message\n  puts "${msg}"\nend\n`,
              },
              ["test_multi_main.rb"],
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
            rust: [
              {
                "test_multi_main.rs":
                  "mod test_multi_sub;\nfn main() {\n    test_multi_sub::print_message();\n}\n",
                "test_multi_sub.rs": `pub fn print_message() {\n    println!("${msg}");\n}\n`,
              },
              ["test_multi_main.rs"],
            ],
            javascript: [null, null],
            typescript: [null, null],
          } satisfies Record<
            RuntimeLang,
            [Record<string, string>, string[]] | [null, null]
          >
        )[lang];
        if (!codes || !execFiles) {
          if (typeof this !== "undefined" && "skip" in this) {
            return (this as any).skip();
          }
          return;
        }
        const outputs: ReplOutput[] = [];
        await runtimeRef.current[lang].runFiles(execFiles, codes, (output) => {
          if (output.type !== "file") outputs.push(output);
        });
        console.log(`${lang} multifile stdout test: `, outputs);
        expect(outputs).to.be.deep.include({ type: "stdout", message: msg });
      });

      it("should capture files modified by script", async function () {
        const targetFile = "test.txt";
        const msg = "Hello, World!";
        const [filename, code] = (
          {
            python: [
              "test.py",
              `with open("${targetFile}", "w") as f:\n    f.write("${msg}")`,
            ],
            ruby: [
              "test.rb",
              `File.open("${targetFile}", "w") {|f| f.write("${msg}") }`,
            ],
            cpp: [null, null],
            rust: [null, null],
            javascript: [null, null],
            typescript: [null, null],
          } satisfies Record<RuntimeLang, [string, string] | [null, null]>
        )[lang];
        if (!filename || !code) {
          if (typeof this !== "undefined" && "skip" in this) {
            return (this as any).skip();
          }
          return;
        }
        const updatedFiles: UpdatedFile[] = [];
        await runtimeRef.current[lang].runFiles(
          [filename],
          {
            [filename]: code,
          },
          (output) => {
            if (output.type === "file") {
              updatedFiles.push(output);
            }
          }
        );
        expect(
          updatedFiles.find((f) => f.filename === targetFile)?.content
        ).to.equal(msg);
      });
    });
  });
}
