import type { Metadata } from 'next';
import { appConfig } from '@/constants/config';
import { SEO_DEFAULT_DESCRIPTION, SEO_KEYWORDS, SEO_OG_ALT, SEO_TAGLINE } from './site';

type PageMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  locale?: string;
  noIndex?: boolean;
};

const ogImagePath = '/opengraph-image';

export function createPageMetadata({
  title,
  description,
  path = '',
  locale = 'en',
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const pageTitle = title ?? `${appConfig.name} — ${SEO_TAGLINE}`;
  const pageDescription = description ?? SEO_DEFAULT_DESCRIPTION;
  const canonical = `${appConfig.url}/${locale}${path}`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [...SEO_KEYWORDS],
    applicationName: appConfig.name,
    metadataBase: new URL(appConfig.url),
    alternates: {
      canonical,
      languages: {
        en: `${appConfig.url}/en${path}`,
        vi: `${appConfig.url}/vi${path}`,
      },
    },
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/icon', type: 'image/png', sizes: '32x32' },
      ],
      apple: [{ url: '/apple-icon', type: 'image/png', sizes: '180x180' }],
    },
    openGraph: {
      type: 'website',
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      url: canonical,
      title: pageTitle,
      description: pageDescription,
      siteName: appConfig.name,
      images: [
        {
          url: ogImagePath,
          width: 1200,
          height: 630,
          alt: SEO_OG_ALT,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [ogImagePath],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
