'use client';

import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ClipboardPlus, Palette, Terminal } from 'lucide-react';
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
import { TerminalNotesPanel } from '@/features/terminal/components/terminal-notes-panel';
import { TerminalSidebar } from '@/features/terminal/components/terminal-sidebar';
import {
  TerminalAppearanceHeader,
  TerminalAppearanceShell,
} from '@/features/terminal/components/terminal-appearance-shell';
import { resolveTerminalColors } from '@/features/terminal/lib/terminal-themes';
import { useTerminalAppearance } from '@/features/terminal/terminal-appearance-context';
import { useTerminalWorkspace } from '@/features/terminal/terminal-workspace-context';

const XtermTerminal = dynamic(
  () => import('@/features/terminal/xterm-terminal').then((m) => m.XtermTerminal),
  { ssr: false },
);

export function TerminalScreen() {
  const t = useTranslations('terminal');
  const tw = useTranslations('terminal.workspace');
  const { appearance } = useTerminalAppearance();
  const colors = resolveTerminalColors(appearance);
  const { activeTab, appendNote, setActiveTab } = useTerminalWorkspace();
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

  const handleAddFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        appendNote(text);
        setActiveTab('notes');
      }
    } catch {
      setActiveTab('notes');
    }
  };

  return (
    <TerminalAppearanceShell className="h-dvh">
      <motion.div
        className="flex h-full min-h-0 flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <TerminalAppearanceHeader className="justify-between px-3 py-2">
          <motion.div
            className="flex w-full items-center justify-between"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <motion.div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="icon-sm" aria-label={t('backHome')}>
                <Link href={ROUTES.home}>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <Terminal className="h-4 w-4" style={{ color: colors.accent }} aria-hidden />
              <span className="text-sm font-medium" style={{ color: colors.foreground }}>
                {t('title')}
              </span>
            </motion.div>
            <motion.div className="flex items-center gap-1">
              {activeTab === 'terminal' ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="hidden gap-1.5 sm:flex"
                  onClick={handleAddFromClipboard}
                  title={tw('addFromClipboard')}
                >
                  <ClipboardPlus className="h-4 w-4" />
                  <span className="text-xs">{tw('addToNotes')}</span>
                </Button>
              ) : null}
              <Button asChild variant="ghost" size="icon-sm" aria-label={t('settings')}>
                <Link href={ROUTES.terminalSettings}>
                  <Palette className="h-4 w-4" />
                </Link>
              </Button>
              <LanguageSwitcher />
              <ThemeToggle />
            </motion.div>
          </motion.div>
        </TerminalAppearanceHeader>

        <div className="flex min-h-0 flex-1">
          <TerminalSidebar />

          <main className="relative flex min-h-0 min-w-0 flex-1 flex-col">
            <AnimatePresence mode="wait">
              {activeTab === 'terminal' ? (
                <motion.div
                  key="terminal"
                  className="flex h-full min-h-0 flex-1 flex-col"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <TerminalChrome className="relative min-h-0 flex-1">
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
              ) : (
                <TerminalNotesPanel key="notes" />
              )}
            </AnimatePresence>
          </main>
        </div>
      </motion.div>
    </TerminalAppearanceShell>
  );
}
