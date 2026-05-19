"use client";

import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { AppearanceToggle } from "@/features/terminal/components/appearance-toggle";
import { CustomColorFields } from "@/features/terminal/components/custom-color-fields";
import { TerminalAppearancePreview } from "@/features/terminal/components/terminal-appearance-preview";
import { TerminalAppearanceShell } from "@/features/terminal/components/terminal-appearance-shell";
import {
  ANIMATION_SPEED_OPTIONS,
  FONT_OPTIONS,
  TERMINAL_PRESETS,
  getPresetSwatch,
  resolveTerminalColors,
  type AnimationSpeed,
  type TerminalAppearance,
  type TerminalCursorStyle,
  type TerminalFontId,
  type TerminalPresetId,
} from "@/features/terminal/lib/terminal-themes";
import { useTerminalAppearance } from "@/features/terminal/terminal-appearance-context";
import { cn } from "@/lib/cn";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 320, damping: 28 },
  },
};

const EFFECT_TOGGLES: {
  key: keyof Pick<
    TerminalAppearance,
    | "showGlow"
    | "showScanlines"
    | "showAmbientOrbs"
    | "showGrid"
    | "showVignette"
  >;
  labelKey: "glow" | "scanlines" | "ambientOrbs" | "grid" | "vignette";
}[] = [
  { key: "showGlow", labelKey: "glow" },
  { key: "showScanlines", labelKey: "scanlines" },
  { key: "showAmbientOrbs", labelKey: "ambientOrbs" },
  { key: "showGrid", labelKey: "grid" },
  { key: "showVignette", labelKey: "vignette" },
];

function RangeControl({
  label,
  valueLabel,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  valueLabel: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex justify-between text-xs text-muted-foreground">
        {label}
        <span className="font-mono text-foreground">{valueLabel}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </label>
  );
}

export function TerminalAppearanceSettings() {
  const t = useTranslations("terminal.appearance");
  const { appearance, setAppearance, resetAppearance } =
    useTerminalAppearance();
  const colors = resolveTerminalColors(appearance);

  return (
    <TerminalAppearanceShell className="min-h-dvh">
      <motion.div
        className="mx-auto w-full max-w-2xl flex-1 overflow-y-auto px-6 py-8 sm:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.header
          className="mb-8 flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 backdrop-blur-md"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${appearance.chromeOpacity})`,
          }}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="icon-sm"
              aria-label={t("back")}
            >
              <Link href={ROUTES.terminal}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <motion.div>
              <h1
                className="flex items-center gap-2 text-xl font-semibold tracking-tight"
                style={{ color: colors.foreground }}
              >
                <Sparkles
                  className="h-5 w-5"
                  style={{ color: colors.accent }}
                />
                {t("title")}
              </h1>
              <p
                className="text-sm opacity-70"
                style={{ color: colors.foreground }}
              >
                {t("subtitle")}
              </p>
            </motion.div>
          </motion.div>
          <Button variant="outline" size="sm" onClick={resetAppearance}>
            <RotateCcw className="h-3.5 w-3.5" />
            {t("reset")}
          </Button>
        </motion.header>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          <motion.section variants={item}>
            <TerminalAppearancePreview />
          </motion.section>

          <motion.section variants={item}>
            <h2 className="mb-3 text-sm font-medium text-white/60">
              {t("theme")}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {TERMINAL_PRESETS.map((preset) => {
                const active = appearance.preset === preset.id;
                const swatch = getPresetSwatch(appearance, preset.id);
                return (
                  <motion.button
                    key={preset.id}
                    type="button"
                    onClick={() =>
                      setAppearance({ preset: preset.id as TerminalPresetId })
                    }
                    className={cn(
                      "group relative overflow-hidden rounded-xl border border-white/10 bg-black/20 p-3 text-left backdrop-blur-sm transition-shadow",
                      active &&
                        "ring-2 ring-primary ring-offset-2 ring-offset-transparent",
                    )}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div className="mb-2 flex gap-1" layout>
                      {swatch.map((color) => (
                        <span
                          key={color}
                          className="h-6 flex-1 rounded-md border border-white/10"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </motion.div>
                    <span className="text-sm font-medium text-white/90">
                      {preset.label}
                    </span>
                    {active ? (
                      <motion.span
                        layoutId="preset-active"
                        className="absolute inset-0 rounded-xl border-2 border-primary"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    ) : null}
                  </motion.button>
                );
              })}
            </div>
            {appearance.preset === "custom" ? (
              <motion.div className="mt-4" layout>
                <CustomColorFields
                  colors={appearance.customColors}
                  labels={{
                    background: t("customBackground"),
                    foreground: t("customForeground"),
                    accent: t("customAccent"),
                  }}
                  onChange={(patch) =>
                    setAppearance({
                      customColors: { ...appearance.customColors, ...patch },
                    })
                  }
                />
              </motion.div>
            ) : null}
          </motion.section>

          <motion.section
            variants={item}
            className="rounded-xl border border-white/10 bg-black/20 p-5 backdrop-blur-sm"
          >
            <h2 className="mb-4 text-sm font-medium text-white/60">
              {t("typography")}
            </h2>
            <div className="space-y-5">
              <RangeControl
                label={t("fontSize")}
                valueLabel={`${appearance.fontSize}px`}
                min={11}
                max={20}
                value={appearance.fontSize}
                onChange={(fontSize) => setAppearance({ fontSize })}
              />

              <div>
                <span className="mb-2 block text-xs text-muted-foreground">
                  {t("fontFamily")}
                </span>
                <motion.div className="flex flex-wrap gap-2" layout>
                  {FONT_OPTIONS.map((font) => (
                    <motion.button
                      key={font.id}
                      type="button"
                      onClick={() =>
                        setAppearance({ fontFamily: font.id as TerminalFontId })
                      }
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-xs font-medium",
                        appearance.fontFamily === font.id
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border hover:bg-secondary/50",
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

              <RangeControl
                label={t("lineHeight")}
                valueLabel={String(appearance.lineHeight)}
                min={1}
                max={1.8}
                step={0.05}
                value={appearance.lineHeight}
                onChange={(lineHeight) => setAppearance({ lineHeight })}
              />

              <RangeControl
                label={t("letterSpacing")}
                valueLabel={`${appearance.letterSpacing}px`}
                min={0}
                max={4}
                step={0.5}
                value={appearance.letterSpacing}
                onChange={(letterSpacing) => setAppearance({ letterSpacing })}
              />

              <RangeControl
                label={t("scrollback")}
                valueLabel={String(appearance.scrollback)}
                min={1000}
                max={10000}
                step={500}
                value={appearance.scrollback}
                onChange={(scrollback) => setAppearance({ scrollback })}
              />
            </div>
          </motion.section>

          <motion.section
            variants={item}
            className="rounded-xl border border-white/10 bg-black/20 p-5 backdrop-blur-sm"
          >
            <h2 className="mb-4 text-sm font-medium text-white/60">
              {t("window")}
            </h2>
            <motion.div className="space-y-5" layout>
              <RangeControl
                label={t("borderRadius")}
                valueLabel={`${appearance.borderRadius}px`}
                min={4}
                max={24}
                value={appearance.borderRadius}
                onChange={(borderRadius) => setAppearance({ borderRadius })}
              />
              <RangeControl
                label={t("padding")}
                valueLabel={`${appearance.padding}px`}
                min={0}
                max={24}
                value={appearance.padding}
                onChange={(padding) => setAppearance({ padding })}
              />
              <RangeControl
                label={t("chromeOpacity")}
                valueLabel={`${Math.round(appearance.chromeOpacity * 100)}%`}
                min={0.05}
                max={0.85}
                step={0.05}
                value={appearance.chromeOpacity}
                onChange={(chromeOpacity) => setAppearance({ chromeOpacity })}
              />
            </motion.div>
          </motion.section>

          <motion.section
            variants={item}
            className="rounded-xl border border-white/10 bg-black/20 p-5 backdrop-blur-sm"
          >
            <h2 className="mb-4 text-sm font-medium text-white/60">
              {t("cursor")}
            </h2>
            <motion.div className="flex flex-wrap gap-2" layout>
              {(["block", "bar", "underline"] as TerminalCursorStyle[]).map(
                (style) => (
                  <motion.button
                    key={style}
                    type="button"
                    onClick={() => setAppearance({ cursorStyle: style })}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs capitalize",
                      appearance.cursorStyle === style
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border hover:bg-secondary/50",
                    )}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {style}
                  </motion.button>
                ),
              )}
            </motion.div>
            <motion.div className="mt-4" layout>
              <AppearanceToggle
                label={t("cursorBlink")}
                checked={appearance.cursorBlink}
                onChange={(cursorBlink) => setAppearance({ cursorBlink })}
              />
            </motion.div>
          </motion.section>

          <motion.section
            variants={item}
            className="rounded-xl border border-white/10 bg-black/20 p-5 backdrop-blur-sm"
          >
            <h2 className="mb-4 text-sm font-medium text-white/60">
              {t("effects")}
            </h2>
            <motion.div className="space-y-3" layout>
              {EFFECT_TOGGLES.map(({ key, labelKey }) => (
                <AppearanceToggle
                  key={key}
                  label={t(labelKey)}
                  checked={appearance[key]}
                  onChange={(checked) => setAppearance({ [key]: checked })}
                />
              ))}
              {appearance.showGlow ? (
                <RangeControl
                  label={t("glowIntensity")}
                  valueLabel={`${Math.round(appearance.glowIntensity * 100)}%`}
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={appearance.glowIntensity}
                  onChange={(glowIntensity) => setAppearance({ glowIntensity })}
                />
              ) : null}
              {appearance.showScanlines ? (
                <RangeControl
                  label={t("scanlineOpacity")}
                  valueLabel={`${Math.round(appearance.scanlineOpacity * 100)}%`}
                  min={0.1}
                  max={0.8}
                  step={0.05}
                  value={appearance.scanlineOpacity}
                  onChange={(scanlineOpacity) =>
                    setAppearance({ scanlineOpacity })
                  }
                />
              ) : null}
            </motion.div>
          </motion.section>

          <motion.section
            variants={item}
            className="rounded-xl border border-white/10 bg-black/20 p-5 backdrop-blur-sm"
          >
            <h2 className="mb-4 text-sm font-medium text-white/60">
              {t("animation")}
            </h2>
            <motion.div className="flex flex-wrap gap-2" layout>
              {ANIMATION_SPEED_OPTIONS.map((opt) => (
                <motion.button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setAppearance({ animationSpeed: opt.id as AnimationSpeed })
                  }
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium",
                    appearance.animationSpeed === opt.id
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border hover:bg-secondary/50",
                  )}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {t(opt.labelKey)}
                </motion.button>
              ))}
            </motion.div>
            <p className="mt-3 text-xs text-muted-foreground">
              {t("animationHint")}
            </p>
          </motion.section>

          <motion.div variants={item} className="flex gap-3 pt-2">
            <Button asChild className="flex-1">
              <Link href={ROUTES.terminal}>{t("apply")}</Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </TerminalAppearanceShell>
  );
}
