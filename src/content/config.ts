import { defineCollection, z } from "astro:content";

export const collections = {
  posts: defineCollection({
    schema: z.object({
      title: z.string(),
      date: z.date(),
      tags: z.array(z.string()).default([]),
      // description: z.string().max(200),
    }),
  }),
  guides: defineCollection({
    schema: z.object({
      title: z.string(),
      date: z.date(),
      // description: z.string().max(200),
    }),
  }),
};