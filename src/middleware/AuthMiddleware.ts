import { Request, Response, NextFunction } from 'express'
import { ERROR_MESSAGES, HTTP_STATUS_CODES } from '../types/ResponseTypes'
import { sendError } from '../utility/ResponseUtility'
import * as AuthService from '../services/AuthService'

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendError(res, ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS_CODES.UNAUTHORIZED)
        }
        const token = extractTokenFromHeader(authHeader)
        if (!token) {
            return sendError(res, ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS_CODES.UNAUTHORIZED)
        }
        const user = await AuthService.getUserFromToken(token)
        req.user = user
        next()
    } catch (error) {
        return sendError(res, ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS_CODES.UNAUTHORIZED)
    }
    
}

// Helper function to extract token from Authorization header
function extractTokenFromHeader(authHeader: string): string | null {
    // Expected format: "Bearer <token>"
    const parts = authHeader.split(' ')
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null
    }
    
    return parts[1]
}

// Optional middleware - only authenticate if token is provided
export async function optionalAuthenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization
      
      if (!authHeader) {
        // No token provided, continue without setting req.user
        return next()
      }
      
      const token = extractTokenFromHeader(authHeader)
      
      if (!token) {
        return next()
      }
      
      // Try to get user from token
      const user = await AuthService.getUserFromToken(token)
      req.user = user
      
      next()
    } catch (error) {
      // If token is invalid, continue without setting req.user
      next()
    }
}

// Middleware to check if user is authenticated (use after authenticate)
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
    if (!req.user) {
      return sendError(res, ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS_CODES.UNAUTHORIZED)
    }
    
    next()
}
  
  // Middleware to check if user is active (use after authenticate)
  export function requireActiveUser(req: Request, res: Response, next: NextFunction): void {
    if (!req.user) {
      return sendError(res, ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS_CODES.UNAUTHORIZED)
    }
    
    if (req.user.status !== 'ACTIVE') {
      return sendError(res, 'User account is inactive', HTTP_STATUS_CODES.FORBIDDEN)
    }
    
    next()
}