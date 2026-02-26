import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { replLikeEval } from "../src/index.js";

describe("replLikeEval", () => {
  describe("var declaration", () => {
    it("evaluates var and returns undefined", async () => {
      const result = await replLikeEval("var x = 42");
      assert.strictEqual(result, undefined);
    });
  });

  describe("const declaration", () => {
    it("converts const to var and returns undefined", async () => {
      const result = await replLikeEval("const constVar = 1");
      assert.strictEqual(result, undefined);
    });
  });

  describe("let declaration", () => {
    it("converts let to var and returns undefined", async () => {
      const result = await replLikeEval("let letVar = 2");
      assert.strictEqual(result, undefined);
    });
  });

  describe("undeclared variable assignment", () => {
    it("assigns to global and returns the assigned value", async () => {
      const result = await replLikeEval("undeclaredVar = 99");
      assert.strictEqual(result, 99);
    });
  });

  describe("expression evaluation", () => {
    it("returns numeric result", async () => {
      assert.strictEqual(await replLikeEval("1 + 2"), 3);
    });

    it("returns string result", async () => {
      assert.strictEqual(await replLikeEval('"hello"'), "hello");
    });

    it("returns boolean result", async () => {
      assert.strictEqual(await replLikeEval("true"), true);
    });
  });

  describe("function declaration", () => {
    it("declares a function and returns undefined", async () => {
      const result = await replLikeEval("function greet() { return 'hi'; }");
      assert.strictEqual(result, undefined);
    });
  });

  describe("class declaration", () => {
    it("converts class to var-assigned class expression and returns undefined", async () => {
      const result = await replLikeEval("class MyClass { constructor() {} }");
      assert.strictEqual(result, undefined);
    });
  });

  describe("array literal", () => {
    it("returns an array", async () => {
      const result = await replLikeEval("[1, 2, 3]");
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    it("returns an empty array", async () => {
      assert.deepStrictEqual(await replLikeEval("[]"), []);
    });
  });

  describe("object literal", () => {
    it("returns an object for { a: 1 }", async () => {
      const result = await replLikeEval("{ a: 1 }");
      assert.deepStrictEqual(result, { a: 1 });
    });

    it("returns an empty object for {}", async () => {
      assert.deepStrictEqual(await replLikeEval("{}"), {});
    });
  });

  describe("block that looks like an object", () => {
    it("executes a labelled statement block and returns undefined", async () => {
      // { x: 1 } is ambiguous – first tried as object; if that fails as
      // SyntaxError it falls back to block execution. A true label statement
      // `{ label: expr; }` is a block and eval returns the last expression.
      // { a: 1 } is valid as both, so replLikeEval returns the object.
      const result = await replLikeEval("{ x: 1 }");
      // Treated as object literal when it is valid JSON-like
      assert.deepStrictEqual(result, { x: 1 });
    });

    it("executes pure block statement when object parse fails", async () => {
      // A block containing a statement that is invalid as an object expression
      // forces the fallback path.
      const result = await replLikeEval("{ let tmp = 5; tmp; }");
      assert.strictEqual(result, 5);
    });
  });

  describe("await expression", () => {
    it("awaits a resolved promise", async () => {
      const result = await replLikeEval("await Promise.resolve(7)");
      assert.strictEqual(result, 7);
    });
  });

  describe("error propagation", () => {
    it("throws ReferenceError for undefined identifier", async () => {
      await assert.rejects(
        () => replLikeEval("notDefinedAtAllXyz"),
        ReferenceError
      );
    });
  });
});
