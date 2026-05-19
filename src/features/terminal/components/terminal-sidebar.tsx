'use client';

import { motion } from 'framer-motion';
import { StickyNote, Terminal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  type WorkspaceTab,
  useTerminalWorkspace,
} from '@/features/terminal/terminal-workspace-context';
import { resolveTerminalColors } from '@/features/terminal/lib/terminal-themes';
import { useTerminalAppearance } from '@/features/terminal/terminal-appearance-context';
import { cn } from '@/lib/cn';

const TABS: { id: WorkspaceTab; icon: typeof Terminal; labelKey: 'tabTerminal' | 'tabNotes' }[] =
  [
    { id: 'terminal', icon: Terminal, labelKey: 'tabTerminal' },
    { id: 'notes', icon: StickyNote, labelKey: 'tabNotes' },
  ];

export function TerminalSidebar() {
  const t = useTranslations('terminal.workspace');
  const { appearance } = useTerminalAppearance();
  const colors = resolveTerminalColors(appearance);
  const { activeTab, setActiveTab } = useTerminalWorkspace();

  return (
    <motion.aside
      className="flex w-14 shrink-0 flex-col border-r border-white/10 md:w-44"
      style={{ backgroundColor: `rgba(0, 0, 0, ${Math.min(appearance.chromeOpacity + 0.15, 0.85)})` }}
      initial={{ x: -16, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
    >
      <nav className="flex flex-1 flex-col gap-1 p-2" aria-label={t('navLabel')}>
        {TABS.map(({ id, icon: Icon, labelKey }) => {
          const active = activeTab === id;
          return (
            <motion.button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={cn(
                'relative flex items-center gap-2 rounded-lg px-2 py-2.5 text-left text-sm font-medium transition-colors',
                active ? 'text-white' : 'text-white/55 hover:bg-white/5 hover:text-white/80',
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-current={active ? 'page' : undefined}
            >
              {active ? (
                <motion.span
                  layoutId="sidebar-active-tab"
                  className="absolute inset-0 rounded-lg border border-white/10"
                  style={{
                    background: `linear-gradient(135deg, ${colors.accent}33, transparent)`,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              ) : null}
              <Icon
                className="relative z-10 h-4 w-4 shrink-0"
                style={{ color: active ? colors.accent : undefined }}
                aria-hidden
              />
              <span className="relative z-10 hidden md:inline">{t(labelKey)}</span>
            </motion.button>
          );
        })}
      </nav>
    </motion.aside>
  );
}
