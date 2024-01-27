import { defineCollection, z } from "astro:content";

export const collections = {
  posts: defineCollection({
    schema: z.object({
      title: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      // description: z.string().max(200),
    }),
  }),
  guides: defineCollection({
    schema: z.object({
      title: z.string(),
      date: z.coerce.date(),
      // description: z.string().max(200),
    }),
  }),
};
