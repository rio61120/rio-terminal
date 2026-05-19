/** Typed environment access — single source of truth for env vars. */
export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? 'RIO Terminal',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
} as const;
