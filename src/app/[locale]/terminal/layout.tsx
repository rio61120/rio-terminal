import { TerminalAppearanceProvider } from '@/features/terminal/terminal-appearance-context';
import type { ReactNode } from 'react';

type Props = { children: ReactNode };

export default function TerminalLayout({ children }: Props) {
  return <TerminalAppearanceProvider>{children}</TerminalAppearanceProvider>;
}
