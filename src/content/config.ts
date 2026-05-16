import { defineCollection, z } from 'astro:content';

const pages = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      ogImage: image().optional(),
      ogImageAlt: z.string().optional(),
      canonical: z.string().url().optional(),
      eventDialog: z.boolean().default(true),
      pagefind: z.boolean().default(true),
      publishedAt: z.coerce.date().optional(),
    }),
});

const projects = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      thumbnail: image(),
      thumbnailAlt: z.string(),
      author: z.string().optional(),
      ogImage: image().optional(),
      ogImageAlt: z.string().optional(),
      canonical: z.string().url().optional(),
      eventDialog: z.boolean().default(true),
      pagefind: z.boolean().default(true),
      publishedAt: z.coerce.date().optional(),
    }),
});

export const collections = { pages, projects };
