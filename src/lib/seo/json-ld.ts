import { appConfig } from '@/constants/config';
import { SEO_DEFAULT_DESCRIPTION, SEO_TAGLINE } from './site';

export function createSoftwareApplicationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: appConfig.name,
    description: SEO_DEFAULT_DESCRIPTION,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    featureList: ['Terminal online', 'Sync local terminal', 'Real PTY shell'],
    slogan: SEO_TAGLINE,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}
