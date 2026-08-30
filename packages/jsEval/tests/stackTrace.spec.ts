import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseStackTrace,
  formatStackTrace,
  findSyntaxErrorLine,
  parseError,
} from "../src/index.js";

describe("stackTrace", () => {
  describe("Firefox dev environment stack", () => {
    const firefoxDevStack = `foo@http://localhost:3000/_next/static/chunks/_app-pages-browser_packages_runtime_src_worker_jsEval_worker_ts.js line 84 > eval line 66 > eval:2:9
@http://localhost:3000/_next/static/chunks/_app-pages-browser_packages_runtime_src_worker_jsEval_worker_ts.js line 84 > eval line 66 > eval:5:3
runFile@webpack-internal:///(app-pages-browser)/./packages/runtime/src/worker/jsEval.worker.ts:66:14
callback@webpack-internal:///(app-pages-browser)/./node_modules/.pnpm/comlink@4.4.2/node_modules/comlink/dist/esm/comlink.mjs:116:48`;

    it("parses frames accurately", () => {
      const frames = parseStackTrace(firefoxDevStack, "main.js");
      assert.strictEqual(frames.length, 2);
      assert.deepStrictEqual(frames[0], {
        functionName: "foo",
        filename: "main.js",
        lineNumber: 2,
        columnNumber: 9,
      });
      assert.deepStrictEqual(frames[1], {
        functionName: undefined,
        filename: "main.js",
        lineNumber: 5,
        columnNumber: 3,
      });
    });

    it("formats stack trace correctly", () => {
      const frames = parseStackTrace(firefoxDevStack, "main.js");
      const err = new Error("test");
      const formatted = formatStackTrace(err, frames, "main.js");
      const expected = "Error: test\n    at foo (main.js:2:9)\n    at (main.js:5:3)";
      assert.strictEqual(formatted, expected);
    });
  });

  describe("Firefox production stack", () => {
    const firefoxProdStack = `foo@https://my-code.utcode.net/_next/static/chunks/3724.2004c2fc86f4d4ce.js line 1 > eval:2:9
@https://my-code.utcode.net/_next/static/chunks/3724.2004c2fc86f4d4ce.js line 1 > eval:5:3
L@https://my-code.utcode.net/_next/static/chunks/3724.2004c2fc86f4d4ce.js:1:14823
o@https://my-code.utcode.net/_next/static/chunks/3724.2004c2fc86f4d4ce.js:1:12019`;

    it("parses frames accurately", () => {
      const frames = parseStackTrace(firefoxProdStack, "main.js");
      assert.strictEqual(frames.length, 2);
      assert.deepStrictEqual(frames[0], {
        functionName: "foo",
        filename: "main.js",
        lineNumber: 2,
        columnNumber: 9,
      });
      assert.deepStrictEqual(frames[1], {
        functionName: undefined,
        filename: "main.js",
        lineNumber: 5,
        columnNumber: 3,
      });
    });

    it("formats stack trace correctly", () => {
      const frames = parseStackTrace(firefoxProdStack, "main.js");
      const err = new Error("test");
      const formatted = formatStackTrace(err, frames, "main.js");
      const expected = "Error: test\n    at foo (main.js:2:9)\n    at (main.js:5:3)";
      assert.strictEqual(formatted, expected);
    });
  });

  describe("Safari dev environment stack", () => {
    const safariDevStack = `foo@
eval code@
eval@[native code]
runFile@
callback@`;

    it("parses frames without line numbers up to eval boundary", () => {
      const frames = parseStackTrace(safariDevStack, "main.js");
      assert.strictEqual(frames.length, 2);
      assert.deepStrictEqual(frames[0], {
        functionName: "foo",
        filename: "main.js",
      });
      assert.deepStrictEqual(frames[1], {
        functionName: undefined,
        filename: "main.js",
      });
    });

    it("formats stack trace without line numbers", () => {
      const frames = parseStackTrace(safariDevStack, "main.js");
      const err = new Error("test");
      const formatted = formatStackTrace(err, frames, "main.js");
      const expected = "Error: test\n    at foo (main.js)\n    at (main.js)";
      assert.strictEqual(formatted, expected);
    });
  });

  describe("Safari production stack", () => {
    const safariProdStack = `foo@
eval code@
eval@[native code]
L@https://my-code.utcode.net/_next/static/chunks/3724.2004c2fc86f4d4ce.js:1:14827
o@https://my-code.utcode.net/_next/static/chunks/3724.2004c2fc86f4d4ce.js:1:12024`;

    it("parses frames accurately up to eval boundary", () => {
      const frames = parseStackTrace(safariProdStack, "main.js");
      assert.strictEqual(frames.length, 2);
      assert.deepStrictEqual(frames[0], {
        functionName: "foo",
        filename: "main.js",
      });
      assert.deepStrictEqual(frames[1], {
        functionName: undefined,
        filename: "main.js",
      });
    });

    it("formats stack trace correctly", () => {
      const frames = parseStackTrace(safariProdStack, "main.js");
      const err = new Error("test");
      const formatted = formatStackTrace(err, frames, "main.js");
      const expected = "Error: test\n    at foo (main.js)\n    at (main.js)";
      assert.strictEqual(formatted, expected);
    });
  });

  describe("Chrome dev environment stack", () => {
    const chromeDevStack = `Error: test
    at foo (eval at runFile (webpack-internal:///(app-pages-browser)/./packages/runtime/src/worker/jsEval.worker.ts), <anonymous>:2:9)
    at eval (eval at runFile (webpack-internal:///(app-pages-browser)/./packages/runtime/src/worker/jsEval.worker.ts), <anonymous>:5:3)
    at eval (<anonymous>)
    at Object.runFile (webpack-internal:///(app-pages-browser)/./packages/runtime/src/worker/jsEval.worker.ts:66:14)
    at callback (webpack-internal:///(app-pages-browser)/./node_modules/.pnpm/comlink@4.4.2/node_modules/comlink/dist/esm/comlink.mjs:116:48)`;

    it("parses frames accurately and ignores internal frames", () => {
      const frames = parseStackTrace(chromeDevStack, "main.js");
      assert.strictEqual(frames.length, 2);
      assert.deepStrictEqual(frames[0], {
        functionName: "foo",
        filename: "main.js",
        lineNumber: 2,
        columnNumber: 9,
      });
      assert.deepStrictEqual(frames[1], {
        functionName: undefined,
        filename: "main.js",
        lineNumber: 5,
        columnNumber: 3,
      });
    });

    it("formats stack trace correctly", () => {
      const frames = parseStackTrace(chromeDevStack, "main.js");
      const err = new Error("test");
      const formatted = formatStackTrace(err, frames, "main.js");
      const expected = "Error: test\n    at foo (main.js:2:9)\n    at (main.js:5:3)";
      assert.strictEqual(formatted, expected);
    });
  });

  describe("Chrome production stack", () => {
    const chromeProdStack = `Error: test
    at foo (eval at L (https://my-code.utcode.net/_next/static/chunks/3724.2004c2fc86f4d4ce.js:1:14823), <anonymous>:2:9)
    at eval (eval at L (https://my-code.utcode.net/_next/static/chunks/3724.2004c2fc86f4d4ce.js:1:14823), <anonymous>:5:3)
    at eval (<anonymous>)
    at Object.L [as runFile] (https://my-code.utcode.net/_next/static/chunks/3724.2004c2fc86f4d4ce.js:1:14823)
    at o (https://my-code.utcode.net/_next/static/chunks/3724.2004c2fc86f4d4ce.js:1:12019)`;

    it("parses frames accurately", () => {
      const frames = parseStackTrace(chromeProdStack, "main.js");
      assert.strictEqual(frames.length, 2);
      assert.deepStrictEqual(frames[0], {
        functionName: "foo",
        filename: "main.js",
        lineNumber: 2,
        columnNumber: 9,
      });
      assert.deepStrictEqual(frames[1], {
        functionName: undefined,
        filename: "main.js",
        lineNumber: 5,
        columnNumber: 3,
      });
    });

    it("formats stack trace correctly", () => {
      const frames = parseStackTrace(chromeProdStack, "main.js");
      const err = new Error("test");
      const formatted = formatStackTrace(err, frames, "main.js");
      const expected = "Error: test\n    at foo (main.js:2:9)\n    at (main.js:5:3)";
      assert.strictEqual(formatted, expected);
    });
  });

  describe("sourceURL stack traces", () => {
    it("parses Chrome/V8 direct sourceURL stack", () => {
      const stack = `Error: test
    at foo (main.js:2:9)
    at eval (main.js:5:3)
    at Object.runFile (webpack-internal:///(app-pages-browser)/./packages/runtime/src/worker/jsEval.worker.ts:66:14)`;
      const frames = parseStackTrace(stack, "main.js");
      assert.strictEqual(frames.length, 2);
      assert.deepStrictEqual(frames[0], {
        functionName: "foo",
        filename: "main.js",
        lineNumber: 2,
        columnNumber: 9,
      });
      assert.deepStrictEqual(frames[1], {
        functionName: undefined,
        filename: "main.js",
        lineNumber: 5,
        columnNumber: 3,
      });
    });

    it("parses Firefox sourceURL stack", () => {
      const stack = `foo@main.js:2:9
@main.js:5:3
runFile@webpack-internal:///(app-pages-browser)/./packages/runtime/src/worker/jsEval.worker.ts:66:14`;
      const frames = parseStackTrace(stack, "main.js");
      assert.strictEqual(frames.length, 2);
      assert.deepStrictEqual(frames[0], {
        functionName: "foo",
        filename: "main.js",
        lineNumber: 2,
        columnNumber: 9,
      });
      assert.deepStrictEqual(frames[1], {
        functionName: undefined,
        filename: "main.js",
        lineNumber: 5,
        columnNumber: 3,
      });
    });

    it("parses Safari sourceURL stack", () => {
      const stack = `foo@main.js:2:9
eval code@main.js:5:3
eval@[native code]
runFile@webpack-internal:///(app-pages-browser)/./packages/runtime/src/worker/jsEval.worker.ts:66:14`;
      const frames = parseStackTrace(stack, "main.js");
      assert.strictEqual(frames.length, 2);
      assert.deepStrictEqual(frames[0], {
        functionName: "foo",
        filename: "main.js",
        lineNumber: 2,
        columnNumber: 9,
      });
      assert.deepStrictEqual(frames[1], {
        functionName: undefined,
        filename: "main.js",
        lineNumber: 5,
        columnNumber: 3,
      });
    });
  });

  describe("Multi-frame call stacks (foo -> bar -> baz)", () => {
    const multiStack = `Error: multi test
    at baz (eval at runFile (...), <anonymous>:2:9)
    at bar (eval at runFile (...), <anonymous>:5:3)
    at foo (eval at runFile (...), <anonymous>:8:3)
    at eval (eval at runFile (...), <anonymous>:10:1)
    at eval (<anonymous>)`;

    it("preserves order from innermost to outermost", () => {
      const frames = parseStackTrace(multiStack, "main.js");
      assert.strictEqual(frames.length, 4);
      assert.strictEqual(frames[0].functionName, "baz");
      assert.strictEqual(frames[0].lineNumber, 2);
      assert.strictEqual(frames[1].functionName, "bar");
      assert.strictEqual(frames[1].lineNumber, 5);
      assert.strictEqual(frames[2].functionName, "foo");
      assert.strictEqual(frames[2].lineNumber, 8);
      assert.strictEqual(frames[3].functionName, undefined);
      assert.strictEqual(frames[3].lineNumber, 10);
    });
  });

  describe("findSyntaxErrorLine", () => {
    it("locates syntax error in single-line invalid syntax", () => {
      const loc = findSyntaxErrorLine("function foo(\n");
      assert.strictEqual(loc.lineNumber, 1);
    });

    it("locates syntax error on the exact line in multi-line code", () => {
      const code = `const a = 1;
const = 2;
const c = 3;`;
      const loc = findSyntaxErrorLine(code);
      assert.strictEqual(loc.lineNumber, 2);
    });
  });

  describe("parseError integration", () => {
    it("creates Diagnostic and formattedStackTrace for runtime error", () => {
      const err = new Error("test");
      err.stack = `Error: test
    at foo (eval at runFile (...), <anonymous>:2:9)
    at eval (eval at runFile (...), <anonymous>:5:3)`;

      const result = parseError(err, undefined, "test.js");
      assert.strictEqual(
        result.formattedStackTrace,
        "Error: test\n    at foo (test.js:2:9)\n    at (test.js:5:3)"
      );
      assert.deepStrictEqual(result.diagnostic, {
        frames: [
          {
            filename: "test.js",
            startLineNumber: 2,
            startColumn: 9,
            endLineNumber: 2,
            endColumn: 9,
          },
          {
            filename: "test.js",
            startLineNumber: 5,
            startColumn: 3,
            endLineNumber: 5,
            endColumn: 3,
          },
        ],
        message: "Error: test",
        severity: "error",
      });
    });

    it("creates Diagnostic for SyntaxError without stack line numbers", () => {
      const err = new SyntaxError("Unexpected token ')'");
      const code = "function foo(\n";
      const result = parseError(err, code, "test_compile.js");
      assert.ok(result.diagnostic);
      assert.strictEqual(result.diagnostic.frames.length, 1);
      assert.strictEqual(result.diagnostic.frames[0].filename, "test_compile.js");
      assert.strictEqual(result.diagnostic.frames[0].startLineNumber, 1);
      assert.strictEqual(result.diagnostic.severity, "error");
    });
  });
});
