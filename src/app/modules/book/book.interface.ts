import { Model, Types } from 'mongoose'
import { UserType } from '../user/user.interface'

export type BookType = {
  title: string
  author: string
  genre: string
  publicationDate: string
  userId: Types.ObjectId | UserType
}

export type BookModel = Model<BookType, Record<string, unknown>>

export type BookTypeFilters = {
  searchTerm?: string
  publicationDate?: Date
  genre?: string
}
