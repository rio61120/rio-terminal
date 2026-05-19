import type { ITheme } from '@xterm/xterm';

export type TerminalPresetId =
  | 'midnight'
  | 'dracula'
  | 'nord'
  | 'synthwave'
  | 'forest'
  | 'paper'
  | 'custom';

export type CustomTerminalColors = {
  background: string;
  foreground: string;
  accent: string;
};

export type TerminalFontId = 'jetbrains' | 'fira' | 'sf-mono';

export type TerminalCursorStyle = 'block' | 'bar' | 'underline';

export type AnimationSpeed = 'off' | 'slow' | 'normal' | 'fast';

export type TerminalAppearance = {
  preset: TerminalPresetId;
  customColors: CustomTerminalColors;
  fontSize: number;
  fontFamily: TerminalFontId;
  cursorStyle: TerminalCursorStyle;
  cursorBlink: boolean;
  lineHeight: number;
  letterSpacing: number;
  scrollback: number;
  showScanlines: boolean;
  scanlineOpacity: number;
  showGlow: boolean;
  glowIntensity: number;
  showAmbientOrbs: boolean;
  showGrid: boolean;
  showVignette: boolean;
  chromeOpacity: number;
  borderRadius: number;
  padding: number;
  animationSpeed: AnimationSpeed;
};

export const DEFAULT_CUSTOM_COLORS: CustomTerminalColors = {
  background: '#0f0f14',
  foreground: '#e4e4ef',
  accent: '#a78bfa',
};

export const DEFAULT_TERMINAL_APPEARANCE: TerminalAppearance = {
  preset: 'midnight',
  customColors: DEFAULT_CUSTOM_COLORS,
  fontSize: 14,
  fontFamily: 'jetbrains',
  cursorStyle: 'block',
  cursorBlink: true,
  lineHeight: 1.25,
  letterSpacing: 0,
  scrollback: 5000,
  showScanlines: true,
  scanlineOpacity: 0.35,
  showGlow: true,
  glowIntensity: 0.5,
  showAmbientOrbs: true,
  showGrid: true,
  showVignette: false,
  chromeOpacity: 0.2,
  borderRadius: 12,
  padding: 8,
  animationSpeed: 'normal',
};

const ANIMATION_SPEED_MULTIPLIER: Record<AnimationSpeed, number> = {
  off: 0,
  slow: 1.5,
  normal: 1,
  fast: 0.55,
};

export const ANIMATION_SPEED_OPTIONS: { id: AnimationSpeed; labelKey: string }[] = [
  { id: 'off', labelKey: 'speedOff' },
  { id: 'slow', labelKey: 'speedSlow' },
  { id: 'normal', labelKey: 'speedNormal' },
  { id: 'fast', labelKey: 'speedFast' },
];

export function motionEnabled(speed: AnimationSpeed): boolean {
  return speed !== 'off';
}

/** Scale a base animation duration (seconds) by appearance speed preset. */
export function getMotionDuration(speed: AnimationSpeed, baseSeconds: number): number {
  if (speed === 'off') return 0;
  return baseSeconds * ANIMATION_SPEED_MULTIPLIER[speed];
}

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
  custom: {
    label: 'Custom',
    accent: DEFAULT_CUSTOM_COLORS.accent,
    swatch: [
      DEFAULT_CUSTOM_COLORS.background,
      DEFAULT_CUSTOM_COLORS.foreground,
      DEFAULT_CUSTOM_COLORS.accent,
    ],
  },
};

export type ResolvedTerminalColors = {
  label: string;
  background: string;
  foreground: string;
  accent: string;
  swatch: [string, string, string];
};

const XTERM_THEMES: Record<Exclude<TerminalPresetId, 'custom'>, ITheme> = {
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

function buildCustomXtermTheme(colors: CustomTerminalColors): ITheme {
  return {
    background: colors.background,
    foreground: colors.foreground,
    cursor: colors.accent,
    cursorAccent: colors.background,
    selectionBackground: `${colors.accent}55`,
    black: colors.background,
    red: '#f87171',
    green: '#4ade80',
    yellow: '#facc15',
    blue: '#60a5fa',
    magenta: colors.accent,
    cyan: '#22d3ee',
    white: colors.foreground,
  };
}

export function resolveTerminalColors(appearance: TerminalAppearance): ResolvedTerminalColors {
  if (appearance.preset === 'custom') {
    const { background, foreground, accent } = appearance.customColors;
    return {
      label: 'Custom',
      background,
      foreground,
      accent,
      swatch: [background, foreground, accent],
    };
  }

  const meta = PRESET_META[appearance.preset];
  const theme = XTERM_THEMES[appearance.preset];
  return {
    label: meta.label,
    background: theme.background ?? '#0f0f14',
    foreground: theme.foreground ?? '#e4e4ef',
    accent: meta.accent,
    swatch: meta.swatch,
  };
}

export function getXtermTheme(appearance: TerminalAppearance): ITheme {
  if (appearance.preset === 'custom') {
    return buildCustomXtermTheme(appearance.customColors);
  }
  return XTERM_THEMES[appearance.preset];
}

/** @deprecated Use resolveTerminalColors(appearance) */
export function getPresetMeta(preset: TerminalPresetId) {
  return PRESET_META[preset];
}

/** @deprecated Use resolveTerminalColors(appearance) */
export function getChromeBackground(preset: TerminalPresetId): string {
  if (preset === 'custom') return DEFAULT_CUSTOM_COLORS.background;
  return XTERM_THEMES[preset].background ?? '#0f0f14';
}

export function getPresetSwatch(
  appearance: TerminalAppearance,
  presetId: TerminalPresetId,
): [string, string, string] {
  if (presetId === 'custom') {
    const { background, foreground, accent } = appearance.customColors;
    return [background, foreground, accent];
  }
  return PRESET_META[presetId].swatch;
}
