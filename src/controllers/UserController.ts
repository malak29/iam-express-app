import { Request, Response } from 'express'
import { validateBody, validateParams } from '../utility/ValidationUtility'
import { 
  createUserSchema, 
  updateUserSchema, 
  changeStatusSchema,
  getUserByIdSchema,
  getUserByEmailSchema,
  deleteUserSchema 
} from '../schemas/UserSchema'
import * as UserService from '../services/UserService'
import { toSafeUser } from '../models/User'
import { EDepartmentType, EUserStatus, EUserType, INewUserInput, IUser } from '../types/UserTypes'
import { 
  sendSuccess, 
  sendCreated, 
  sendNotFound, 
  sendForbidden, 
  sendConflict, 
  sendUnprocessable,
  sendError
} from '../utility/ResponseUtility'
import { 
  SUCCESS_MESSAGES, 
  ERROR_MESSAGES, 
  HTTP_STATUS_CODES 
} from '../types/ResponseTypes'
import { extractErrorContext } from '../utility/ErrorUtility'
import { ErrorType } from '../types/ErrorTypes'

const FILENAME = 'UserController.ts'

// Custom interface for authenticated requests
interface AuthenticatedRequest extends Request {
  user?: IUser
}

// POST /users - Create new user (Admin function)
export async function createUser(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const requestor = req.user!  // Non-null assertion since middleware ensures this
    console.log('Request body:', req.body)
    console.log('Request body type:', typeof req.body)
    console.log('Request headers:', req.headers)
    
    const validatedData = validateBody(createUserSchema, req.body)
    
    // Convert string values to enum values
    const userData: INewUserInput = {
      id: validatedData.id,
      name: validatedData.name,
      email: validatedData.email,
      password: validatedData.password,
      userType: validatedData.userType as EUserType,
      department: validatedData.department as EDepartmentType,
      status: validatedData.status as EUserStatus,
    }
    await UserService.registerUser(requestor, userData)
    
    sendCreated(res, SUCCESS_MESSAGES.USER_CREATED)
  } catch (error: Error | any) {
    const errorContext = extractErrorContext(error)
    
    switch (errorContext.type) {
      case ErrorType.ALREADY_EXISTS:
        return sendConflict(res, ERROR_MESSAGES.USER_ALREADY_EXISTS)
      case ErrorType.PERMISSION:
        return sendForbidden(res, ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS)
      default:
        throw error
    }
  }
}

// GET /users/:id - Get user by ID
export async function getUserById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const requestor = req.user!
    const { id } = validateParams(getUserByIdSchema, req.params)
    
    const user = await UserService.getUserById(requestor, id)
    
    sendSuccess(res, 'User retrieved successfully', HTTP_STATUS_CODES.OK, toSafeUser(user))
  } catch (error: Error | any) {
    const errorContext = extractErrorContext(error)
    
    switch (errorContext.type) {
      case ErrorType.NOT_FOUND:
        return sendNotFound(res, ERROR_MESSAGES.USER_NOT_FOUND)
      case ErrorType.PERMISSION:
        return sendForbidden(res, ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS)
      default:
        throw error
    }
  }
}

// GET /users/email/:email - Get user by email
export async function getUserByEmail(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const requestor = req.user!
    const { email } = validateParams(getUserByEmailSchema, req.params)
    
    const user = await UserService.getUserByEmail(requestor, email)
    
    sendSuccess(res, 'User retrieved successfully', HTTP_STATUS_CODES.OK, toSafeUser(user))
  } catch (error: Error | any) {
    const errorContext = extractErrorContext(error)
    
    switch (errorContext.type) {
      case ErrorType.NOT_FOUND:
        return sendNotFound(res, ERROR_MESSAGES.USER_NOT_FOUND)
      case ErrorType.PERMISSION:
        return sendForbidden(res, ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS)
      default:
        throw error
    }
  }
}

// PUT /users/:id - Update user
export async function updateUser(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const requestor = req.user!
    const { id } = validateParams(getUserByIdSchema, req.params)
    const updateData = validateBody(updateUserSchema, req.body)
    
    // Get current user to update
    const currentUser = await UserService.getUserById(requestor, id)
    
    // Merge update data with current user
    const updatedUser = {
      ...currentUser,
      ...updateData,
      id // Ensure ID stays the same
    }
    
    await UserService.updateUser(requestor, updatedUser)
    
    sendSuccess(res, SUCCESS_MESSAGES.USER_UPDATED)
  } catch (error: Error | any) {
    const errorContext = extractErrorContext(error)
    
    switch (errorContext.type) {
      case ErrorType.NOT_FOUND:
        return sendNotFound(res, ERROR_MESSAGES.USER_NOT_FOUND)
      case ErrorType.PERMISSION:
        return sendForbidden(res, ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS)
      default:
        throw error
    }
  }
}

// DELETE /users/:id - Delete user
export async function deleteUser(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const requestor = req.user!
    const { id } = validateParams(deleteUserSchema, req.params)
    
    // Get user to delete
    const targetUser = await UserService.getUserById(requestor, id)
    
    await UserService.deleteUser(requestor, targetUser)
    
    sendSuccess(res, SUCCESS_MESSAGES.USER_DELETED)
  } catch (error: Error | any) {
    const errorContext = extractErrorContext(error)
    
    switch (errorContext.type) {
      case ErrorType.NOT_FOUND:
        return sendNotFound(res, ERROR_MESSAGES.USER_NOT_FOUND)
      case ErrorType.PERMISSION:
        return sendForbidden(res, ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS)
      default:
        throw error
    }
  }
}

// PATCH /users/:id/status - Change user status
export async function changeUserStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const requestor = req.user!
    const { id } = validateParams(getUserByIdSchema, req.params)
    const { newStatus } = validateBody(changeStatusSchema, req.body)
    
    await UserService.changeUserStatus(requestor, id, newStatus)
    
    sendSuccess(res, SUCCESS_MESSAGES.STATUS_CHANGED)
  } catch (error: Error | any) {
    const errorContext = extractErrorContext(error)
    
    switch (errorContext.type) {
      case ErrorType.NOT_FOUND:
        return sendNotFound(res, ERROR_MESSAGES.USER_NOT_FOUND)
      case ErrorType.PERMISSION:
        return sendForbidden(res, ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS)
      case ErrorType.INVALID_STATUS:
        return sendUnprocessable(res, ERROR_MESSAGES.INVALID_STATUS_CHANGE)
      default:
        throw error
    }
  }
}

// GET /users - Get all users (Admin only)
export async function getAllUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const requestor = req.user!
    
    // For now, return not implemented
    // You'd need to implement getAllUsers in UserService with proper permissions
    sendError(res, ERROR_MESSAGES.NOT_IMPLEMENTED, HTTP_STATUS_CODES.NOT_IMPLEMENTED, FILENAME)
    
  } catch (error: Error | any) {
    const errorContext = extractErrorContext(error)
    
    switch (errorContext.type) {
      case ErrorType.NOT_IMPLEMENTED:
        return sendError(res, ERROR_MESSAGES.NOT_IMPLEMENTED, HTTP_STATUS_CODES.NOT_IMPLEMENTED, FILENAME)
      case ErrorType.PERMISSION:
        return sendForbidden(res, ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS)
      default:
        throw error
    }
  }
}