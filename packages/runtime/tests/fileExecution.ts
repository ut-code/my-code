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
   * 単一ファイルのコンパイルエラー（構文エラーや型エラー）で診断情報が得られるかテスト
   */
  "should capture diagnostics on compile error": (lang) => {
    const uniqueTypeName = "TestCompileError1234";
    const [filename, code] = (
      {
        python: ["test_compile.py", `def foo(\n`],
        ruby: null,
        cpp: [
          "test_compile.cpp",
          `int ${uniqueTypeName} = "type error";\nint main() {}\n`,
        ],
        rust: [
          "test_compile.rs",
          `static X: i32 = ${uniqueTypeName};\npub fn main() {}\n`,
        ],
        javascript: null,
        typescript: ["test_compile.ts", `const x: ${uniqueTypeName} = 1;\n`],
      } satisfies Record<RuntimeLang, [string, string] | null>
    )[lang] ?? [null, null];
    if (!filename || !code) return null;

    return async (runtimeRef) => {
      const outputs: ReplOutput[] = [];
      const diagnostics: Diagnostic[] = [];
      await runtimeRef.current![lang].runFiles(
        [filename],
        { [filename]: code },
        (output) => {
          if (output.type !== "file") outputs.push(output);
        },
        (diagnostic) => {
          diagnostics.push(diagnostic);
        }
      );
      console.log(`${lang} compile error output: `, outputs);
      console.log(
        `${lang} compile error diagnostic test: `,
        JSON.stringify(diagnostics, null, 2)
      );
      expect(diagnostics, "diagnostics should not be empty").to.not.be.empty;
      const firstDiag = diagnostics[0];
      expect(firstDiag.frames, "frames should not be empty").to.not.be.empty;
      expect(firstDiag.frames[0].filename, "frame filename").to.equal(filename);
      expect(firstDiag.frames[0].startLineNumber, "frame startLineNumber").to.equal(1);
      expect(firstDiag.severity, "severity should be error").to.equal("error");
    };
  },

  /**
   * 複数ファイル構成でサブモジュール/ヘッダーファイル内のコンパイルエラーを検出できるかテスト
   */
  "should capture diagnostics on compile error in submodule": (lang) => {
    const [codes, execFiles, expectedErrorFile, expectedLine] = (
      {
        python: null,
        ruby: null,
        cpp: [
          {
            "test_sub_main.cpp": '#include "test_sub.h"\nint main() { return 0; }\n',
            "test_sub.h": 'inline void foo() {\n  int x = "err";\n}\n',
          },
          ["test_sub_main.cpp"],
          "test_sub.h",
          2,
        ],
        rust: [
          {
            "test_sub_main.rs": "mod test_sub;\npub fn main() {\n    test_sub::foo();\n}\n",
            "test_sub.rs": 'pub fn foo() {\n    let x: i32 = "err";\n}\n',
          },
          ["test_sub_main.rs"],
          "test_sub.rs",
          2,
        ],
        javascript: null,
        typescript: null,
      } satisfies Record<
        RuntimeLang,
        [Record<string, string>, string[], string, number] | null
      >
    )[lang] ?? [null, null, null, null];
    if (!codes || !execFiles || !expectedErrorFile || !expectedLine) return null;

    return async (runtimeRef) => {
      const outputs: ReplOutput[] = [];
      const diagnostics: Diagnostic[] = [];
      await runtimeRef.current![lang].runFiles(
        execFiles,
        codes,
        (output) => {
          if (output.type !== "file") outputs.push(output);
        },
        (diagnostic) => {
          diagnostics.push(diagnostic);
        }
      );
      console.log(`${lang} submodule compile error output: `, outputs);
      console.log(
        `${lang} submodule compile error diagnostic test: `,
        JSON.stringify(diagnostics, null, 2)
      );
      expect(diagnostics, "diagnostics should not be empty").to.not.be.empty;
      const firstDiag = diagnostics[0];
      expect(firstDiag.frames, "frames should not be empty").to.not.be.empty;
      expect(firstDiag.frames[0].filename, "frame filename should point to submodule").to.equal(expectedErrorFile);
      expect(firstDiag.frames[0].startLineNumber, "frame startLineNumber").to.equal(expectedLine);
      expect(firstDiag.severity, "severity should be error").to.equal("error");
    };
  },

  /**
   * リンクエラー（未定義参照など）で診断情報が得られるかテスト
   */
  "should capture diagnostics on link error": (lang) => {
    const [filename, code] = (
      {
        python: null,
        ruby: null,
        cpp: [
          "test_link.cpp",
          "void undefined_function();\nint main() {\n  undefined_function();\n  return 0;\n}\n",
        ],
        rust: null,
        javascript: null,
        typescript: null,
      } satisfies Record<RuntimeLang, [string, string] | null>
    )[lang] ?? [null, null];
    if (!filename || !code) return null;

    return async (runtimeRef) => {
      const outputs: ReplOutput[] = [];
      const diagnostics: Diagnostic[] = [];
      await runtimeRef.current![lang].runFiles(
        [filename],
        { [filename]: code },
        (output) => {
          if (output.type !== "file") outputs.push(output);
        },
        (diagnostic) => {
          diagnostics.push(diagnostic);
        }
      );
      console.log(`${lang} link error output: `, outputs);
      console.log(
        `${lang} link error diagnostic test: `,
        JSON.stringify(diagnostics, null, 2)
      );
      expect(diagnostics, "diagnostics should not be empty").to.not.be.empty;
      const firstDiag = diagnostics[0];
      expect(firstDiag.frames, "frames should not be empty").to.not.be.empty;
      expect(firstDiag.frames[0].filename, "frame filename").to.equal(filename);
      expect(firstDiag.frames[0].startLineNumber, "frame startLineNumber").to.equal(3);
      expect(firstDiag.message, "error message").to.include("undefined reference");
      expect(firstDiag.severity, "severity should be error").to.equal("error");
    };
  },

  /**
   * 単一フレームの実行時エラー（例外やpanic）で診断情報が得られるかテスト
   */
  "should capture diagnostics on runtime error": (lang) => {
    const errorMsg = "RuntimeErrorUnique9876";
    const [filename, code, expectedLine] = (
      {
        python: ["test_runtime.py", `raise Exception("${errorMsg}")\n`, 1],
        ruby: ["test_runtime.rb", `raise "${errorMsg}"\n`, 1],
        cpp: [
          "test_runtime.cpp",
          `#include <stdexcept>\nint main() {\n  throw std::runtime_error("${errorMsg}");\n  return 0;\n}\n`,
          3,
        ],
        rust: [
          "test_runtime.rs",
          `pub fn main() {\n    panic!("${errorMsg}");\n}\n`,
          2,
        ],
        javascript: null,
        typescript: null,
      } satisfies Record<RuntimeLang, [string, string, number] | null>
    )[lang] ?? [null, null, null];
    if (!filename || !code || expectedLine === null) return null;

    return async (runtimeRef) => {
      const outputs: ReplOutput[] = [];
      const diagnostics: Diagnostic[] = [];
      await runtimeRef.current![lang].runFiles(
        [filename],
        { [filename]: code },
        (output) => {
          if (output.type !== "file") outputs.push(output);
        },
        (diagnostic) => {
          diagnostics.push(diagnostic);
        }
      );
      console.log(`${lang} runtime error output: `, outputs);
      console.log(
        `${lang} runtime error diagnostic test: `,
        JSON.stringify(diagnostics, null, 2)
      );
      expect(diagnostics, "diagnostics should not be empty").to.not.be.empty;
      const firstDiag = diagnostics[0];
      expect(firstDiag.frames, "frames should not be empty").to.not.be.empty;
      expect(firstDiag.frames[0].filename, "frame filename").to.equal(filename);
      expect(firstDiag.frames[0].startLineNumber, "frame startLineNumber").to.equal(expectedLine);
      expect(firstDiag.message, "error message").to.include(errorMsg);
      expect(firstDiag.severity, "severity should be error").to.equal("error");
    };
  },

  /**
   * クラッシュやシグナル（Segfault、配列外参照パニックなど）で診断情報が得られるかテスト
   */
  "should capture diagnostics on runtime crash or signal": (lang) => {
    const [filename, code, expectedLine, expectedMsg] = (
      {
        python: null,
        ruby: null,
        cpp: [
          "test_crash.cpp",
          "int main() {\n  int* ptr = nullptr;\n  *ptr = 42;\n  return 0;\n}\n",
          3,
          "Segmentation fault",
        ],
        rust: [
          "test_crash.rs",
          "pub fn main() {\n    let v = vec![1, 2];\n    let _ = v[5];\n}\n",
          3,
          "index out of bounds",
        ],
        javascript: null,
        typescript: null,
      } satisfies Record<RuntimeLang, [string, string, number, string] | null>
    )[lang] ?? [null, null, null, null];
    if (!filename || !code || expectedLine === null || !expectedMsg) return null;

    return async (runtimeRef) => {
      const outputs: ReplOutput[] = [];
      const diagnostics: Diagnostic[] = [];
      await runtimeRef.current![lang].runFiles(
        [filename],
        { [filename]: code },
        (output) => {
          if (output.type !== "file") outputs.push(output);
        },
        (diagnostic) => {
          diagnostics.push(diagnostic);
        }
      );
      console.log(`${lang} crash output: `, outputs);
      console.log(
        `${lang} crash diagnostic test: `,
        JSON.stringify(diagnostics, null, 2)
      );
      expect(diagnostics, "diagnostics should not be empty").to.not.be.empty;
      const firstDiag = diagnostics[0];
      expect(firstDiag.frames, "frames should not be empty").to.not.be.empty;
      expect(firstDiag.frames[0].filename, "frame filename").to.equal(filename);
      expect(firstDiag.frames[0].startLineNumber, "frame startLineNumber").to.equal(expectedLine);
      expect(firstDiag.message, "error message").to.include(expectedMsg);
      expect(firstDiag.severity, "severity should be error").to.equal("error");
    };
  },

  /**
   * 関数呼び出しを挟んだ複数フレームのエラーで1つのDiagnosticにまとめられるかテスト
   *
   * Python/Ruby/CPP/Rust: 関数呼び出し連鎖でスタックトレースを生成し、
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
        cpp: [
          "test_multiframe.cpp",
          `#include <stdexcept>\nvoid foo() { throw std::runtime_error("${uniqueTypeName}"); }\nvoid bar() { foo(); }\nint main() { bar(); }\n`,
        ],
        rust: [
          "test_multiframe.rs",
          `fn foo() {\n    panic!("${uniqueTypeName}");\n}\nfn bar() {\n    foo();\n}\npub fn main() {\n    bar();\n}\n`,
        ],
        javascript: [null, null],
        typescript: [null, null],
      } satisfies Record<RuntimeLang, [string, string] | [null, null]>
    )[lang];
    if (!filename || !code) return null;

    return async (runtimeRef) => {
      const outputs: ReplOutput[] = [];
      const diagnostics: Diagnostic[] = [];
      await runtimeRef.current![lang].runFiles(
        [filename],
        { [filename]: code },
        (output) => {
          if (output.type !== "file") outputs.push(output);
        },
        (diagnostic) => {
          diagnostics.push(diagnostic);
        }
      );
      console.log(`${lang} multi-frame output: `, outputs);
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
          cpp: [2, 3, 4],
          rust: [2, 5, 8],
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

  /**
   * コンパイル警告で診断情報（severity: 'warning'）が得られるかテスト
   */
  "should capture diagnostics on warning": (lang) => {
    const [filename, code] = (
      {
        python: null,
        ruby: null,
        cpp: [
          "test_warning.cpp",
          "int main() {\n  int unused_var = 42;\n  return 0;\n}\n",
        ],
        rust: [
          "test_warning.rs",
          "pub fn main() {\n    let unused_var = 42;\n}\n",
        ],
        javascript: null,
        typescript: null,
      } satisfies Record<RuntimeLang, [string, string] | null>
    )[lang] ?? [null, null];
    if (!filename || !code) return null;

    return async (runtimeRef) => {
      const outputs: ReplOutput[] = [];
      const diagnostics: Diagnostic[] = [];
      await runtimeRef.current![lang].runFiles(
        [filename],
        { [filename]: code },
        (output) => {
          if (output.type !== "file") outputs.push(output);
        },
        (diagnostic) => {
          diagnostics.push(diagnostic);
        }
      );
      console.log(`${lang} warning output: `, outputs);
      console.log(
        `${lang} warning diagnostic test: `,
        JSON.stringify(diagnostics, null, 2)
      );
      expect(diagnostics, "diagnostics should not be empty").to.not.be.empty;
      const warnDiag = diagnostics.find((d) => d.severity === "warning");
      expect(warnDiag, "should have warning diagnostic").to.exist;
      expect(warnDiag!.frames[0].filename, "frame filename").to.equal(filename);
      expect(warnDiag!.frames[0].startLineNumber, "frame startLineNumber").to.equal(2);
      expect(warnDiag!.message, "warning message").to.include("unused");
    };
  },
};
