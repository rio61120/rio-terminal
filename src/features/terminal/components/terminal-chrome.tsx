'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { TerminalAmbientBackground } from '@/features/terminal/components/terminal-ambient-background';
import { getChromeBackground, getPresetMeta } from '@/features/terminal/lib/terminal-themes';
import { useTerminalAppearance } from '@/features/terminal/terminal-appearance-context';
import { cn } from '@/lib/cn';

type TerminalChromeProps = {
  children: ReactNode;
  header?: ReactNode;
  className?: string;
};

export function TerminalChrome({ children, header, className }: TerminalChromeProps) {
  const { appearance } = useTerminalAppearance();
  const meta = getPresetMeta(appearance.preset);
  const bg = getChromeBackground(appearance.preset);

  return (
    <div
      className={cn('relative flex min-h-0 flex-1 flex-col overflow-hidden', className)}
      style={{ backgroundColor: bg }}
    >
      <TerminalAmbientBackground />

      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          background: [
            `radial-gradient(ellipse 80% 50% at 20% -10%, ${meta.accent}22, transparent)`,
            `radial-gradient(ellipse 60% 40% at 80% 110%, ${meta.accent}18, transparent)`,
            `radial-gradient(ellipse 80% 50% at 20% -10%, ${meta.accent}22, transparent)`,
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {appearance.showGlow && (
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-60"
          style={{
            background: `linear-gradient(135deg, ${meta.accent}40, transparent 45%, ${meta.accent}25)`,
          }}
          animate={{ opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.05 }}
        className="relative z-10 m-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-black/20 shadow-2xl backdrop-blur-sm"
      >
        <motion.div
          className="flex shrink-0 items-center gap-2 border-b border-white/5 px-3 py-2.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <motion.div className="flex gap-1.5" aria-hidden>
            {['#ff5f57', '#febc2e', '#28c840'].map((color, i) => (
              <motion.span
                key={color}
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: color }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + i * 0.05, type: 'spring', stiffness: 500 }}
              />
            ))}
          </motion.div>
          {header ? (
            <motion.div className="ml-2 flex flex-1 items-center justify-between">
              {header}
            </motion.div>
          ) : null}
        </motion.div>

        <div className="relative min-h-0 flex-1">
          {appearance.showScanlines ? (
            <motion.div className="terminal-scanlines pointer-events-none" aria-hidden />
          ) : null}
          {children}
        </div>
      </motion.div>
    </div>
  );
}
