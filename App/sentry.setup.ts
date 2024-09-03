// Ensure Sentry is is configured properly

console.log('[SENTRY] (sentry.client.config.js) NODE_ENV: ', process.env.NODE_ENV);
export const SENTRY_ENABLED = process.env.NODE_ENV === 'production';
console.log('[SENTRY] Enabled: ', SENTRY_ENABLED);

if (SENTRY_ENABLED && !process.env.NEXT_PUBLIC_SENTRY_AUTH_TOKEN) {
  console.error('[SENTRY]: Env Var `NEXT_PUBLIC_SENTRY_AUTH_TOKEN` is not set!');
  throw Error("Oops, NEXT_PUBLIC_SENTRY_AUTH_TOKEN environment variable is not set.");
}

if (SENTRY_ENABLED && !process.env.NEXT_PUBLIC_SENTRY_DSN) {
  console.error('[SENTRY]: Env Var `NEXT_PUBLIC_SENTRY_DSN` is not set!');
  throw Error("Oops, NEXT_PUBLIC_SENTRY_DSN environment variable is not set.");
}

export function getSentryDSN() {
  return process.env.NEXT_PUBLIC_SENTRY_DSN || "";
}
