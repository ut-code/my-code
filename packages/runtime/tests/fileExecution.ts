import { RuntimeLang } from "@my-code/runtime/languages";
import { TestBody } from "./utils";
import { ReplOutput, UpdatedFile } from "@my-code/runtime/interface";
import { expect } from "chai";

export const fileExecutionTests: Record<
  string,
  (lang: RuntimeLang) => TestBody | null
> = {
  "should capture stdout": (lang) => {
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
    if (!filename || !code) return null;

    return async (runtimeRef) => {
      const outputs: ReplOutput[] = [];
      await runtimeRef.current![lang].runFiles(
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
    };
  },

  "should capture errors": (lang) => {
    const errorMsg = "This is a test error";
    const [filename, code] = (
      {
        python: ["test_error.py", `raise Exception("${errorMsg}")\n`],
        ruby: ["test_error.rb", `raise "${errorMsg}"\n`],
        cpp: [
          "test_error.cpp",
          `#include <stdexcept>\nint main() {\n  throw std::runtime_error("${errorMsg}");\n  return 0;\n}\n`,
        ],
        rust: ["test_error.rs", `fn main() {\n    panic!("${errorMsg}");\n}\n`],
        javascript: ["test_error.js", `throw new Error("${errorMsg}");\n`],
        typescript: ["test_error.ts", `throw new Error("${errorMsg}");\n`],
      } satisfies Record<RuntimeLang, [string, string] | [null, null]>
    )[lang];
    if (!filename || !code) return null;

    return async (runtimeRef) => {
      const outputs: ReplOutput[] = [];
      await runtimeRef.current![lang].runFiles(
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
    };
  },

  "should capture stdout from multiple files": (lang) => {
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
    if (!codes || !execFiles) return null;

    return async (runtimeRef) => {
      const outputs: ReplOutput[] = [];
      await runtimeRef.current![lang].runFiles(execFiles, codes, (output) => {
        if (output.type !== "file") outputs.push(output);
      });
      console.log(`${lang} multifile stdout test: `, outputs);
      expect(outputs).to.be.deep.include({ type: "stdout", message: msg });
    };
  },

  "should capture files modified by script": (lang) => {
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
    if (!filename || !code) return null;

    return async (runtimeRef) => {
      const updatedFiles: UpdatedFile[] = [];
      await runtimeRef.current![lang].runFiles(
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
    };
  },
};
