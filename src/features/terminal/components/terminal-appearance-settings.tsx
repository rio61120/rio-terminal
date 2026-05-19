'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import {
  FONT_OPTIONS,
  TERMINAL_PRESETS,
  type TerminalCursorStyle,
  type TerminalFontId,
  type TerminalPresetId,
} from '@/features/terminal/lib/terminal-themes';
import { useTerminalAppearance } from '@/features/terminal/terminal-appearance-context';
import { cn } from '@/lib/cn';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 320, damping: 28 } },
};

export function TerminalAppearanceSettings() {
  const t = useTranslations('terminal.appearance');
  const { appearance, setAppearance, resetAppearance } = useTerminalAppearance();

  return (
    <motion.div
      className="relative min-h-dvh overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary)_0%,_transparent_55%)] opacity-25"
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-8">
        <motion.header
          className="mb-8 flex items-center justify-between"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon-sm" aria-label={t('back')}>
              <Link href={ROUTES.terminal}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                <Sparkles className="h-5 w-5 text-primary" />
                {t('title')}
              </h1>
              <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={resetAppearance}>
            <RotateCcw className="h-3.5 w-3.5" />
            {t('reset')}
          </Button>
        </motion.header>

        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
          <motion.section variants={item}>
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">{t('theme')}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {TERMINAL_PRESETS.map((preset) => {
                const active = appearance.preset === preset.id;
                return (
                  <motion.button
                    key={preset.id}
                    type="button"
                    onClick={() => setAppearance({ preset: preset.id as TerminalPresetId })}
                    className={cn(
                      'glass group relative overflow-hidden rounded-xl p-3 text-left transition-shadow',
                      active && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
                    )}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="mb-2 flex gap-1">
                      {preset.swatch.map((color) => (
                        <span
                          key={color}
                          className="h-6 flex-1 rounded-md border border-white/10"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{preset.label}</span>
                    {active && (
                      <motion.span
                        layoutId="preset-active"
                        className="absolute inset-0 rounded-xl border-2 border-primary"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.section>

          <motion.section variants={item} className="glass rounded-xl p-5">
            <h2 className="mb-4 text-sm font-medium text-muted-foreground">{t('typography')}</h2>
            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 flex justify-between text-xs text-muted-foreground">
                  {t('fontSize')}
                  <span className="font-mono text-foreground">{appearance.fontSize}px</span>
                </span>
                <input
                  type="range"
                  min={11}
                  max={20}
                  value={appearance.fontSize}
                  onChange={(e) => setAppearance({ fontSize: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
              </label>

              <div>
                <span className="mb-2 block text-xs text-muted-foreground">{t('fontFamily')}</span>
                <motion.div className="flex flex-wrap gap-2">
                  {FONT_OPTIONS.map((font) => (
                    <motion.button
                      key={font.id}
                      type="button"
                      onClick={() => setAppearance({ fontFamily: font.id as TerminalFontId })}
                      className={cn(
                        'rounded-lg border px-3 py-1.5 text-xs font-medium',
                        appearance.fontFamily === font.id
                          ? 'border-primary bg-primary/15 text-primary'
                          : 'border-border hover:bg-secondary/50',
                      )}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      style={{ fontFamily: font.stack }}
                    >
                      {font.label}
                    </motion.button>
                  ))}
                </motion.div>
              </div>

              <label className="block">
                <span className="mb-2 flex justify-between text-xs text-muted-foreground">
                  {t('lineHeight')}
                  <span className="font-mono text-foreground">{appearance.lineHeight}</span>
                </span>
                <input
                  type="range"
                  min={1}
                  max={1.8}
                  step={0.05}
                  value={appearance.lineHeight}
                  onChange={(e) => setAppearance({ lineHeight: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
              </label>
            </div>
          </motion.section>

          <motion.section variants={item} className="glass rounded-xl p-5">
            <h2 className="mb-4 text-sm font-medium text-muted-foreground">{t('cursor')}</h2>
            <div className="flex flex-wrap gap-2">
              {(['block', 'bar', 'underline'] as TerminalCursorStyle[]).map((style) => (
                <motion.button
                  key={style}
                  type="button"
                  onClick={() => setAppearance({ cursorStyle: style })}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-xs capitalize',
                    appearance.cursorStyle === style
                      ? 'border-primary bg-primary/15 text-primary'
                      : 'border-border hover:bg-secondary/50',
                  )}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {style}
                </motion.button>
              ))}
            </div>
            <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={appearance.cursorBlink}
                onChange={(e) => setAppearance({ cursorBlink: e.target.checked })}
                className="accent-primary"
              />
              {t('cursorBlink')}
            </label>
          </motion.section>

          <motion.section variants={item} className="glass rounded-xl p-5">
            <h2 className="mb-4 text-sm font-medium text-muted-foreground">{t('effects')}</h2>
            <motion.div className="space-y-3">
              {(
                [
                  ['showGlow', t('glow')],
                  ['showScanlines', t('scanlines')],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-border/60 px-3 py-2.5 hover:bg-secondary/30"
                >
                  <span className="text-sm">{label}</span>
                  <input
                    type="checkbox"
                    checked={appearance[key]}
                    onChange={(e) => setAppearance({ [key]: e.target.checked })}
                    className="accent-primary"
                  />
                </label>
              ))}
            </motion.div>
          </motion.section>

          <motion.div variants={item} className="flex gap-3 pt-2">
            <Button asChild className="flex-1">
              <Link href={ROUTES.terminal}>{t('apply')}</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
