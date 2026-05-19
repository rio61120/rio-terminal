'use client';

import { AnimatePresence, motion } from 'framer-motion';

type ConnectionStatusProps = {
  status: 'connecting' | 'connected' | 'error';
  label?: string;
};

export function ConnectionStatus({ status, label }: ConnectionStatusProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status + (label ?? '')}
        initial={{ opacity: 0, y: -6, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[10px] font-medium backdrop-blur-md"
      >
        <motion.span
          className="h-1.5 w-1.5 rounded-full"
          animate={{
            backgroundColor:
              status === 'connected'
                ? '#4ade80'
                : status === 'error'
                  ? '#fbbf24'
                  : '#94a3b8',
            scale: status === 'connecting' ? [1, 1.35, 1] : 1,
          }}
          transition={
            status === 'connecting'
              ? { repeat: Infinity, duration: 1.2 }
              : { duration: 0.2 }
          }
        />
        <span className="text-white/80">
          {status === 'connecting' && 'Connecting…'}
          {status === 'connected' && (label ? `● ${label}` : '● live')}
          {status === 'error' && 'offline'}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
