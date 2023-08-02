import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { paginationFields } from '../../../constants/pagination'
import catchAsync from '../../../shared/catchAsync'
import pick from '../../../shared/pick'
import sendResponse from '../../../shared/sendResponse'
import { BOOKS_FILTERABLE } from './book.constant'
import { BookType } from './book.interface'
import { BookService } from './book.service'

/**
 * Create book controller
 */
const createBook = catchAsync(async (req: Request, res: Response) => {
  const { ...bookData } = req.body
  const result = await BookService.createBook(bookData)

  sendResponse<BookType>(res, {
    success: true,
    message: 'Book created successfully',
    data: result,
    statusCode: httpStatus.OK,
  })
})

/**
 * Get all books controller
 */
const getAllBooks = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, BOOKS_FILTERABLE)
  const paginationOptions = pick(req.query, paginationFields)

  const result = await BookService.getAllBooks(filters, paginationOptions)

  sendResponse(res, {
    success: true,
    message: 'Books retrieved successfully',
    data: result.data,
    meta: result.meta,
    statusCode: httpStatus.OK,
  })
})

/**
 * Get single book controller
 */
const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id

  const result = await BookService.getSingleBook(id)

  sendResponse(res, {
    success: true,
    message: 'Book retrieved successfully',
    data: result,
    statusCode: httpStatus.OK,
  })
})

/**
 * Update book controller
 */
const updateBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { userId, ...updatedData } = req.body

  const result = await BookService.updateBook(id, updatedData)

  sendResponse(res, {
    success: true,
    message: 'Book updated successfully',
    data: result,
    statusCode: httpStatus.OK,
  })
})

/**
 * Delete book controller
 */
const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id

  const result = await BookService.deleteBook(id)

  sendResponse(res, {
    success: true,
    message: 'Book deleted successfully',
    data: result,
    statusCode: httpStatus.OK,
  })
})

export const BookController = {
  createBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
}
