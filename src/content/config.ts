import { defineCollection, z } from 'astro:content';

const partnersCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    logo: z.string().optional(),
    website: z.string().url().optional(),
    description: z.string(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    active: z.boolean().default(true),
    images: z.array(z.string()).default([]),
    headerImages: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    location: z.string().optional()
  })
});

const eventsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    startDate: z.date(),
    endDate: z.date().optional(),
    location: z.string().optional(),
    locationUrl: z.string().url().optional(),
    registrationUrl: z.string().url().optional(),
    showBanner: z.boolean().default(true),
    bannerText: z.string().optional(),
    tags: z.array(z.string()).default([])
  })
});

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    layout: z.string().default('default'),
    showInNav: z.boolean().default(true),
    navOrder: z.number().default(0),
    lastModified: z.date().optional()
  })
});

export const collections = {
  'partners': partnersCollection,
  'events': eventsCollection,
  'pages': pagesCollection
};