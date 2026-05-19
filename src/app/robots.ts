import type { MetadataRoute } from 'next';
import { appConfig } from '@/constants/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${appConfig.url}/sitemap.xml`,
  };
}
