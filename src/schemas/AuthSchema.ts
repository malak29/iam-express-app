import { z } from 'zod'


export const loginSchema = z.object({
    email: z.email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters long')
})

// Change password schema
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required')
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
})

export type LoginUserRequest = z.infer<typeof loginSchema>
export type changePasswordRequest = z.infer<typeof changePasswordSchema>