import { setRequestLocale } from 'next-intl/server';
import { TerminalScreen } from '@/features/terminal/terminal-screen';
import { createPageMetadata } from '@/lib/seo/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return createPageMetadata({
    locale,
    path: '/terminal',
    title: 'Terminal',
    description:
      'Open RIO Terminal online — sync local terminal with a real PTY shell in your browser.',
  });
}

export default async function TerminalPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TerminalScreen />;
}
