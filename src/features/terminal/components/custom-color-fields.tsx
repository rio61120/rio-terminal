'use client';

import { motion } from 'framer-motion';
import type { CustomTerminalColors } from '@/features/terminal/lib/terminal-themes';

type CustomColorFieldsProps = {
  colors: CustomTerminalColors;
  labels: { background: string; foreground: string; accent: string };
  onChange: (patch: Partial<CustomTerminalColors>) => void;
};

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-muted-foreground uppercase">{value}</span>
        <motion.span
          className="relative h-9 w-9 overflow-hidden rounded-lg border border-white/15 shadow-inner"
          style={{ backgroundColor: value }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label={label}
          />
        </motion.span>
      </div>
    </label>
  );
}

export function CustomColorFields({ colors, labels, onChange }: CustomColorFieldsProps) {
  return (
    <motion.div
      className="space-y-2 rounded-xl border border-primary/25 bg-primary/5 p-3"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
    >
      <ColorField
        label={labels.background}
        value={colors.background}
        onChange={(background) => onChange({ background })}
      />
      <ColorField
        label={labels.foreground}
        value={colors.foreground}
        onChange={(foreground) => onChange({ foreground })}
      />
      <ColorField
        label={labels.accent}
        value={colors.accent}
        onChange={(accent) => onChange({ accent })}
      />
    </motion.div>
  );
}
