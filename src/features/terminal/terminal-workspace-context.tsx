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

const NOTES_STORAGE_KEY = 'rio-terminal-notes';
const TAB_STORAGE_KEY = 'rio-terminal-workspace-tab';

export type WorkspaceTab = 'terminal' | 'notes';

type TerminalWorkspaceContextValue = {
  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;
  notes: string;
  setNotes: (value: string) => void;
  appendNote: (text: string) => void;
  clearNotes: () => void;
};

const TerminalWorkspaceContext = createContext<TerminalWorkspaceContextValue | null>(null);

function loadNotes(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(NOTES_STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

function loadTab(): WorkspaceTab {
  if (typeof window === 'undefined') return 'terminal';
  try {
    const raw = localStorage.getItem(TAB_STORAGE_KEY);
    return raw === 'notes' ? 'notes' : 'terminal';
  } catch {
    return 'terminal';
  }
}

export function TerminalWorkspaceProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTabState] = useState<WorkspaceTab>('terminal');
  const [notes, setNotesState] = useState('');

  useEffect(() => {
    setNotesState(loadNotes());
    setActiveTabState(loadTab());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(NOTES_STORAGE_KEY, notes);
  }, [notes]);

  const setActiveTab = useCallback((tab: WorkspaceTab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      localStorage.setItem(TAB_STORAGE_KEY, tab);
    }
  }, []);

  const setNotes = useCallback((value: string) => {
    setNotesState(value);
  }, []);

  const appendNote = useCallback((text: string) => {
    const chunk = text.trim();
    if (!chunk) return;
    setNotesState((prev) => {
      const prefix = prev.length > 0 && !prev.endsWith('\n') ? '\n' : '';
      return `${prev}${prefix}${chunk}\n`;
    });
  }, []);

  const clearNotes = useCallback(() => {
    setNotesState('');
  }, []);

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      notes,
      setNotes,
      appendNote,
      clearNotes,
    }),
    [activeTab, setActiveTab, notes, setNotes, appendNote, clearNotes],
  );

  return (
    <TerminalWorkspaceContext.Provider value={value}>
      {children}
    </TerminalWorkspaceContext.Provider>
  );
}

export function useTerminalWorkspace() {
  const ctx = useContext(TerminalWorkspaceContext);
  if (!ctx) {
    throw new Error('useTerminalWorkspace must be used within TerminalWorkspaceProvider');
  }
  return ctx;
}
