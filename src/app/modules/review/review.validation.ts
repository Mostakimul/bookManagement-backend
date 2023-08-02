import { z } from 'zod'

const createReviewZodSchema = z.object({
  body: z.object({
    reviewStar: z.number().optional(),
    reviewComment: z.string().optional(),
    userId: z.string(),
    bookId: z.string(),
  }),
})

const updateReviewZodSchema = z.object({
  body: z.object({
    reviewStar: z.number().optional(),
    reviewComment: z.string().optional(),
    userId: z.string().optional(),
    bookId: z.string().optional(),
  }),
})

export const ReviewValidation = {
  createReviewZodSchema,
  updateReviewZodSchema,
}
