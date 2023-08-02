import express from 'express'
import { ENUM_USER_ROLE } from '../../../enums/users'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { ReviewController } from './review.controller'
import { ReviewValidation } from './review.validation'

const router = express.Router()

router.post(
  '/',
  validateRequest(ReviewValidation.createReviewZodSchema),
  auth(ENUM_USER_ROLE.USER),
  ReviewController.createReview
)
router.get('/', ReviewController.getAllReviews)

export const BookRoutes = router
