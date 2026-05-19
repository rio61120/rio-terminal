'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { useTerminalAppearance } from '@/features/terminal/terminal-appearance-context';
import { cn } from '@/lib/cn';

type TerminalChromeProps = {
  children: ReactNode;
  header?: ReactNode;
  className?: string;
  /** Preview in settings: no outer margin, fills parent height. */
  variant?: 'default' | 'preview';
};

/** Inner terminal window frame (backdrop comes from TerminalAppearanceShell). */
export function TerminalChrome({
  children,
  header,
  className,
  variant = 'default',
}: TerminalChromeProps) {
  const { appearance } = useTerminalAppearance();
  const isPreview = variant === 'preview';

  return (
    <motion.div
      className={cn('relative flex min-h-0 flex-1 flex-col', className)}
      initial={isPreview ? undefined : { opacity: 0, y: 12 }}
      animate={isPreview ? undefined : { opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.05 }}
      layout={!isPreview}
    >
      <motion.div
        className={cn(
          'relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden border border-white/10 shadow-2xl backdrop-blur-sm',
          isPreview ? 'm-0 h-full' : 'm-3',
        )}
        style={{
          borderRadius: appearance.borderRadius,
          backgroundColor: `rgba(0, 0, 0, ${appearance.chromeOpacity})`,
        }}
        layout
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

        <motion.div className="relative min-h-0 flex-1" layout>
          {appearance.showScanlines ? (
            <motion.div
              className="terminal-scanlines pointer-events-none"
              aria-hidden
              style={{ opacity: appearance.scanlineOpacity }}
              initial={{ opacity: 0 }}
              animate={{ opacity: appearance.scanlineOpacity }}
            />
          ) : null}
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
