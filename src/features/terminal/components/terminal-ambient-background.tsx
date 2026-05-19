'use client';

import { motion } from 'framer-motion';
import { getPresetMeta } from '@/features/terminal/lib/terminal-themes';
import { useTerminalAppearance } from '@/features/terminal/terminal-appearance-context';

const ORBS = [
  { x: '12%', y: '18%', size: 280, delay: 0 },
  { x: '78%', y: '22%', size: 220, delay: 1.2 },
  { x: '65%', y: '72%', size: 320, delay: 0.6 },
  { x: '28%', y: '80%', size: 200, delay: 2 },
];

export function TerminalAmbientBackground() {
  const { appearance } = useTerminalAppearance();
  const meta = getPresetMeta(appearance.preset);

  return (
    <motion.div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(${meta.accent}08 1px, transparent 1px),
            linear-gradient(90deg, ${meta.accent}08 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
        animate={{ backgroundPosition: ['0px 0px', '48px 48px'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${meta.accent}35 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 24, -16, 0],
            y: [0, -20, 12, 0],
            scale: [1, 1.08, 0.95, 1],
            opacity: [0.35, 0.55, 0.4, 0.35],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 90% 60% at 50% -20%, ${meta.accent}20, transparent)`,
        }}
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}
