import { z } from 'zod'
import { EUserType, EDepartmentType, EUserStatus } from '../types/UserTypes'

// Schema for creating a new user
export const createUserSchema = z.object({
    id: z.string().min(1, 'ID is required'),
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    email: z.email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    userType: z.enum(EUserType),
    department: z.enum(EDepartmentType),
    status: z.enum(EUserStatus),
})

// Schema for updating a user (all fields optional except id)
export const updateUserSchema = z.object({
    id: z.string().min(1, 'ID is required'),
    name: z
        .string()
        .min(1, 'Name is required')
        .max(100, 'Name too long')
        .optional(),
    email: z.email('Invalid email format').optional(),
    userType: z.enum(EUserType).optional(),
    department: z.enum(EDepartmentType).optional(),
    status: z.enum(EUserStatus).optional(),
})

// Schema for changing user status
export const changeStatusSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    newStatus: z.enum(EUserStatus),
})

// Schema for getting user by ID (URL parameter)
export const getUserByIdSchema = z.object({
    id: z.string().min(1, 'User ID is required'),
})

// Schema for getting user by email (query parameter)
export const getUserByEmailSchema = z.object({
    email: z.email('Invalid email format'),
})

// Schema for deleting user (URL parameter)
export const deleteUserSchema = z.object({
    id: z.string().min(1, 'User ID is required'),
})

// Type inference from schemas (for TypeScript)
export type CreateUserRequest = z.infer<typeof createUserSchema>
export type UpdateUserRequest = z.infer<typeof updateUserSchema>
export type ChangeStatusRequest = z.infer<typeof changeStatusSchema>
export type GetUserByIdRequest = z.infer<typeof getUserByIdSchema>
export type GetUserByEmailRequest = z.infer<typeof getUserByEmailSchema>
export type DeleteUserRequest = z.infer<typeof deleteUserSchema>
