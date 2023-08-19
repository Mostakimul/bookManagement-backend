/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import { SortOrder } from 'mongoose'
import ApiError from '../../../errors/ApiErrors'
import { paginationHelpers } from '../../../helpers/paginationHelper'
import {
  GenericResponseType,
  PaginationOptionsType,
} from '../../../interfaces/common'
import { Review } from '../review/review.model'
import { BOOKS_SEARCHABLE } from './book.constant'
import { BookType, BookTypeFilters } from './book.interface'
import { Book } from './book.model'

/**
 * Create book service
 */
const createBook = async (payload: BookType): Promise<BookType | null> => {
  const newBook = await Book.create(payload)

  if (!newBook) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create book!')
  }

  return newBook
}

/**
 * Get all books service
 */
const getAllBooks = async (
  filters: BookTypeFilters,
  payload: PaginationOptionsType
): Promise<GenericResponseType<BookType[]>> => {
  const { searchTerm, ...filtersData } = filters

  const andConditions = []

  if (searchTerm) {
    andConditions.push({
      $or: BOOKS_SEARCHABLE.map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    })
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    })
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(payload)

  const sortConditions: { [key: string]: SortOrder } = {}
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {}

  const result = await Book.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)

  const total = await Book.countDocuments(whereConditions)

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}

/**
 * Get single book service
 */
const getSingleBook = async (payload: string): Promise<BookType | null> => {
  const result = await Book.findById(payload)
  return result
}

/**
 * Update book service
 */
const updateBook = async (
  id: string,
  payload: Partial<BookType>
): Promise<BookType | null> => {
  const isExist = await Book.findOne({ _id: id })

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found')
  }

  const result = await Book.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
  return result
}

/**
 * Delete book service
 */
const deleteBook = async (payload: string): Promise<BookType | null> => {
  await Review.deleteMany({ bookId: payload })

  const result = await Book.findByIdAndDelete(payload)
  return result
}

export const BookService = {
  createBook,
  getAllBooks,
  getSingleBook,
  deleteBook,
  updateBook,
}
