'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ClipboardPaste, Eraser, Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { TerminalChrome } from '@/features/terminal/components/terminal-chrome';
import { resolveTerminalColors } from '@/features/terminal/lib/terminal-themes';
import { useTerminalAppearance } from '@/features/terminal/terminal-appearance-context';
import { useTerminalWorkspace } from '@/features/terminal/terminal-workspace-context';

const panelVariants = {
  hidden: { opacity: 0, x: 24, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring' as const, stiffness: 280, damping: 28, staggerChildren: 0.06 },
  },
  exit: { opacity: 0, x: -16, filter: 'blur(4px)', transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 320, damping: 28 } },
};

export function TerminalNotesPanel() {
  const t = useTranslations('terminal.workspace');
  const { appearance } = useTerminalAppearance();
  const colors = resolveTerminalColors(appearance);
  const { notes, setNotes, appendNote, clearNotes } = useTerminalWorkspace();
  const [savedFlash, setSavedFlash] = useState(false);

  const flashSaved = useCallback(() => {
    setSavedFlash(true);
  }, []);

  useEffect(() => {
    if (!savedFlash) return;
    const id = window.setTimeout(() => setSavedFlash(false), 1200);
    return () => clearTimeout(id);
  }, [savedFlash]);

  useEffect(() => {
    const id = window.setTimeout(() => setSavedFlash(true), 400);
    return () => clearTimeout(id);
  }, [notes]);

  const handleAppendTimestamp = () => {
    const stamp = new Date().toLocaleString();
    appendNote(`--- ${stamp} ---`);
    flashSaved();
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        appendNote(text);
        flashSaved();
      }
    } catch {
      /* clipboard denied */
    }
  };

  return (
    <motion.div
      className="flex h-full min-h-0 flex-1 flex-col"
      variants={panelVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      <TerminalChrome className="min-h-0 flex-1">
        <div className="flex h-full min-h-0 flex-col p-3 md:p-4">
          <motion.div
            variants={itemVariants}
            className="mb-3 flex flex-wrap items-center justify-between gap-2"
          >
            <motion.div layout>
              <h2 className="text-sm font-semibold" style={{ color: colors.foreground }}>
                {t('notesTitle')}
              </h2>
              <p className="text-xs text-white/50">{t('notesSubtitle')}</p>
            </motion.div>
            <AnimatePresence mode="wait">
              {savedFlash ? (
                <motion.span
                  key="saved"
                  className="rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: `${colors.accent}33`, color: colors.accent }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  {t('saved')}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-3 flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleAppendTimestamp}>
              <Plus className="h-3.5 w-3.5" />
              {t('addTimestamp')}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handlePasteFromClipboard}>
              <ClipboardPaste className="h-3.5 w-3.5" />
              {t('pasteFromClipboard')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                if (notes.length === 0 || window.confirm(t('clearConfirm'))) {
                  clearNotes();
                }
              }}
            >
              <Eraser className="h-3.5 w-3.5" />
              {t('clear')}
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="relative min-h-0 flex-1">
            <motion.div
              className="h-full min-h-[200px] rounded-lg border border-white/10 bg-black/30 backdrop-blur-sm focus-within:border-white/20 focus-within:ring-2 focus-within:ring-white/10"
              animate={{
                boxShadow: [
                  `0 0 0 0 ${colors.accent}00`,
                  `0 0 24px 0 ${colors.accent}12`,
                  `0 0 0 0 ${colors.accent}00`,
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('placeholder')}
                className="h-full min-h-[200px] w-full resize-none bg-transparent px-3 py-3 font-mono text-sm leading-relaxed outline-none"
                style={{ color: colors.foreground }}
              />
            </motion.div>
            <motion.div
              className="pointer-events-none absolute bottom-3 right-3 rounded-md px-2 py-1 text-[10px] text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {t('charCount', { count: notes.length })}
            </motion.div>
          </motion.div>
        </div>
      </TerminalChrome>
    </motion.div>
  );
}
