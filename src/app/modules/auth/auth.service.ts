import httpStatus from 'http-status'
import { Secret } from 'jsonwebtoken'
import mongoose from 'mongoose'
import config from '../../../config'
import ApiError from '../../../errors/ApiErrors'
import { jwtHelpers } from '../../../helpers/jwtHelpers'
import { UserType } from '../user/user.interface'
import { User } from '../user/user.model'
import {
  LoginResponseType,
  LoginUserType,
  RefreshTokenResponseType,
  RegistrationResponseType,
} from './auth.interface'

/**
 * Create user service
 */
const createUser = async (
  user: UserType
): Promise<RegistrationResponseType> => {
  if (!user.role) {
    user.role = 'user'
  }
  const isUserExist = await User.isUserExist(user.email)
  if (isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already used!')
  }

  // generate student id
  let newUserData = null
  let accessToken = null
  let refreshToken = null

  const session = await mongoose.startSession()
  try {
    session.startTransaction()

    const newUser = await User.create([user], { session })

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user!')
    }

    const tokenOptionsValues = {
      id: newUser[0]._id,
      userEmail: user.email,
      role: newUser[0].role,
    }

    // create JWT token & refresh token
    accessToken = jwtHelpers.createToken(
      tokenOptionsValues,
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    )

    refreshToken = jwtHelpers.createToken(
      tokenOptionsValues,
      config.jwt.refresh_secret as Secret,
      config.jwt.refresh_expires_in as string
    )

    newUserData = newUser[0]

    await session.commitTransaction()
    await session.endSession()
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }

  return {
    user: newUserData,
    accessToken,
    refreshToken,
  }
}

/**
 * Login service
 */
const loginUser = async (
  payload: LoginUserType
): Promise<LoginResponseType> => {
  const { email, password } = payload

  const isUserExist = await User.isUserExist(email)

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  if (!(await User.isPasswordMatched(password, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect')
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const id = (isUserExist._id as string).toString()
  const { email: userEmail, role } = isUserExist

  // create JWT token & refresh token
  const accessToken = jwtHelpers.createToken(
    { id, userEmail, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  )

  const refreshToken = jwtHelpers.createToken(
    { id, userEmail, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  )

  return {
    email: userEmail,
    accessToken,
    refreshToken,
  }
}

/**
 * Refresh token service
 */
const refreshToken = async (
  token: string
): Promise<RefreshTokenResponseType> => {
  let verifiedToken = null
  //  verify token
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    )
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token')
  }

  const { id } = verifiedToken
  const isUserExist = await User.isUserExistById(id)

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  // generate new token
  const newAccessToken = jwtHelpers.createToken(
    {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      id,
      email: isUserExist.email,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  )

  return {
    accessToken: newAccessToken,
  }
}

export const AuthService = {
  loginUser,
  refreshToken,
  createUser,
}
