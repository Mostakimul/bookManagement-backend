import { z } from 'zod'

const createBookZodSchema = z.object({
  body: z.object({
    title: z.string(),
    author: z.string(),
    genre: z.string(),
    publicationDate: z.string(),
    userId: z.string(),
  }),
})

const updateBookZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    genre: z.string().optional(),
    publicationDate: z.string().optional(),
    userId: z.string().optional(),
  }),
})

export const BookValidation = {
  createBookZodSchema,
  updateBookZodSchema,
}
