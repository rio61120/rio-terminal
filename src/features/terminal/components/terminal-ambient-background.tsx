'use client';

import { motion } from 'framer-motion';
import { useTerminalMotion } from '@/features/terminal/hooks/use-terminal-motion';
import { resolveTerminalColors } from '@/features/terminal/lib/terminal-themes';
import { useTerminalAppearance } from '@/features/terminal/terminal-appearance-context';

const ORBS = [
  { x: '12%', y: '18%', size: 280, delay: 0 },
  { x: '78%', y: '22%', size: 220, delay: 1.2 },
  { x: '65%', y: '72%', size: 320, delay: 0.6 },
  { x: '28%', y: '80%', size: 200, delay: 2 },
];

export function TerminalAmbientBackground() {
  const { appearance } = useTerminalAppearance();
  const { enabled, loopTransition } = useTerminalMotion();
  const { accent } = resolveTerminalColors(appearance);

  if (!appearance.showAmbientOrbs && !appearance.showGrid) {
    return null;
  }

  return (
    <motion.div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {appearance.showGrid ? (
        <motion.div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
            linear-gradient(${accent}08 1px, transparent 1px),
            linear-gradient(90deg, ${accent}08 1px, transparent 1px)
          `,
            backgroundSize: '48px 48px',
          }}
          animate={enabled ? { backgroundPosition: ['0px 0px', '48px 48px'] } : undefined}
          transition={enabled ? { ...loopTransition(20), ease: 'linear' } : undefined}
        />
      ) : null}

      {appearance.showAmbientOrbs
        ? ORBS.map((orb, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-3xl"
              style={{
                left: orb.x,
                top: orb.y,
                width: orb.size,
                height: orb.size,
                background: `radial-gradient(circle, ${accent}35 0%, transparent 70%)`,
              }}
              animate={
                enabled
                  ? {
                      x: [0, 24, -16, 0],
                      y: [0, -20, 12, 0],
                      scale: [1, 1.08, 0.95, 1],
                      opacity: [0.35, 0.55, 0.4, 0.35],
                    }
                  : { opacity: 0.4 }
              }
              transition={
                enabled
                  ? {
                      duration: loopTransition(10 + i * 2).duration || 10,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: orb.delay,
                    }
                  : undefined
              }
            />
          ))
        : null}

      {appearance.showAmbientOrbs ? (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 90% 60% at 50% -20%, ${accent}20, transparent)`,
          }}
          animate={enabled ? { opacity: [0.5, 0.85, 0.5] } : { opacity: 0.65 }}
          transition={loopTransition(6)}
        />
      ) : null}
    </motion.div>
  );
}
