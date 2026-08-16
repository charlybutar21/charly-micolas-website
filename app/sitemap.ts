import type { MetadataRoute } from 'next';

import { portfolioData } from './data';

export const dynamic = 'force-static';

const baseUrl = 'https://charlymicolas.com';
const siteLastModified = new Date('2026-08-16T00:00:00.000Z');

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '/',
    '/about',
    '/technical-skills',
    '/experiences',
    '/writing',
    '/contact',
  ];

  return [
    ...routes.map((route, index) => ({
      url: `${baseUrl}${route}`,
      lastModified: siteLastModified,
      changeFrequency: index === 0 ? ('monthly' as const) : ('yearly' as const),
      priority: index === 0 ? 1 : 0.8,
    })),
    ...portfolioData.writing.map((post) => ({
      url: `${baseUrl}/writing/${post.slug}`,
      lastModified: siteLastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ];
}
