export type LoginUserType = {
  email: string
  password: string
}

export type LoginResponseType = {
  email: string
  accessToken: string
  refreshToken?: string
}

export type RefreshTokenResponseType = {
  accessToken: string
}
