import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import { Secret } from 'jsonwebtoken'
import config from '../../config'
import ApiError from '../../errors/ApiErrors'
import { jwtHelpers } from '../../helpers/jwtHelpers'

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let verifiedUser = null

    try {
      // Get token
      const token = req.headers.authorization

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'No access token!')
      }

      //  verify token
      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret)
      req.user = verifiedUser

      // guard using role
      if (
        requiredRoles.length &&
        !requiredRoles.includes(verifiedUser.role) &&
        !(req.body.userId === verifiedUser.id)
      ) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Unauthorized access!')
      }

      next()
    } catch (error) {
      next(error)
    }
  }

export default auth
