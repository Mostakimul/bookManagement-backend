import { Model } from 'mongoose'

export type RoleType = 'admin' | 'user'

type NameType = {
  firstName: string
  lastName: string
}

export type UserType = {
  email: string
  role: RoleType
  password: string
  name: NameType
}

export type UserModel = {
  isUserExist(email: string): Promise<UserType>
  isUserExistById(id: string): Promise<UserType>
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>
} & Model<UserType>

export type UserTypeFilters = {
  searchTerm?: string
  email?: string
  role?: string
}
