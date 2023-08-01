import { z } from 'zod'

const createBookZodSchema = z.object({
  body: z.object({
    title: z.string(),
    author: z.string(),
    genre: z.string(),
    publicationDate: z.date(),
  }),
})

const updateBookZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    genre: z.string().optional(),
    publicationDate: z.date().optional(),
  }),
})

export const BookValidation = {
  createBookZodSchema,
  updateBookZodSchema,
}
