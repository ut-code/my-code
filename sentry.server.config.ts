import * as Sentry from "@sentry/nextjs";
Sentry.init({
  enabled: process.env.NODE_ENV !== 'development',
  dsn: "https://db719a3358e14ebc86cc975ea04b0dac@bugsink.utcode.net/1",
  // Adds request headers and IP for users
  sendDefaultPii: true,
});
