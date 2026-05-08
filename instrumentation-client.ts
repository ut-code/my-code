import * as Sentry from "@sentry/nextjs";
Sentry.init({
  enabled: process.env.NODE_ENV !== 'development',
  dsn: process.env.SENTRY_DSN,
  integrations: [
    Sentry.extraErrorDataIntegration({ depth: 10 }),
    Sentry.zodErrorsIntegration(),
  ],
  beforeSend: function (event, hint) {
    if (hint.syntheticException?.name === "ChunkLoadError") {
      event.fingerprint = ["ChunkLoadError"];
    }
    return event;
  },
  // Adds request headers and IP for users
  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
