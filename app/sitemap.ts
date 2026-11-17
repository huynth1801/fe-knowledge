import type { MetadataRoute } from 'next';
import { curriculumCategories } from '@/lib/curriculum';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://feviz.vercel.app');

  const lastModified = new Date();

  // Root and workbench routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/workbench`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Topic direct links
  for (const category of curriculumCategories) {
    for (const topic of category.topics) {
      routes.push({
        url: `${baseUrl}/workbench?topic=${topic.id}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }

  return routes;
}
