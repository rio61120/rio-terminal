import { setRequestLocale } from 'next-intl/server';
import { TerminalAppearanceSettings } from '@/features/terminal/components/terminal-appearance-settings';
import { createPageMetadata } from '@/lib/seo/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return createPageMetadata({
    locale,
    path: '/terminal/settings',
    title: 'Terminal appearance',
    description:
      'Customize RIO Terminal appearance — themes, fonts, and effects for your terminal online.',
  });
}

export default async function TerminalSettingsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TerminalAppearanceSettings />;
}
