'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { TerminalChrome } from '@/features/terminal/components/terminal-chrome';
import { getXtermTheme, resolveTerminalColors } from '@/features/terminal/lib/terminal-themes';
import { useTerminalAppearance } from '@/features/terminal/terminal-appearance-context';

const SAMPLE_LINES = [
  { color: 'foreground', text: '$ rio-terminal --sync' },
  { color: 'green', text: '✓ Connected to local shell' },
  { color: 'cyan', text: '→ Theme preview updates live' },
  { color: 'magenta', text: '█' },
];

/** Matches pre-shell preview height; parent settings page supplies the themed backdrop. */
const PREVIEW_HEIGHT = 'h-48 min-h-[12rem]';

export function TerminalAppearancePreview() {
  const t = useTranslations('terminal.appearance');
  const { appearance } = useTerminalAppearance();
  const theme = getXtermTheme(appearance);
  const colors = resolveTerminalColors(appearance);

  const colorMap: Record<string, string | undefined> = {
    foreground: theme.foreground,
    green: theme.green,
    cyan: theme.cyan,
    magenta: theme.magenta,
  };

  return (
    <motion.div
      className="overflow-hidden rounded-xl border border-white/10"
      layout
    >
      <p
        className="border-b border-white/10 px-3 py-2 text-xs backdrop-blur-sm"
        style={{
          color: colors.foreground,
          backgroundColor: `rgba(0, 0, 0, ${appearance.chromeOpacity})`,
        }}
      >
        {t('preview')}
      </p>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${appearance.preset}-${colors.accent}-${colors.background}`}
          className={PREVIEW_HEIGHT}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <TerminalChrome variant="preview" className={`${PREVIEW_HEIGHT} w-full`}>
            <motion.div
              className="flex h-full min-h-0 flex-col justify-center gap-1 p-4 font-mono text-sm leading-relaxed"
              style={{
                color: theme.foreground,
                fontSize: appearance.fontSize,
                lineHeight: appearance.lineHeight,
                letterSpacing: appearance.letterSpacing,
              }}
            >
              {SAMPLE_LINES.map((line, i) => (
                <motion.span
                  key={line.text}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i, type: 'spring', stiffness: 300, damping: 28 }}
                  style={{ color: colorMap[line.color] }}
                >
                  {line.text}
                  {line.color === 'magenta' ? (
                    <motion.span
                      className="ml-0.5 inline-block"
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{ color: colors.accent }}
                    />
                  ) : null}
                </motion.span>
              ))}
            </motion.div>
          </TerminalChrome>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
