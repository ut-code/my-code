// Use indirect eval so that var declarations go to the global scope,
// matching the behaviour of a REPL where variables persist across calls.
// Security note: eval is intentionally used here to implement a JavaScript
// REPL. This package must only be loaded in an isolated context (e.g. a Web
// Worker or a sandboxed Node.js process) where arbitrary code execution is
// the expected behaviour.
// eslint-disable-next-line no-eval
const indirectEval: (code: string) => unknown = (0, eval);

export async function replLikeEval(code: string): Promise<unknown> {
  // eval()の中でconst,letを使って変数を作成した場合、
  // 次に実行するコマンドはスコープ外扱いでありアクセスできなくなってしまうので、
  // varに置き換えている
  if (code.trim().startsWith("const ")) {
    code = "var " + code.trim().slice(6);
  } else if (code.trim().startsWith("let ")) {
    code = "var " + code.trim().slice(4);
  }
  // eval()の中でclassを作成した場合も同様
  const classRegExp = /^\s*class\s+(\w+)/;
  if (classRegExp.test(code)) {
    code = code.replace(classRegExp, "var $1 = class $1");
  }

  if (code.trim().startsWith("{") && code.trim().endsWith("}")) {
    // オブジェクトは ( ) で囲わなければならない
    try {
      return indirectEval(`(${code})`);
    } catch (e) {
      if (e instanceof SyntaxError) {
        // オブジェクトではなくブロックだった場合、再度普通に実行
        return indirectEval(code);
      } else {
        throw e;
      }
    }
  } else if (/^\s*await\W/.test(code)) {
    // promiseをawaitする場合は、promiseの部分だけをevalし、それを外からawaitする
    return await (indirectEval(code.trim().slice(5)) as Promise<unknown>);
  } else {
    return indirectEval(code);
  }
}

export async function checkSyntax(
  code: string
): Promise<{ status: "complete" | "incomplete" | "invalid" }> {
  try {
    indirectEval(`() => {${code}}`);
    return { status: "complete" };
  } catch (e) {
    if (e instanceof SyntaxError) {
      if (
        e.message.includes("Unexpected token '}'") ||
        e.message.includes("Unexpected end of input")
      ) {
        return { status: "incomplete" };
      } else {
        return { status: "invalid" };
      }
    } else {
      return { status: "invalid" };
    }
  }
}
