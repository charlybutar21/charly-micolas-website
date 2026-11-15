import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/stock', '/stock/'],
    },
    sitemap: 'https://www.charlymicolas.com/sitemap.xml',
  };
}
