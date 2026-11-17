import type { MetadataRoute } from 'next';
import { curriculumCategories } from '@/lib/curriculum';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fe-visualizer.dev';
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
