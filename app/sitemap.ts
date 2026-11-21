import type { MetadataRoute } from 'next';
import { portfolioData } from '@/app/data';
import { navigationItems } from '@/app/lib/navigation';
import { SITE_LAST_MODIFIED, SITE_URL } from '@/app/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...navigationItems.map(({ href }, index) => ({
      url: `${SITE_URL}${href}`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: index === 0 ? ('monthly' as const) : ('yearly' as const),
      priority: index === 0 ? 1 : 0.8,
    })),
    ...portfolioData.writing.map((post) => ({
      url: `${SITE_URL}/writing/${post.slug}`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ];
}
