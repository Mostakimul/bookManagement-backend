/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import { SortOrder } from 'mongoose'
import ApiError from '../../../errors/ApiErrors'
import { paginationHelpers } from '../../../helpers/paginationHelper'
import {
  GenericResponseType,
  PaginationOptionsType,
} from '../../../interfaces/common'
import { USERS_SEARCHABLE } from './user.constant'
import { UserType, UserTypeFilters } from './user.interface'
import { User } from './user.model'

/**
 * Get All users service
 */
const getAllUsers = async (
  filters: UserTypeFilters,
  payload: PaginationOptionsType
): Promise<GenericResponseType<UserType[]>> => {
  const { searchTerm, ...filtersData } = filters

  const andConditions = []

  if (searchTerm) {
    andConditions.push({
      $or: USERS_SEARCHABLE.map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    })
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    })
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(payload)

  const sortConditions: { [key: string]: SortOrder } = {}
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {}

  const result = await User.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)

  const total = await User.countDocuments(whereConditions)

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  }
}

/**
 * Get single user service
 */
const getSingleUser = async (payload: string): Promise<UserType | null> => {
  const result = await User.findById(payload)
  return result
}

/**
 * Update user service
 */
const updateUser = async (
  id: string,
  payload: Partial<UserType>
): Promise<UserType | null> => {
  const isExist = await User.findOne({ _id: id })

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
  }

  const { name, ...userData } = payload

  const updatedUserData: Partial<UserType> = { ...userData }

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<UserType>
      ;(updatedUserData as any)[nameKey] = name[key as keyof typeof name]
    })
  }
  const result = await User.findOneAndUpdate({ _id: id }, updatedUserData, {
    new: true,
  })
  return result
}
/**
 * Delete user service
 */
const deleteUser = async (payload: string): Promise<UserType | null> => {
  const result = await User.findByIdAndDelete(payload)
  return result
}

export const UserService = {
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
}
