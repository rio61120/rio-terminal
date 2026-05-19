import type { MetadataRoute } from 'next';
import { appConfig } from '@/constants/config';
import { routing } from '@/i18n/routing';

const paths = ['', '/terminal', '/terminal/settings'];

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${appConfig.url}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${appConfig.url}/${l}${path}`]),
        ),
      },
    })),
  );
}
