import * as Sentry from "@sentry/nextjs";
Sentry.init({
  enabled: process.env.NODE_ENV !== 'development',
  dsn: process.env.SENTRY_DSN,
  integrations: [Sentry.extraErrorDataIntegration({ depth: 10 })],
  // Adds request headers and IP for users
  sendDefaultPii: true,
});
