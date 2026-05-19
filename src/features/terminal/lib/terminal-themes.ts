import type { ITheme } from '@xterm/xterm';

export type TerminalPresetId =
  | 'midnight'
  | 'dracula'
  | 'nord'
  | 'synthwave'
  | 'forest'
  | 'paper';

export type TerminalFontId = 'jetbrains' | 'fira' | 'sf-mono';

export type TerminalCursorStyle = 'block' | 'bar' | 'underline';

export type TerminalAppearance = {
  preset: TerminalPresetId;
  fontSize: number;
  fontFamily: TerminalFontId;
  cursorStyle: TerminalCursorStyle;
  cursorBlink: boolean;
  lineHeight: number;
  showScanlines: boolean;
  showGlow: boolean;
};

export const DEFAULT_TERMINAL_APPEARANCE: TerminalAppearance = {
  preset: 'midnight',
  fontSize: 14,
  fontFamily: 'jetbrains',
  cursorStyle: 'block',
  cursorBlink: true,
  lineHeight: 1.25,
  showScanlines: true,
  showGlow: true,
};

const PRESET_META: Record<
  TerminalPresetId,
  { label: string; accent: string; swatch: [string, string, string] }
> = {
  midnight: {
    label: 'Midnight',
    accent: '#a78bfa',
    swatch: ['#0f0f14', '#1a1a24', '#a78bfa'],
  },
  dracula: {
    label: 'Dracula',
    accent: '#ff79c6',
    swatch: ['#282a36', '#44475a', '#bd93f9'],
  },
  nord: {
    label: 'Nord',
    accent: '#88c0d0',
    swatch: ['#2e3440', '#3b4252', '#81a1c1'],
  },
  synthwave: {
    label: 'Synthwave',
    accent: '#ff7edb',
    swatch: ['#241b2f', '#34294f', '#f97e72'],
  },
  forest: {
    label: 'Forest',
    accent: '#7ee787',
    swatch: ['#0d1117', '#161b22', '#3fb950'],
  },
  paper: {
    label: 'Paper',
    accent: '#7c3aed',
    swatch: ['#fafafa', '#f4f4f5', '#7c3aed'],
  },
};

const XTERM_THEMES: Record<TerminalPresetId, ITheme> = {
  midnight: {
    background: '#0f0f14',
    foreground: '#e4e4ef',
    cursor: '#a78bfa',
    cursorAccent: '#0f0f14',
    selectionBackground: '#5b21b680',
    black: '#18181b',
    red: '#f87171',
    green: '#4ade80',
    yellow: '#facc15',
    blue: '#60a5fa',
    magenta: '#c084fc',
    cyan: '#22d3ee',
    white: '#e4e4ef',
  },
  dracula: {
    background: '#282a36',
    foreground: '#f8f8f2',
    cursor: '#ff79c6',
    cursorAccent: '#282a36',
    selectionBackground: '#44475a',
    black: '#21222c',
    red: '#ff5555',
    green: '#50fa7b',
    yellow: '#f1fa8c',
    blue: '#bd93f9',
    magenta: '#ff79c6',
    cyan: '#8be9fd',
    white: '#f8f8f2',
  },
  nord: {
    background: '#2e3440',
    foreground: '#eceff4',
    cursor: '#88c0d0',
    cursorAccent: '#2e3440',
    selectionBackground: '#434c5e',
    black: '#3b4252',
    red: '#bf616a',
    green: '#a3be8c',
    yellow: '#ebcb8b',
    blue: '#81a1c1',
    magenta: '#b48ead',
    cyan: '#88c0d0',
    white: '#eceff4',
  },
  synthwave: {
    background: '#241b2f',
    foreground: '#f0e6ff',
    cursor: '#ff7edb',
    cursorAccent: '#241b2f',
    selectionBackground: '#49386b',
    black: '#1a1225',
    red: '#fe4450',
    green: '#72f1b8',
    yellow: '#fede5d',
    blue: '#36f9f6',
    magenta: '#ff7edb',
    cyan: '#f97e72',
    white: '#f0e6ff',
  },
  forest: {
    background: '#0d1117',
    foreground: '#c9d1d9',
    cursor: '#7ee787',
    cursorAccent: '#0d1117',
    selectionBackground: '#23863655',
    black: '#0d1117',
    red: '#ff7b72',
    green: '#3fb950',
    yellow: '#d29922',
    blue: '#58a6ff',
    magenta: '#bc8cff',
    cyan: '#39c5cf',
    white: '#c9d1d9',
  },
  paper: {
    background: '#fafafa',
    foreground: '#18181b',
    cursor: '#7c3aed',
    cursorAccent: '#fafafa',
    selectionBackground: '#7c3aed33',
    black: '#18181b',
    red: '#dc2626',
    green: '#16a34a',
    yellow: '#ca8a04',
    blue: '#2563eb',
    magenta: '#9333ea',
    cyan: '#0891b2',
    white: '#fafafa',
  },
};

export const TERMINAL_PRESETS = (
  Object.keys(PRESET_META) as TerminalPresetId[]
).map((id) => ({ id, ...PRESET_META[id] }));

export const FONT_OPTIONS: { id: TerminalFontId; label: string; stack: string }[] = [
  { id: 'jetbrains', label: 'JetBrains Mono', stack: 'var(--font-mono), monospace' },
  { id: 'fira', label: 'Fira Code', stack: '"Fira Code", var(--font-mono), monospace' },
  { id: 'sf-mono', label: 'SF Mono', stack: '"SF Mono", Menlo, Monaco, monospace' },
];

export function getXtermTheme(preset: TerminalPresetId): ITheme {
  return XTERM_THEMES[preset];
}

export function getPresetMeta(preset: TerminalPresetId) {
  return PRESET_META[preset];
}

export function getChromeBackground(preset: TerminalPresetId): string {
  return XTERM_THEMES[preset].background ?? '#0f0f14';
}
