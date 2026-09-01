import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Shared across both collections. `image` comes from the schema context, so the
// common fields are a factory rather than a plain object. It stays generic over
// the image schema so the collection's inferred `ImageMetadata` type flows
// through untouched, rather than being pinned to a hand-written stand-in.
const commonFields = <T extends z.ZodType>(image: () => T) => ({
  title: z.string(),
  description: z.string(),
  ogImage: image().optional(),
  ogImageAlt: z.string().optional(),
  canonical: z.url().optional(),
  eventDialog: z.boolean().default(true),
  pagefind: z.boolean().default(true),
  publishedAt: z.coerce.date().optional(),
  lastVerified: z.coerce.date().optional(),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/pages' }),
  schema: ({ image }) => z.object(commonFields(image)),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      ...commonFields(image),
      thumbnail: image(),
      thumbnailAlt: z.string(),
      author: z.string().optional(),
    }),
});

export const collections = { pages, projects };
