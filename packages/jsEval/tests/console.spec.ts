import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createReplConsole, type ConsoleOutput } from "../src/index.js";

function collect() {
  const outputs: ConsoleOutput[] = [];
  const replConsole = createReplConsole((output) => outputs.push(output));
  return { outputs, replConsole };
}

describe("createReplConsole", () => {
  describe("log", () => {
    it("emits stdout with joined, formatted arguments", () => {
      const { outputs, replConsole } = collect();
      replConsole.log("hello", 42, { a: 1 });
      assert.deepStrictEqual(outputs, [
        { type: "stdout", message: "hello 42 { a: 1 }" },
      ]);
    });
  });

  describe("error", () => {
    it("emits stderr", () => {
      const { outputs, replConsole } = collect();
      replConsole.error("boom");
      assert.deepStrictEqual(outputs, [{ type: "stderr", message: "boom" }]);
    });
  });

  describe("warn", () => {
    it("emits stderr", () => {
      const { outputs, replConsole } = collect();
      replConsole.warn("careful");
      assert.deepStrictEqual(outputs, [{ type: "stderr", message: "careful" }]);
    });
  });

  describe("info", () => {
    it("emits stdout", () => {
      const { outputs, replConsole } = collect();
      replConsole.info("fyi");
      assert.deepStrictEqual(outputs, [{ type: "stdout", message: "fyi" }]);
    });
  });

  describe("time / timeEnd", () => {
    it("emits elapsed time on stdout for a matching label", () => {
      const { outputs, replConsole } = collect();
      replConsole.time("t");
      replConsole.timeEnd("t");
      assert.strictEqual(outputs.length, 1);
      assert.strictEqual(outputs[0]?.type, "stdout");
      assert.match(outputs[0]!.message, /^t: \d+(\.\d+)?m?s$/);
    });

    it("defaults the label to 'default'", () => {
      const { outputs, replConsole } = collect();
      replConsole.time();
      replConsole.timeEnd();
      assert.strictEqual(outputs.length, 1);
      assert.match(outputs[0]!.message, /^default: \d+(\.\d+)?m?s$/);
    });

    it("warns on stderr when starting a timer with a label already in use", () => {
      const { outputs, replConsole } = collect();
      replConsole.time("t");
      replConsole.time("t");
      assert.deepStrictEqual(outputs, [
        {
          type: "stderr",
          message: "Warning: Label 't' already exists for console.time()",
        },
      ]);
    });

    it("warns on stderr when ending a timer with no matching label", () => {
      const { outputs, replConsole } = collect();
      replConsole.timeEnd("missing");
      assert.deepStrictEqual(outputs, [
        {
          type: "stderr",
          message: "Warning: No such label 'missing' for console.timeEnd()",
        },
      ]);
    });

    it("allows reusing a label after it has been ended", () => {
      const { outputs, replConsole } = collect();
      replConsole.time("t");
      replConsole.timeEnd("t");
      replConsole.time("t");
      replConsole.timeEnd("t");
      assert.strictEqual(outputs.length, 2);
      assert.ok(outputs.every((o) => o.type === "stdout"));
    });
  });
});
