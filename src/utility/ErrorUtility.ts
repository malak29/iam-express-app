import { ErrorType } from "../types/ErrorTypes"

export function isNotFoundError(error: Error): boolean {
    return (
        error.message.includes('not found') ||
        error.message.includes('not found')
    )
}

export function isAlreadyExistsError(error: Error): boolean {
    return error.message.includes('already exists')
}

export function isPermissionError(error: Error): boolean {
    return (
        error.message.includes('does not have permission') ||
        error.message.includes('insufficient permissions')
    )
}

export function isInvalidStatusChangeError(error: Error): boolean {
    return (
        error.message.includes('status change not allowed') ||
        error.message.includes('invalid status change')
    )
}

export function isNotImplementedError(error: Error): boolean {
    return error.message.includes('not implemented')
}

// Extract specific error details
export function extractErrorContext(error: Error): {
    type: ErrorType
    message: string
  } {
    if (isNotFoundError(error)) {
      return { type: ErrorType.NOT_FOUND, message: error.message }
    }
  
    if (isAlreadyExistsError(error)) {
      return { type: ErrorType.ALREADY_EXISTS, message: error.message }
    }
  
    if (isPermissionError(error)) {
      return { type: ErrorType.PERMISSION, message: error.message }
    }
  
    if (isInvalidStatusChangeError(error)) {
      return { type: ErrorType.INVALID_STATUS, message: error.message }
    }
  
    if (isNotImplementedError(error)) {
      return { type: ErrorType.NOT_IMPLEMENTED, message: error.message }
    }
  
    return { type: ErrorType.UNKNOWN, message: error.message }
}
