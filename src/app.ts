import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application, NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import router from './app/routes'

const app: Application = express()

app.use(cookieParser())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// application routes
app.use('/api/v1', router)

// not found handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Route not found!!!',
    errorMassages: [
      {
        path: req.originalUrl,
        message: 'Api route not found',
      },
    ],
  })
  next()
})

// global error handler
app.use(globalErrorHandler)

export default app
