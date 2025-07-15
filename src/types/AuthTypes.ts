export interface LoginCredentials {
    email: string
    password: string
}

export interface TokenPayload {
    userId: string
    email: string
    userType: string
}

export interface AuthResponse {
    success: boolean
    message: string
    token?: string
    user?: any
}
