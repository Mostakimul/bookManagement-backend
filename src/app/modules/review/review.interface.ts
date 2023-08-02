import { Model, Types } from 'mongoose'
import { BookType } from '../book/book.interface'
import { UserType } from '../user/user.interface'

export type ReviewType = {
  star: number
  comment: string
  bookId: Types.ObjectId | BookType
  userId: Types.ObjectId | UserType
}

export type ReviewModel = Model<ReviewType, Record<string, unknown>>
