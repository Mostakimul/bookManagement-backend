import express from 'express'
import { ENUM_USER_ROLE } from '../../../enums/users'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { BookController } from './book.controller'
import { BookValidation } from './book.validation'

const router = express.Router()

router.delete('/id', auth(ENUM_USER_ROLE.USER), BookController.deleteBook)
router.post(
  '/',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(BookValidation.createBookZodSchema),
  BookController.createBook
)
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(BookValidation.updateBookZodSchema),
  BookController.updateBook
)
router.get('/:id', BookController.getSingleBook)
router.get('/', BookController.getAllBooks)

export const BookRoutes = router
