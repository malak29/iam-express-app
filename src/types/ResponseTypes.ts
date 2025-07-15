import { string } from "zod";

export interface APIResponse <T = any> {
    success: boolean
    message: string
    data?: T
}

export interface ErrorResponse {
    success: false
    message: string
    errors?: any[]
}

export interface SuccessResponse <T = any> {
    success: true
    message: string
    data?: T
}

export const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
} as const

export const ERROR_MESSAGES = {
    USER_NOT_FOUND: 'User not found',
    USER_ALREADY_EXISTS: 'User already exists with this email',
    INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
    INVALID_STATUS_CHANGE: 'Invalid status change operation',
    VALIDATION_FAILED: 'Validation failed',
    NOT_IMPLEMENTED: 'Feature not implemented yet',
    UNAUTHORIZED: 'Authentication required',
    INTERNAL_ERROR: 'Internal server error'
} as const

export const SUCCESS_MESSAGES = {
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully',
    STATUS_CHANGED: 'User status changed successfully'  
} as const