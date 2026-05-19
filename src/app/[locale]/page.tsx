import { setRequestLocale } from 'next-intl/server';
import { HomeHero } from '@/features/home/home-hero';
import { createPageMetadata } from '@/lib/seo/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return createPageMetadata({
    locale,
    path: '',
    title: 'RIO Terminal',
    description:
      'Terminal online that syncs with your local shell. RIO Terminal — run zsh, npm, and git in the browser.',
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomeHero />;
}
