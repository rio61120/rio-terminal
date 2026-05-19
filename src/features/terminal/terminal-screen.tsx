'use client';

import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Palette, Terminal } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ROUTES } from '@/constants/routes';
import { LanguageSwitcher } from '@/components/common/language-switcher';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  TerminalBootLoader,
  type BootPhase,
} from '@/features/terminal/components/terminal-boot-loader';
import { TerminalChrome } from '@/features/terminal/components/terminal-chrome';

const XtermTerminal = dynamic(
  () => import('@/features/terminal/xterm-terminal').then((m) => m.XtermTerminal),
  { ssr: false },
);

export function TerminalScreen() {
  const t = useTranslations('terminal');
  const [bootPhase, setBootPhase] = useState<BootPhase>('bundle');
  const [showLoader, setShowLoader] = useState(true);
  const [terminalMounted, setTerminalMounted] = useState(false);

  useEffect(() => {
    setTerminalMounted(true);
    setBootPhase('bundle');
  }, []);

  const handleReady = useCallback(() => {
    setBootPhase('ready');
    window.setTimeout(() => setShowLoader(false), 400);
  }, []);

  return (
    <motion.div
      className="flex h-dvh flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.header
        className="flex shrink-0 items-center justify-between border-b border-border bg-panel/80 px-3 py-2 backdrop-blur-md"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon-sm" aria-label={t('backHome')}>
            <Link href={ROUTES.home}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Terminal className="h-4 w-4 text-primary" aria-hidden />
          <span className="text-sm font-medium">{t('title')}</span>
        </div>
        <motion.div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="icon-sm" aria-label={t('settings')}>
            <Link href={ROUTES.terminalSettings}>
              <Palette className="h-4 w-4" />
            </Link>
          </Button>
          <LanguageSwitcher />
          <ThemeToggle />
        </motion.div>
      </motion.header>

      <TerminalChrome className="relative flex-1">
        <TerminalBootLoader phase={bootPhase} visible={showLoader} />

        <AnimatePresence>
          {terminalMounted && (
            <motion.div
              className="relative h-full min-h-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: showLoader ? 0 : 1 }}
              transition={{ duration: 0.5, delay: showLoader ? 0 : 0.1 }}
            >
              <XtermTerminal
                className="relative h-full min-h-0"
                onPhaseChange={setBootPhase}
                onReady={handleReady}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </TerminalChrome>
    </motion.div>
  );
}
