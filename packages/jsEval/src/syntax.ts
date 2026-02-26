// @ts-expect-error comma operator for indirect eval
const indirectEval: (code: string) => unknown = (0, eval);

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
