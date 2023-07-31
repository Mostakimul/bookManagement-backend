/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt'
import { Schema, model } from 'mongoose'
import config from '../../../config'
import { UserModel, UserType } from './user.interface'

const UserSchema = new Schema<UserType, UserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    name: {
      type: String,
    },
    role: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

UserSchema.statics.isUserExist = async function (email: string) {
  return await User.findOne({ email }, { _id: 1, email: 1, password: 1 })
}

UserSchema.statics.isUserExistById = async function (id: string) {
  return await User.findOne({ _id: id })
}

UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword)
}

UserSchema.pre('save', async function (next) {
  const user = this
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  )

  next()
})

export const User = model<UserType, UserModel>('User', UserSchema)
