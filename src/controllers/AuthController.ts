import { Request, Response } from 'express'
import { validateBody } from '../utility/ValidationUtility'
import * as AuthService from '../services/AuthService'
import { toSafeUser } from '../models/User'
import {
    sendSuccess,
    sendError,
} from '../utility/ResponseUtility'
import {
    SUCCESS_MESSAGES,
    ERROR_MESSAGES,
    HTTP_STATUS_CODES,
} from '../types/ResponseTypes'
import { extractErrorContext } from '../utility/ErrorUtility'
import { changePasswordSchema, loginSchema } from '../schemas/AuthSchema'
import { ErrorType } from '../types/ErrorTypes'

export async function login(req: Request, res: Response): Promise<void> {
    try {
        const credentials = validateBody(loginSchema, req.body)
        const { token, user } = await AuthService.login(credentials)
        sendSuccess(res, SUCCESS_MESSAGES.LOGIN_SUCCESS, HTTP_STATUS_CODES.OK, {
            token,
            user: toSafeUser(user),
        })
    } catch (error: Error | any) {
        // Handle specific errors
        if (error.message.includes('Invalid credentials')) {
            return sendError(
                res,
                'Invalid email or password',
                HTTP_STATUS_CODES.UNAUTHORIZED
            )
        }

        if (error.message.includes('not found')) {
            return sendError(
                res,
                'Invalid email or password',
                HTTP_STATUS_CODES.UNAUTHORIZED
            )
        }

        if (error.message.includes('account is inactive')) {
            return sendError(
                res,
                'Account is inactive. Please contact administrator.',
                HTTP_STATUS_CODES.FORBIDDEN
            )
        }

        // For other errors, let middleware handle
        throw error
    }
}

// POST /auth/logout - User logout
export async function logout(req: Request, res: Response): Promise<void> {
    try {
        // For JWT, logout is typically handled client-side by removing the token
        // If you want server-side logout, you'd need to implement token blacklisting

        sendSuccess(res, 'Logout successful')
    } catch (error) {
        throw error
    }
}

// GET /auth/me - Get current user info
export async function getCurrentUser(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const user = req.user   

        if (!user) {
            return sendError(
                res,
                ERROR_MESSAGES.UNAUTHORIZED,
                HTTP_STATUS_CODES.UNAUTHORIZED
            )
        }

        sendSuccess(
            res,
            'User retrieved successfully',
            HTTP_STATUS_CODES.OK,
            toSafeUser(user)
        )
    } catch (error) {
        throw error
    }
}

// POST /auth/refresh - Refresh token
export async function refreshToken(req: Request, res: Response): Promise<void> {
    try {
        // Extract current token
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return sendError(
                res,
                ERROR_MESSAGES.UNAUTHORIZED,
                HTTP_STATUS_CODES.UNAUTHORIZED
            )
        }

        const currentToken = authHeader.split(' ')[1]

        if (!currentToken) {
            return sendError(
                res,
                ERROR_MESSAGES.UNAUTHORIZED,
                HTTP_STATUS_CODES.UNAUTHORIZED
            )
        }

        // Generate new token
        const newToken = await AuthService.refreshToken(currentToken)

        sendSuccess(res, 'Token refreshed successfully', HTTP_STATUS_CODES.OK, {
            token: newToken,
        })
    } catch (error: Error | any) {
        if (error.message.includes('Invalid or expired token')) {
            return sendError(
                res,
                'Invalid or expired token',
                HTTP_STATUS_CODES.UNAUTHORIZED
            )
        }

        throw error
    }
}

// POST /auth/change-password - Change user password (requires auth)
export async function changePassword(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const user = req.user

        if (!user) {
            return sendError(
                res,
                ERROR_MESSAGES.UNAUTHORIZED,
                HTTP_STATUS_CODES.UNAUTHORIZED
            )
        }

        // Validate request body
        const { currentPassword, newPassword } = validateBody(
            changePasswordSchema,
            req.body
        )

        // This would need to be implemented in UserService
        // For now, return not implemented
        sendError(
            res,
            ERROR_MESSAGES.NOT_IMPLEMENTED,
            HTTP_STATUS_CODES.NOT_IMPLEMENTED
        )
    } catch (error: Error | any) {
        const errorContext = extractErrorContext(error)

        switch (errorContext.type) {
            case ErrorType.NOT_IMPLEMENTED:
                return sendError(
                    res,
                    ERROR_MESSAGES.NOT_IMPLEMENTED,
                    HTTP_STATUS_CODES.NOT_IMPLEMENTED
                )
            case ErrorType.PERMISSION:
                return sendError(
                    res,
                    ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS,
                    HTTP_STATUS_CODES.FORBIDDEN
                )
            default:
                throw error
        }
    }
}
