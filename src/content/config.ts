// src/content/config.ts
// Defines the schema for every blog post's frontmatter.
// Astro validates this at build time — wrong fields throw a clear error.

import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title:        z.string(),
    description:  z.string(),
    author:       z.string().default('Dr. Antony Augusthy'),
    pubDate:      z.coerce.date(),
    updatedDate:  z.coerce.date().optional(),
    heroImage:    z.string().optional(),
    heroImageAlt: z.string().optional(),
    category:     z.string().optional(),
    tags:         z.array(z.string()).optional(),
    draft:        z.boolean().default(false),
  }),
});

export const collections = { blog };
