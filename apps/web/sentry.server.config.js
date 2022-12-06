// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { init } from '@sentry/nextjs'

const SENTRY_DSN = "https://27d6a01886ed410e9a4f38ebafd9edd3@o928152.ingest.sentry.io/4504161073758208"

init({
  dsn: SENTRY_DSN,
  environment: 'development',
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
})
