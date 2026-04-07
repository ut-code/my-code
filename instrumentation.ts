export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
// Capture errors from Server Components, middleware, and proxies
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function onRequestError(e: unknown, r: any, ec: any) {
  const { captureRequestError } = await import("@sentry/nextjs");
  captureRequestError(e, r, ec);
}
