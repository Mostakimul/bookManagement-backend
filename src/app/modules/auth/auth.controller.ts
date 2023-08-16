import { Request, Response } from 'express'
import httpStatus from 'http-status'
import config from '../../../config'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { LoginResponseType, RefreshTokenResponseType } from './auth.interface'
import { AuthService } from './auth.service'

/**
 * User signup controller
 */
const createUser = catchAsync(async (req: Request, res: Response) => {
  const { ...userData } = req.body
  const result = await AuthService.createUser(userData)

  const { refreshToken, ...others } = result

  // set refresh token into token
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }
  res.cookie('refreshToken', refreshToken, cookieOptions)

  sendResponse<RefreshTokenResponseType>(res, {
    success: true,
    message: 'User created successfully',
    data: others,
    statusCode: httpStatus.OK,
  })
})

/**
 * Login controller
 */
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body
  const result = await AuthService.loginUser(loginData)
  const { refreshToken, ...others } = result

  // set refresh token into token
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }
  res.cookie('refreshToken', refreshToken, cookieOptions)

  sendResponse<LoginResponseType>(res, {
    success: true,
    message: 'User login successfully',
    data: others,
    statusCode: httpStatus.OK,
  })
})

/**
 * RefreshToken controller
 */
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies
  const result = await AuthService.refreshToken(refreshToken)
  // set refresh token into token
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }
  res.cookie('refreshToken', refreshToken, cookieOptions)

  sendResponse<RefreshTokenResponseType>(res, {
    success: true,
    message: 'User login successfully',
    data: result,
    statusCode: httpStatus.OK,
  })
})

export const AuthController = {
  loginUser,
  refreshToken,
  createUser,
}
