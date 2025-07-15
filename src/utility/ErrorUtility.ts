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
    type:
        | 'NOT_FOUND'
        | 'ALREADY_EXISTS'
        | 'PERMISSION'
        | 'INVALID_STATUS'
        | 'NOT_IMPLEMENTED'
        | 'UNKNOWN'
    message: string
} {
    if (isNotFoundError(error)) {
        return { type: 'NOT_FOUND', message: error.message }
    }

    if (isAlreadyExistsError(error)) {
        return { type: 'ALREADY_EXISTS', message: error.message }
    }

    if (isPermissionError(error)) {
        return { type: 'PERMISSION', message: error.message }
    }

    if (isInvalidStatusChangeError(error)) {
        return { type: 'INVALID_STATUS', message: error.message }
    }

    if (isNotImplementedError(error)) {
        return { type: 'NOT_IMPLEMENTED', message: error.message }
    }

    return { type: 'UNKNOWN', message: error.message }
}
