export type LoginUserType = {
  email: string
  password: string
}

export type LoginResponseType = {
  accessToken: string
  refreshToken?: string
}

export type RefreshTokenResponseType = {
  accessToken: string
}
