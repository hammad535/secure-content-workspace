const { z } = require('zod');

const createArticleSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  }),
});

const updateArticleSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
});

module.exports = { createArticleSchema, updateArticleSchema };
