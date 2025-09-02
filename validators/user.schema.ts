import z from 'zod'
import { requiredString } from './helpers'

export const registerSchema = z.object({
  email: requiredString('Email').email('Invalid email format'),
  fullName: requiredString('Full name')
    .min(3, 'Full name must be at least 3 characters')
    .max(50, 'Full name must be less than 50 characters'),
  password: requiredString('Password')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
})

export const loginSchema = z.object({
  email: requiredString('Email').email('Invalid email format'),
  password: requiredString('Password'),
})

export const updateProfileSchema = z.object({
  username: requiredString('Username')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  fullName: z.string().min(2).max(50).optional(),
  avatar: z.string().url().optional(),
})

export const changePasswordSchema = z.object({
  currentPassword: requiredString('Current password'),
  newPassword: requiredString('New password')
    .min(6, 'New password must be at least 6 characters')
    .max(100, 'New password must be less than 100 characters'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
