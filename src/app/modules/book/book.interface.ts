import { Model } from 'mongoose'

export type BookType = {
  title: string
  author: string
  genre: string
  publicationDate: Date
}

export type BookModel = Model<BookType, Record<string, unknown>>
