import { defineRouting } from 'next-intl/routing';

// Central locale config — add locales here and in messages/ only.
export const routing = defineRouting({
  locales: ['en', 'vi'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
