import { UserModel, type UserDocument } from '../models/User'
import type { UserRole } from '../types/enums'

export async function countUsers() {
  return UserModel.countDocuments().exec()
}

export async function findUserByEmail(email: string, options?: { includePassword?: boolean }) {
  const query = UserModel.findOne({ email })
  if (options?.includePassword) {
    query.select('+password')
  }
  return query.exec()
}

export async function findUserById(id: string): Promise<UserDocument | null> {
  return UserModel.findById(id).exec()
}

export async function createUser(input: { name: string; email: string; password: string; role: UserRole }) {
  return UserModel.create(input)
}
