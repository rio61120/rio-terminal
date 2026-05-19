'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_TERMINAL_APPEARANCE,
  type TerminalAppearance,
} from '@/features/terminal/lib/terminal-themes';

const STORAGE_KEY = 'codeforge-terminal-appearance';

type TerminalAppearanceContextValue = {
  appearance: TerminalAppearance;
  setAppearance: (patch: Partial<TerminalAppearance>) => void;
  resetAppearance: () => void;
};

const TerminalAppearanceContext = createContext<TerminalAppearanceContextValue | null>(
  null,
);

function loadAppearance(): TerminalAppearance {
  if (typeof window === 'undefined') return DEFAULT_TERMINAL_APPEARANCE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_TERMINAL_APPEARANCE;
    const parsed = JSON.parse(raw) as Partial<TerminalAppearance>;
    return {
      ...DEFAULT_TERMINAL_APPEARANCE,
      ...parsed,
      customColors: {
        ...DEFAULT_TERMINAL_APPEARANCE.customColors,
        ...parsed.customColors,
      },
    };
  } catch {
    return DEFAULT_TERMINAL_APPEARANCE;
  }
}

export function TerminalAppearanceProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearanceState] = useState<TerminalAppearance>(loadAppearance);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appearance));
  }, [appearance]);

  const setAppearance = useCallback((patch: Partial<TerminalAppearance>) => {
    setAppearanceState((prev) => ({
      ...prev,
      ...patch,
      ...(patch.customColors
        ? { customColors: { ...prev.customColors, ...patch.customColors } }
        : {}),
    }));
  }, []);

  const resetAppearance = useCallback(() => {
    setAppearanceState(DEFAULT_TERMINAL_APPEARANCE);
  }, []);

  const value = useMemo(
    () => ({ appearance, setAppearance, resetAppearance }),
    [appearance, setAppearance, resetAppearance],
  );

  return (
    <TerminalAppearanceContext.Provider value={value}>
      {children}
    </TerminalAppearanceContext.Provider>
  );
}

export function useTerminalAppearance() {
  const ctx = useContext(TerminalAppearanceContext);
  if (!ctx) {
    throw new Error('useTerminalAppearance must be used within TerminalAppearanceProvider');
  }
  return ctx;
}
