import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parsePythonTraceback } from "../packages/runtime/src/diagnostics/python";
import { parseRubyError } from "../packages/runtime/src/diagnostics/ruby";

describe("Diagnostics parser tests", () => {
  describe("Python Traceback parser", () => {
    it("should parse simple Python traceback", () => {
      const tb = `Traceback (most recent call last):
  File "/home/pyodide/test_error.py", line 1, in <module>
    raise Exception("This is a test error")
Exception: This is a test error`;

      const diagnostics = parsePythonTraceback(tb, "/home/pyodide/");
      assert.equal(diagnostics.length, 1);
      assert.equal(diagnostics[0].filename, "test_error.py");
      assert.equal(diagnostics[0].startLineNumber, 1);
      assert.equal(diagnostics[0].message, "Exception: This is a test error");
      assert.equal(diagnostics[0].severity, "error");
    });

    it("should parse multi-frame Python traceback", () => {
      const tb = `Traceback (most recent call last):
  File "/home/pyodide/main.py", line 5, in <module>
    helper()
  File "/home/pyodide/helper.py", line 2, in helper
    raise ValueError("invalid value")
ValueError: invalid value`;

      const diagnostics = parsePythonTraceback(tb, "/home/pyodide/");
      assert.equal(diagnostics.length, 2);
      assert.equal(diagnostics[0].filename, "main.py");
      assert.equal(diagnostics[0].startLineNumber, 5);
      assert.equal(diagnostics[0].message, "ValueError: invalid value");

      assert.equal(diagnostics[1].filename, "helper.py");
      assert.equal(diagnostics[1].startLineNumber, 2);
      assert.equal(diagnostics[1].message, "ValueError: invalid value");
    });

    it("should parse Python SyntaxError with column indicator", () => {
      const tb = `  File "/home/pyodide/syntax.py", line 3
    def foo(
           ^
SyntaxError: '(' was never closed`;

      const diagnostics = parsePythonTraceback(tb, "/home/pyodide/");
      assert.equal(diagnostics.length, 1);
      assert.equal(diagnostics[0].filename, "syntax.py");
      assert.equal(diagnostics[0].startLineNumber, 3);
      assert.equal(diagnostics[0].startColumn, 12);
      assert.equal(diagnostics[0].message, "SyntaxError: '(' was never closed");
    });

    it("should ignore <exec> and <string> internal frames", () => {
      const tb = `Traceback (most recent call last):
  File "<exec>", line 1, in <module>
  File "/home/pyodide/app.py", line 10, in run
    1 / 0
ZeroDivisionError: division by zero`;

      const diagnostics = parsePythonTraceback(tb, "/home/pyodide/");
      assert.equal(diagnostics.length, 1);
      assert.equal(diagnostics[0].filename, "app.py");
      assert.equal(diagnostics[0].startLineNumber, 10);
    });

    it("should handle empty or null input gracefully", () => {
      assert.deepEqual(parsePythonTraceback(""), []);
    });
  });

  describe("Ruby Error parser", () => {
    it("should parse simple Ruby runtime error", () => {
      const err = `test_error.rb:1:in '<main>': This is a test error (RuntimeError)`;

      const diagnostics = parseRubyError(err);
      assert.equal(diagnostics.length, 1);
      assert.equal(diagnostics[0].filename, "test_error.rb");
      assert.equal(diagnostics[0].startLineNumber, 1);
      assert.equal(diagnostics[0].message, "This is a test error (RuntimeError)");
      assert.equal(diagnostics[0].severity, "error");
    });

    it("should parse Ruby error with virtual filesystem slash", () => {
      const err = `/test_error.rb:4:in 'bar': undefined local variable or method 'baz' (NameError)`;

      const diagnostics = parseRubyError(err);
      assert.equal(diagnostics.length, 1);
      assert.equal(diagnostics[0].filename, "test_error.rb");
      assert.equal(diagnostics[0].startLineNumber, 4);
      assert.equal(
        diagnostics[0].message,
        "undefined local variable or method 'baz' (NameError)"
      );
    });

    it("should parse Ruby stack trace with from lines", () => {
      const err = `/sub.rb:2:in 'bar': Something went wrong (RuntimeError)
\tfrom /main.rb:5:in 'foo'
\tfrom /main.rb:8:in '<main>'`;

      const diagnostics = parseRubyError(err);
      assert.equal(diagnostics.length, 3);
      assert.equal(diagnostics[0].filename, "sub.rb");
      assert.equal(diagnostics[0].startLineNumber, 2);
      assert.equal(diagnostics[0].message, "Something went wrong (RuntimeError)");

      assert.equal(diagnostics[1].filename, "main.rb");
      assert.equal(diagnostics[1].startLineNumber, 5);

      assert.equal(diagnostics[2].filename, "main.rb");
      assert.equal(diagnostics[2].startLineNumber, 8);
    });

    it("should parse Ruby SyntaxError", () => {
      const err = `test_syntax.rb:2: syntax error, unexpected end-of-input, expecting '}'`;

      const diagnostics = parseRubyError(err);
      assert.equal(diagnostics.length, 1);
      assert.equal(diagnostics[0].filename, "test_syntax.rb");
      assert.equal(diagnostics[0].startLineNumber, 2);
      assert.equal(
        diagnostics[0].message,
        "syntax error, unexpected end-of-input, expecting '}'"
      );
    });

    it("should ignore internal eval lines", () => {
      const err = `-e:in 'Kernel.eval'
eval:1:in '<main>'
/app.rb:3:in 'run': error (StandardError)`;

      const diagnostics = parseRubyError(err);
      assert.equal(diagnostics.length, 1);
      assert.equal(diagnostics[0].filename, "app.rb");
      assert.equal(diagnostics[0].startLineNumber, 3);
    });

    it("should handle empty input gracefully", () => {
      assert.deepEqual(parseRubyError(""), []);
    });
  });
});
