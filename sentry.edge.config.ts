import * as Sentry from "@sentry/nextjs";
Sentry.init({
  enabled: process.env.NODE_ENV !== 'development',
  dsn: process.env.SENTRY_DSN,
  // Adds request headers and IP for users
  sendDefaultPii: true,
});
