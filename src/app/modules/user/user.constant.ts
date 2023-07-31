import { RoleType } from './user.interface'

export const USER_ROLE: RoleType[] = ['admin', 'user']

export const USERS_SEARCHABLE = ['name.firstName', 'email']
export const USERS_FILTERABLE = ['searchTerm', 'role', 'email']
