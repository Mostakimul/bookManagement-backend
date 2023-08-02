import { Schema, model } from 'mongoose'
import { ReviewModel, ReviewType } from './review.interface'

const reviewSchema = new Schema<ReviewType>(
  {
    star: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

export const Review = model<ReviewType, ReviewModel>('Book', reviewSchema)
