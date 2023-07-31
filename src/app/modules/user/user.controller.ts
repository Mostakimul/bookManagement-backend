import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { paginationFields } from '../../../constants/pagination'
import catchAsync from '../../../shared/catchAsync'
import pick from '../../../shared/pick'
import sendResponse from '../../../shared/sendResponse'
import { USERS_FILTERABLE } from './user.constant'
import { UserService } from './user.service'

/**
 * User signup controller
 */
// const createUser = catchAsync(async (req: Request, res: Response) => {
//   const { ...userData } = req.body
//   const result = await UserService.createUser(userData)

//   sendResponse<UserType>(res, {
//     success: true,
//     message: 'User created successfully',
//     data: result,
//     statusCode: httpStatus.OK,
//   })
// })

/**
 * Get all users controller
 */
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, USERS_FILTERABLE)
  const paginationOptions = pick(req.query, paginationFields)

  const result = await UserService.getAllUsers(filters, paginationOptions)

  sendResponse(res, {
    success: true,
    message: 'Users retrieved successfully',
    data: result.data,
    meta: result.meta,
    statusCode: httpStatus.OK,
  })
})

/**
 * Get single user controller
 */
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id

  const result = await UserService.getSingleUser(id)

  sendResponse(res, {
    success: true,
    message: 'User retrieved successfully',
    data: result,
    statusCode: httpStatus.OK,
  })
})

/**
 * Update user controller
 */
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const updatedData = req.body

  const result = await UserService.updateUser(id, updatedData)

  sendResponse(res, {
    success: true,
    message: 'User updated successfully',
    data: result,
    statusCode: httpStatus.OK,
  })
})
/**
 * Update my profile controller
 */
const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const id = req.user.id
  const updatedData = req.body

  const result = await UserService.updateMyProfile(id, updatedData)

  sendResponse(res, {
    success: true,
    message: 'User profile updated successfully',
    data: result,
    statusCode: httpStatus.OK,
  })
})

/**
 * Delete user controller
 */
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id

  const result = await UserService.deleteUser(id)

  sendResponse(res, {
    success: true,
    message: 'User deleted successfully',
    data: result,
    statusCode: httpStatus.OK,
  })
})

/**
 * My profile  controller
 */
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id

  const result = await UserService.getMyProfile(userId)

  sendResponse(res, {
    success: true,
    message: 'User profile fetched successfully',
    data: result,
    statusCode: httpStatus.OK,
  })
})

export const UserController = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
}
