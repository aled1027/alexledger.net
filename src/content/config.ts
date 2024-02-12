import { defineCollection, z } from "astro:content";

export const collections = {
  posts: defineCollection({
    schema: z.object({
      title: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      includeToc: z.boolean().default(false),
      // description: z.string().max(200),
    }),
  }),
  guides: defineCollection({
    schema: z.object({
      title: z.string(),
      date: z.coerce.date(),
      includeToc: z.boolean().default(true),
      tags: z.array(z.string()).default([]),
      // description: z.string().max(200),
    }),
  }),
  ferments: defineCollection({
    schema: z.object({
      title: z.string(),
      date: z.coerce.date(),
      includeToc: z.boolean().default(false),
      dateStart: z.optional(z.date()),
      dateEnd: z.optional(z.date()),
      status: z.string(),
      fermentType: z.string(),
    }),
  }),
};
