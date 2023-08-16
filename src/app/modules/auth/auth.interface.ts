import { UserType } from '../user/user.interface'

export type LoginUserType = {
  email: string
  password: string
}

export type LoginResponseType = {
  email: string
  accessToken: string
  refreshToken?: string
}

export type RegistrationResponseType = {
  user: UserType
  accessToken: string
  refreshToken?: string
}

export type RefreshTokenResponseType = {
  accessToken: string
}
