import { LoginCredentials, TokenPayload } from "../types/AuthTypes"
import jwt from 'jsonwebtoken'
import { EUserStatus, IUser } from "../types/UserTypes"
import * as UserModel from '../models/UserModel'
import { validatePassword } from "../models/User"
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env"

const FILENAME = 'AuthService.ts'

export async function login(credentials: LoginCredentials): Promise<{ token: string, user: IUser }> {
    try {
        const { email, password } = credentials;
        const user = await UserModel.getUserByEmail(email)

        const isValidPassword = await validatePassword(user, password)
        if (!isValidPassword) {
            throw new Error(`${FILENAME}: Invalid credentials for user ${email}`)
        }

        if (user.status !== EUserStatus.ACTIVE) {
            throw new Error(`${FILENAME}: User account is inactive`)
        }

        const token = generateToken(user)
        return { token, user }
    } catch (error: any) {
        throw new Error(`${FILENAME}: Login failed: ${error instanceof Error ? error.message : String(error)}`)
    }
}

// Generate JWT token for user
export function generateToken(user: IUser): string {
    try {
      const payload: TokenPayload = {
        userId: user.id,
        email: user.email,
        userType: user.userType
      }
      const options = {
        expiresIn: JWT_EXPIRES_IN as number
      }
      return jwt.sign(payload, JWT_SECRET, options)
    } catch (error) {
      throw new Error(`${FILENAME}: Failed to generate token: ${error instanceof Error ? error.message : String(error)}`)
    }
}

// Verify JWT token and return payload
export function verifyToken(token: string): TokenPayload {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload
    return payload
  } catch (error) {
    throw new Error(`${FILENAME}: Invalid or expired token`)
  }
}

// Get user from token
export async function getUserFromToken(token: string): Promise<IUser> {
  try {
    const payload = verifyToken(token)
    const user = await UserModel.getUserById(payload.userId)
    
    // Double-check user is still active
    if (user.status !== 'ACTIVE') {
      throw new Error(`${FILENAME}: User account is inactive`)
    }
    
    return user
  } catch (error) {
    throw new Error(`${FILENAME}: Failed to get user from token: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Refresh token (optional - for token refresh functionality)
export async function refreshToken(oldToken: string): Promise<string> {
  try {
    const user = await getUserFromToken(oldToken)
    return generateToken(user)
  } catch (error) {
    throw new Error(`${FILENAME}: Failed to refresh token: ${error instanceof Error ? error.message : String(error)}`)
  }
}