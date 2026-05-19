'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { TerminalAmbientBackground } from '@/features/terminal/components/terminal-ambient-background';
import { useTerminalMotion } from '@/features/terminal/hooks/use-terminal-motion';
import { resolveTerminalColors } from '@/features/terminal/lib/terminal-themes';
import { useTerminalAppearance } from '@/features/terminal/terminal-appearance-context';
import { cn } from '@/lib/cn';

type TerminalAppearanceShellProps = {
  children: ReactNode;
  className?: string;
};

/** Full-page themed backdrop shared by terminal, header, and settings. */
export function TerminalAppearanceShell({ children, className }: TerminalAppearanceShellProps) {
  const { appearance } = useTerminalAppearance();
  const { enabled, loopTransition } = useTerminalMotion();
  const colors = resolveTerminalColors(appearance);
  const glowPeak = 0.35 + appearance.glowIntensity * 0.45;

  return (
    <motion.div
      className={cn('relative flex min-h-dvh flex-col overflow-hidden', className)}
      style={{ backgroundColor: colors.background }}
      layout
    >
      <TerminalAmbientBackground />

      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={
          enabled
            ? {
                background: [
                  `radial-gradient(ellipse 80% 50% at 20% -10%, ${colors.accent}22, transparent)`,
                  `radial-gradient(ellipse 60% 40% at 80% 110%, ${colors.accent}18, transparent)`,
                  `radial-gradient(ellipse 80% 50% at 20% -10%, ${colors.accent}22, transparent)`,
                ],
              }
            : {
                background: `radial-gradient(ellipse 80% 50% at 20% -10%, ${colors.accent}22, transparent)`,
              }
        }
        transition={loopTransition(12)}
      />

      {appearance.showGlow ? (
        <motion.div
          className="pointer-events-none absolute -inset-px"
          style={{
            background: `linear-gradient(135deg, ${colors.accent}40, transparent 45%, ${colors.accent}25)`,
            opacity: appearance.glowIntensity,
          }}
          animate={enabled ? { opacity: [glowPeak * 0.6, glowPeak, glowPeak * 0.6] } : undefined}
          transition={loopTransition(4)}
        />
      ) : null}

      {appearance.showVignette ? (
        <motion.div
          className="terminal-vignette pointer-events-none absolute inset-0 z-[1]"
          aria-hidden
        />
      ) : null}

      <motion.div className="relative z-10 flex min-h-0 w-full flex-1 flex-col">{children}</motion.div>
    </motion.div>
  );
}

/** Glass header bar matching the terminal chrome panel. */
export function TerminalAppearanceHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { appearance } = useTerminalAppearance();

  return (
    <header
      className={cn(
        'relative z-20 flex shrink-0 items-center border-b border-white/10 backdrop-blur-md',
        className,
      )}
      style={{ backgroundColor: `rgba(0, 0, 0, ${appearance.chromeOpacity})` }}
    >
      {children}
    </header>
  );
}
