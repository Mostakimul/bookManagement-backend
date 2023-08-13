import httpStatus from 'http-status'
import { Secret } from 'jsonwebtoken'
import config from '../../../config'
import ApiError from '../../../errors/ApiErrors'
import { jwtHelpers } from '../../../helpers/jwtHelpers'
import { UserType } from '../user/user.interface'
import { User } from '../user/user.model'
import {
  LoginResponseType,
  LoginUserType,
  RefreshTokenResponseType,
} from './auth.interface'

/**
 * Create user service
 */
const createUser = async (user: UserType): Promise<UserType | null> => {
  if (!user.role) {
    user.role = 'user'
  }
  const isUserExist = await User.isUserExist(user.email)
  if (isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already used!')
  }

  const newUser = await User.create(user)

  if (!newUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user!')
  }

  return newUser
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
