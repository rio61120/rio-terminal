'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

type AppearanceToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
};

export function AppearanceToggle({ checked, onChange, label, description }: AppearanceToggleProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5 hover:bg-secondary/30">
      <motion.div className="min-w-0 flex-1" layout>
        <span className="block text-sm">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
        ) : null}
      </motion.div>
      <motion.button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-full transition-colors',
          checked ? 'bg-primary' : 'bg-muted',
        )}
        whileTap={{ scale: 0.95 }}
      >
        <motion.span
          className="absolute top-0.5 left-0.5 block h-6 w-6 rounded-full bg-white shadow-sm"
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          animate={{ x: checked ? 20 : 0 }}
        />
      </motion.button>
    </div>
  );
}
