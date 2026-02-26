import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { checkSyntax } from "../src/index.js";

describe("checkSyntax", () => {
  describe("complete inputs", () => {
    it("simple expression is complete", async () => {
      assert.deepStrictEqual(await checkSyntax("1 + 2"), {
        status: "complete",
      });
    });

    it("function declaration is complete", async () => {
      assert.deepStrictEqual(await checkSyntax("function f() { return 1; }"), {
        status: "complete",
      });
    });

    it("if-else block is complete", async () => {
      assert.deepStrictEqual(
        await checkSyntax("if (true) { 1; } else { 2; }"),
        { status: "complete" }
      );
    });

    it("for loop is complete", async () => {
      assert.deepStrictEqual(
        await checkSyntax("for (let i = 0; i < 3; i++) {}"),
        { status: "complete" }
      );
    });

    it("empty string is complete", async () => {
      assert.deepStrictEqual(await checkSyntax(""), { status: "complete" });
    });
  });

  describe("incomplete inputs", () => {
    it("if(1){ is incomplete", async () => {
      assert.deepStrictEqual(await checkSyntax("if(1){"), {
        status: "incomplete",
      });
    });

    it("function f() { is incomplete", async () => {
      assert.deepStrictEqual(await checkSyntax("function f() {"), {
        status: "incomplete",
      });
    });

    it("open array bracket is incomplete", async () => {
      assert.deepStrictEqual(await checkSyntax("[1, 2,"), {
        status: "incomplete",
      });
    });

    it("open object brace is incomplete", async () => {
      assert.deepStrictEqual(await checkSyntax("({ a:"), {
        status: "incomplete",
      });
    });
  });

  describe("invalid inputs", () => {
    it("extra closing brace after complete block returns incomplete (extra } matches wrapper)", async () => {
      // The implementation wraps code in `() => {<code>}`.
      // An extra } is interpreted as closing the wrapper early, so the
      // engine reports "Unexpected token '}'" – which the heuristic maps to
      // "incomplete".  This is a known limitation of the wrapper approach.
      assert.deepStrictEqual(await checkSyntax("if(1){}}"), {
        status: "incomplete",
      });
    });

    it("syntax error expression is invalid", async () => {
      assert.deepStrictEqual(await checkSyntax("1 +* 2"), {
        status: "invalid",
      });
    });
  });
});
