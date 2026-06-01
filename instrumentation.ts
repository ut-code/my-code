import * as Sentry from "@sentry/nextjs";
import { DrizzleQueryError } from "drizzle-orm";
export async function register() {
  Sentry.init({
    enabled: process.env.NODE_ENV !== "development",
    dsn: process.env.SENTRY_DSN,
    integrations: [
      Sentry.extraErrorDataIntegration({ depth: 10 }),
      Sentry.zodErrorsIntegration(),
    ],
    beforeSend: function (event, hint) {
      if (
        hint.originalException instanceof DrizzleQueryError &&
        hint.originalException.cause
      ) {
        event.fingerprint = [
          String(hint.originalException.cause),
          event.transaction ?? "",
        ];
      }
      return event;
    },
    // Adds request headers and IP for users
    sendDefaultPii: true,
  });
}
// Capture errors from Server Components, middleware, and proxies
export const onRequestError = Sentry.captureRequestError;
