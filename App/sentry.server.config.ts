// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

// NOTE: copied into instrumentation.ts, per log warnings...

/*
import * as Sentry from "@sentry/nextjs";
import { SENTRY_ENABLED, getSentryDSN } from "./sentry.setup";

Sentry.init({
  dsn: getSentryDSN(),
  enabled: SENTRY_ENABLED,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: process.env.NODE_ENV === 'development',  
});
*/
