import { Review } from './review.model'
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiErrors'
import { ReviewType } from './review.interface'

/**
 * Create review service
 */
const createReview = async (
  payload: ReviewType
): Promise<ReviewType | null> => {
  const newReview = await Review.create(payload)

  if (!newReview) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to add review!')
  }

  return newReview
}

/**
 * Get all reviews service
 */
const getAllReviews = async (bookId: string): Promise<ReviewType[]> => {
  const result = await Review.find({ bookId: bookId })

  return result
}

export const ReviewService = {
  createReview,
  getAllReviews,
}
