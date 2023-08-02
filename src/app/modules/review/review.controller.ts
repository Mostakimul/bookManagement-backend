import { Request, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { ReviewType } from './review.interface'
import { ReviewService } from './review.service'

/**
 * Create review controller
 */
const createReview = catchAsync(async (req: Request, res: Response) => {
  const { ...reviewData } = req.body
  const result = await ReviewService.createReview(reviewData)

  sendResponse<ReviewType>(res, {
    success: true,
    message: 'Review added succesfully',
    data: result,
    statusCode: httpStatus.OK,
  })
})

/**
 * Get all reviews controller
 */
const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const bookId = req.params.id

  const result = await ReviewService.getAllReviews(bookId)

  sendResponse(res, {
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
    statusCode: httpStatus.OK,
  })
})

export const ReviewController = {
  createReview,
  getAllReviews,
}
