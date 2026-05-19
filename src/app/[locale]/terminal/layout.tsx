import { TerminalAppearanceProvider } from '@/features/terminal/terminal-appearance-context';
import { TerminalWorkspaceProvider } from '@/features/terminal/terminal-workspace-context';
import type { ReactNode } from 'react';

type Props = { children: ReactNode };

export default function TerminalLayout({ children }: Props) {
  return (
    <TerminalAppearanceProvider>
      <TerminalWorkspaceProvider>{children}</TerminalWorkspaceProvider>
    </TerminalAppearanceProvider>
  );
}
