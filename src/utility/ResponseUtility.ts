import { Response } from 'express'
import { APIResponse, HTTP_STATUS_CODES } from '../types/ResponseTypes'

export const sendSuccess = <T>(
    res: Response,
    message: string,
    statusCode: number = HTTP_STATUS_CODES.OK,
    data?: T
): void => {
    const response: APIResponse<T> = {
        success: true,
        message,
        ...(data && { data }),
    }
    res.status(statusCode).json(response)
}

export function sendError(
    res: Response,
    message: string,
    statusCode: number = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
    errors?: any[]
): void {
    const response: APIResponse = {
        success: false,
        message,
        ...(errors && { errors }),
    }
    res.status(statusCode).json(response)
}

export function sendCreated<T>(
    res: Response,
    message: string,
    data?: T
): void {
    sendSuccess(res, message, HTTP_STATUS_CODES.CREATED, data)
}

// Not found response helper
export function sendNotFound(
    res: Response,
    message: string = 'Resource not found'
): void {
    sendError(res, message, HTTP_STATUS_CODES.NOT_FOUND)
}

// Forbidden response helper
export function sendForbidden(
    res: Response,
    message: string = 'Insufficient permissions'
): void {
    sendError(res, message, HTTP_STATUS_CODES.FORBIDDEN)
}

// Conflict response helper
export function sendConflict(
    res: Response,
    message: string = 'Resource already exists'
): void {
    sendError(res, message, HTTP_STATUS_CODES.CONFLICT)
}

// Unprocessable entity response helper
export function sendUnprocessable(
    res: Response,
    message: string = 'Unprocessable entity'
): void {
    sendError(res, message, HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY)
}
