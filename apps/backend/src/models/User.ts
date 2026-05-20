import bcrypt from 'bcrypt'
import mongoose, { type HydratedDocument, type Model, Schema } from 'mongoose'

import { UserRole } from '../types/enums'

export interface IUser {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface IUserTimestamps {
  createdAt: Date
  updatedAt: Date
}

export interface IUserMethods {
  comparePassword(candidate: string): Promise<boolean>
}

type UserQueryHelpers = Record<string, never>

export type UserEntity = IUser & IUserTimestamps

export type UserDocument = HydratedDocument<UserEntity, IUserMethods>

const userSchema = new Schema<UserEntity, Model<UserEntity, UserQueryHelpers, IUserMethods>, IUserMethods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      default: UserRole.Sales,
      index: true,
    },
  },
  { timestamps: true },
)

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return
  }
  const saltRounds = 12
  this.password = await bcrypt.hash(this.password, saltRounds)
})

userSchema.method('comparePassword', function (candidate: string) {
  return bcrypt.compare(candidate, this.password)
})

export const UserModel =
  ((mongoose.models.User as Model<UserEntity, UserQueryHelpers, IUserMethods> | undefined) ??
    mongoose.model<UserEntity, Model<UserEntity, UserQueryHelpers, IUserMethods>>('User', userSchema))
