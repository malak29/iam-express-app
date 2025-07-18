import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { sendError } from '../utility/ResponseUtility'
import { ERROR_MESSAGES, HTTP_STATUS_CODES } from '../types/ResponseTypes'

const FILENAME = 'ErrorMiddleware.ts'
// Global error handler - catches all unhandled errors
export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction): void {
  console.error('Error caught by middleware:', error)
  
  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    const validationErrors = error.issues.map(issue => ({
      path: issue.path.join('.'),
      message: issue.message
    }))
    
    return sendError(res, ERROR_MESSAGES.VALIDATION_FAILED, HTTP_STATUS_CODES.BAD_REQUEST, FILENAME, validationErrors)
  }
  
  if (error.message.includes('Unauthorized') || error.message.includes('Invalid token')) {
    return sendError(res, ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS_CODES.UNAUTHORIZED, FILENAME)
  }
  
  if (error.message.includes('Forbidden') || error.message.includes('permission')) {
    return sendError(res, ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS, HTTP_STATUS_CODES.FORBIDDEN, FILENAME)
  }
  
  if (error.message.includes('not found')) {
    return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS_CODES.NOT_FOUND, FILENAME)
  }
  
  if (error.message.includes('already exists')) {
    return sendError(res, ERROR_MESSAGES.USER_ALREADY_EXISTS, HTTP_STATUS_CODES.CONFLICT, FILENAME)
  }
  
  // Default to internal server error
  sendError(res, ERROR_MESSAGES.INTERNAL_ERROR, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, FILENAME)
}

// 404 handler - for routes that don't exist
export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, `Route ${req.method} ${req.path} not found`, HTTP_STATUS_CODES.NOT_FOUND, FILENAME)
}

// Request logging middleware (optional)
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${req.method} ${req.path}`)
  next()
}