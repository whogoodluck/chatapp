'use server'

import { RegisterInput } from '@/validators/user.schema'
import bcrypt from 'bcryptjs'

import prisma from '@/lib/prisma'

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hashedPassword)
  return isMatch
}

export async function createUser(user: RegisterInput) {
  const isExisting = await prisma.user.findFirst({
    where: { email: user.email },
  })
  if (isExisting) throw new Error('User already exists')

  const hashedPassword = await hashPassword(user.password)

  return await prisma.user.create({
    data: { ...user, password: hashedPassword, username: user.email.split('@')[0] },
  })
}
