/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import config from '../../config'
import ApiError from '../../errors/ApiErrors'
import handleCastError from '../../errors/handleCastError'
import handleValidationError from '../../errors/handleValidationError'
import handleZodErrorHandler from '../../errors/handleZodErrorHandler'
import { IGenericErrorResponse } from '../../interfaces/common'
import { IGenericErrorMessage } from '../../interfaces/error'

// global error handler
const globalErrorHandler: ErrorRequestHandler = (error, _, res) => {
  config.env == 'development'
    ? console.log('globalErrorHandler ~ ', error)
    : console.error('globalErrorHandler ~ ', error)

  let statusCode = 500
  let message = 'Something went wrong!'
  let errorMessages: IGenericErrorMessage[] = []

  if (error?.name === 'ValidationError') {
    const simplifiedError: IGenericErrorResponse = handleValidationError(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorMessages
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodErrorHandler(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorMessages
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode
    message = error?.message
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : []
  } else if (error?.name === 'CastError') {
    const simplifiedError = handleCastError(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorMessages
  } else if (error instanceof Error) {
    message = error?.message
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error.message,
          },
        ]
      : []
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== 'production' ? error?.stack : undefined,
  })
}

export default globalErrorHandler
