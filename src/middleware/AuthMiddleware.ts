import { Request, Response, NextFunction } from 'express'
import * as AuthService from '../services/AuthService'
import { sendError } from '../utility/ResponseUtility'
import { ERROR_MESSAGES, HTTP_STATUS_CODES } from '../types/ResponseTypes'
import { IUser } from '../types/UserTypes'

const FILENAME = 'authMiddleware.ts'

// Custom interface for authenticated requests
interface AuthenticatedRequest extends Request {
  user?: IUser
}

// Main authentication middleware
export async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      return sendError(res, ERROR_MESSAGES.NO_HEADER, HTTP_STATUS_CODES.UNAUTHORIZED, FILENAME)
    }
    
    // Expected format: "Bearer <token>"
    const token = extractTokenFromHeader(authHeader)
    
    if (!token) {
      return sendError(res, ERROR_MESSAGES.NO_TOKEN, HTTP_STATUS_CODES.UNAUTHORIZED, FILENAME)
    }
    
    // Get user from token
    const user = await AuthService.getUserFromToken(token)
    
    // Set user on request object
    req.user = user
    
    // Continue to next middleware/controller
    next()
  } catch (error) {
    return sendError(res, ERROR_MESSAGES.TOKEN_FAILURE, HTTP_STATUS_CODES.UNAUTHORIZED, FILENAME)
  }
}

// Optional middleware - only authenticate if token is provided
export async function optionalAuthenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
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

// Helper function to extract token from Authorization header
function extractTokenFromHeader(authHeader: string): string | null {
  // Expected format: "Bearer <token>"
  const parts = authHeader.split(' ')
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null
  }
  
  return parts[1]
}

// Middleware to check if user is authenticated (use after authenticate)
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    return sendError(res, ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS_CODES.UNAUTHORIZED, FILENAME)
  }
  
  next()
}

// Middleware to check if user is active (use after authenticate)
export function requireActiveUser(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    return sendError(res, ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS_CODES.UNAUTHORIZED, FILENAME)
  }
  
  if (req.user.status !== 'ACTIVE') {
    return sendError(res, 'User account is inactive', HTTP_STATUS_CODES.FORBIDDEN, FILENAME)
  }
  
  next()
}