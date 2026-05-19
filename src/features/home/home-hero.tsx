'use client';

import { Home, Terminal, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/common/language-switcher';
import { ThemeToggle } from '@/components/common/theme-toggle';

const features = [
  { icon: Terminal, key: 'shell' as const },
  { icon: Zap, key: 'fast' as const },
  { icon: Home, key: 'simple' as const },
];

export function HomeHero() {
  const t = useTranslations('home');

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary)_0%,_transparent_50%)] opacity-20"
        aria-hidden
      />
      <header className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
        <span className="text-lg font-bold tracking-tight">RIO Terminal</span>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-8 lg:px-12 lg:pt-16">
        <p className="animate-fade-in inline-flex rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground">
          {t('badge')}
        </p>

        <h1 className="animate-slide-up mt-6 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          {t('title')}{' '}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('titleHighlight')}
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{t('subtitle')}</p>

        <div className="mt-10">
          <Button asChild size="lg">
            <Link href={ROUTES.terminal}>{t('cta')}</Link>
          </Button>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-3">
          {features.map(({ icon: Icon, key }) => (
            <article
              key={key}
              className="glass rounded-2xl p-6 transition-transform hover:-translate-y-1"
            >
              <Icon className="h-8 w-8 text-primary" aria-hidden />
              <h2 className="mt-4 font-semibold">{t(`features.${key}.title`)}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(`features.${key}.description`)}
              </p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
