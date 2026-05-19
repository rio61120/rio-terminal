import type { FitAddon } from '@xterm/addon-fit';
import type { Terminal } from '@xterm/xterm';

/** FitAddon throws when xterm core dimensions are not ready — always guard fit(). */
export function safeFit(
  fitAddon: FitAddon | null,
  term: Terminal | null,
  container: HTMLElement | null,
): boolean {
  if (!fitAddon || !term || !container) return false;
  if (container.offsetWidth < 2 || container.offsetHeight < 2) return false;

  try {
    fitAddon.fit();
    return term.cols > 0 && term.rows > 0;
  } catch {
    return false;
  }
}
