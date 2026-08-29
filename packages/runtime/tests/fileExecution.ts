import { RuntimeLang } from "@my-code/runtime/languages";
import { TestBody } from "./utils";
import {
  Diagnostic,
  ReplOutput,
  UpdatedFile,
} from "@my-code/runtime/interface";
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

  /**
   * 単純なエラーで診断情報が得られるかテスト
   *
   * Python/Ruby: `raise "UniqueError"` で1件のDiagnosticが返り、
   *   frames[0].filename・startLineNumber・messageが正しいか確認
   *
   * TypeScript: 存在しない型名を使うことでエラーメッセージに型名が含まれるようにする
   *   例: `const x: TestDiagUniqueType9876 = 1;`
   *   → TSのエラーメッセージに "TestDiagUniqueType9876" が含まれる
   */
  "should capture diagnostics on error": (lang) => {
    // TypeScript用: 型名をユニークな識別子にしてエラーメッセージに含める
    const uniqueTypeName = "TestDiagUniqueType9876";
    const [filename, code] = (
      {
        python: ["test_diag.py", `raise Exception("${uniqueTypeName}")\n`],
        ruby: ["test_diag.rb", `raise "${uniqueTypeName}"\n`],
        cpp: [null, null],
        rust: [null, null],
        javascript: [null, null],
        typescript: ["test_diag.ts", `const x: ${uniqueTypeName} = 1;\n`],
      } satisfies Record<RuntimeLang, [string, string] | [null, null]>
    )[lang];
    if (!filename || !code) return null;

    return async (runtimeRef) => {
      const diagnostics: Diagnostic[] = [];
      await runtimeRef.current![lang].runFiles(
        [filename],
        {
          [filename]: code,
        },
        () => {},
        (diagnostic) => {
          diagnostics.push(diagnostic);
        }
      );
      console.log(
        `${lang} single file diagnostic test: `,
        JSON.stringify(diagnostics, null, 2)
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(diagnostics, "diagnostics should not be empty").to.not.be.empty;
      // 最初のDiagnosticの主要フレームが正しいファイル・行・メッセージを持つか確認
      const firstDiag = diagnostics[0];
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(firstDiag.frames, "frames should not be empty").to.not.be.empty;
      expect(firstDiag.frames[0].filename, "frame filename").to.equal(filename);
      expect(
        firstDiag.frames[0].startLineNumber,
        "frame startLineNumber"
      ).to.equal(1);
      expect(firstDiag.message, "error message").to.include(uniqueTypeName);
    };
  },

  /**
   * 関数呼び出しを挟んだ複数フレームのエラーで1つのDiagnosticにまとめられるかテスト
   *
   * Python/Ruby: 関数呼び出し連鎖でスタックトレースを生成し、
   *   - diagnosticsが1件だけ返ること
   *   - framesが2件以上あること
   *   - 全フレームがユーザーファイルを指すこと（<exec>等の内部フレームが含まれないこと）
   *   を確認する
   */
  "should capture multi-frame diagnostics as single Diagnostic": (lang) => {
    const uniqueTypeName = "TestMultiFrameError5678";
    const [filename, code] = (
      {
        python: [
          "test_multiframe.py",
          // bar() -> foo() -> raise で3フレームのトレースバックを生成
          `def foo():\n    raise Exception("${uniqueTypeName}")\n\ndef bar():\n    foo()\n\nbar()\n`,
        ],
        ruby: [
          "test_multiframe.rb",
          // bar -> foo -> raise で複数フレームのエラーを生成
          `def foo\n  raise "${uniqueTypeName}"\nend\n\ndef bar\n  foo\nend\n\nbar\n`,
        ],
        cpp: [null, null],
        rust: [null, null],
        javascript: [null, null],
        typescript: [null, null],
      } satisfies Record<RuntimeLang, [string, string] | [null, null]>
    )[lang];
    if (!filename || !code) return null;

    return async (runtimeRef) => {
      const diagnostics: Diagnostic[] = [];
      await runtimeRef.current![lang].runFiles(
        [filename],
        { [filename]: code },
        () => {},
        (diagnostic) => {
          diagnostics.push(diagnostic);
        }
      );
      console.log(
        `${lang} multi-frame diagnostic test: `,
        JSON.stringify(diagnostics, null, 2)
      );

      // 1エラー → 1 Diagnostic
      expect(diagnostics, "should have exactly 1 diagnostic").to.have.lengthOf(
        1
      );
      const diag = diagnostics[0];

      // メッセージにユニーク文字列が含まれる
      expect(
        diag.message,
        "error message should include unique string"
      ).to.include(uniqueTypeName);

      // 複数フレームがあること
      expect(
        diag.frames,
        "should have multiple frames"
      ).to.have.length.greaterThan(1);

      // 最新のフレームが先頭に来ること（innermost frame first）
      expect(
        diag.frames[0].startLineNumber,
        "first frame should be the innermost frame where error was raised"
      ).to.equal(2);

      // フレームの順序が最新（エラー発生箇所）から呼び出し元への順になっていること
      const expectedLines = (
        {
          python: [2, 5, 7],
          ruby: [2, 6, 9],
          cpp: null,
          rust: null,
          javascript: null,
          typescript: null,
        } satisfies Record<RuntimeLang, number[] | null>
      )[lang];
      if (expectedLines) {
        expect(
          diag.frames.map((f) => f.startLineNumber),
          "frames should be ordered from newest (innermost) to oldest (outermost)"
        ).to.deep.equal(expectedLines);
      }

      // <exec>, <string> など内部フレームが含まれないこと
      for (const frame of diag.frames) {
        expect(
          frame.filename,
          "frame filename should not be internal"
        ).to.not.match(/^<.*>$/);
        expect(frame.filename, "frame filename should be user file").to.equal(
          filename
        );
      }
    };
  },
};
