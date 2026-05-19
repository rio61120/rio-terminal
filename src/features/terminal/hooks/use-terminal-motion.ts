'use client';

import { useReducedMotion } from 'framer-motion';
import {
  getMotionDuration,
  motionEnabled,
} from '@/features/terminal/lib/terminal-themes';
import { useTerminalAppearance } from '@/features/terminal/terminal-appearance-context';

export function useTerminalMotion() {
  const reduceMotion = useReducedMotion();
  const { appearance } = useTerminalAppearance();
  const enabled = motionEnabled(appearance.animationSpeed) && !reduceMotion;

  const duration = (baseSeconds: number) =>
    enabled ? getMotionDuration(appearance.animationSpeed, baseSeconds) : 0;

  const loopTransition = (baseSeconds: number) =>
    enabled
      ? {
          duration: getMotionDuration(appearance.animationSpeed, baseSeconds),
          repeat: Infinity,
          ease: 'easeInOut' as const,
        }
      : { duration: 0, repeat: 0 };

  return { enabled, duration, loopTransition, speed: appearance.animationSpeed };
}
