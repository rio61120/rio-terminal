'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getPresetMeta } from '@/features/terminal/lib/terminal-themes';
import { useTerminalAppearance } from '@/features/terminal/terminal-appearance-context';

export type BootPhase = 'bundle' | 'terminal' | 'shell' | 'ready';

type TerminalBootLoaderProps = {
  phase: BootPhase;
  visible: boolean;
};

const PHASE_ORDER: BootPhase[] = ['bundle', 'terminal', 'shell', 'ready'];

export function TerminalBootLoader({ phase, visible }: TerminalBootLoaderProps) {
  const t = useTranslations('terminal.loader');
  const { appearance } = useTerminalAppearance();
  const meta = getPresetMeta(appearance.preset);
  const progress =
    phase === 'ready' ? 100 : Math.round(((PHASE_ORDER.indexOf(phase) + 1) / 4) * 100);

  const labels: Record<BootPhase, string> = {
    bundle: t('bundle'),
    terminal: t('terminal'),
    shell: t('shell'),
    ready: t('ready'),
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{ backgroundColor: meta.swatch[0] }}
        >
          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{
              background: [
                `radial-gradient(circle at 30% 20%, ${meta.accent}30, transparent 50%)`,
                `radial-gradient(circle at 70% 80%, ${meta.accent}25, transparent 55%)`,
                `radial-gradient(circle at 30% 20%, ${meta.accent}30, transparent 50%)`,
              ],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            className="relative z-10 w-full max-w-md px-8"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <motion.div
              className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-xl"
              animate={{
                boxShadow: [
                  `0 0 40px ${meta.accent}30`,
                  `0 0 60px ${meta.accent}50`,
                  `0 0 40px ${meta.accent}30`,
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Terminal className="h-8 w-8" style={{ color: meta.accent }} />
              </motion.div>
            </motion.div>

            <h2 className="text-center text-lg font-semibold tracking-tight text-white/95">
              {t('title')}
            </h2>
            <p className="mt-1 text-center text-sm text-white/50">{labels[phase]}</p>

            <div className="mt-8 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${meta.accent}, ${meta.swatch[2]})` }}
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </div>

            <motion.ul
              className="mt-6 space-y-2 font-mono text-xs text-white/45"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08 } },
              }}
            >
              {PHASE_ORDER.map((p) => {
                const done = PHASE_ORDER.indexOf(p) < PHASE_ORDER.indexOf(phase);
                const active = p === phase;
                return (
                  <motion.li
                    key={p}
                    variants={{
                      hidden: { opacity: 0, x: -8 },
                      show: { opacity: 1, x: 0 },
                    }}
                    className="flex items-center gap-2"
                  >
                    <motion.span
                      className="h-1.5 w-1.5 rounded-full"
                      animate={{
                        backgroundColor: done || active ? meta.accent : 'rgba(255,255,255,0.2)',
                        scale: active ? [1, 1.4, 1] : 1,
                      }}
                      transition={
                        active ? { repeat: Infinity, duration: 1 } : { duration: 0.2 }
                      }
                    />
                    <span className={active ? 'text-white/80' : done ? 'text-white/55' : ''}>
                      {labels[p]}
                    </span>
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
