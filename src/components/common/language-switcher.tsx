'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const nextLocale = routing.locales.find((l) => l !== locale) ?? 'en';

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={`Switch language to ${nextLocale}`}
      onClick={() => router.replace(pathname, { locale: nextLocale })}
    >
      {locale.toUpperCase()}
    </Button>
  );
}
