import bcrypt from 'bcrypt'
import { INewUserInput, IUser, EUserStatus } from '../types/UserTypes'

const FILENAME = 'User.ts'
// Core user type used throughout the app


// Factory function: creates a user with hashed password
export async function createUser(input: INewUserInput): Promise<IUser> {
    try {
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(input.password, saltRounds)
        return {
            id: input.id,
            name: input.name,
            email: input.email,
            hashedPassword,
            userType: input.userType,
            department: input.department,
            status: input.status,
        }
    } catch (error) {
        throw new Error(`${FILENAME}: Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

// Password validator for login or auth flows
export async function validatePassword(user: IUser, inputPassword: string): Promise<boolean> {
    try {
        return bcrypt.compare(inputPassword, user.hashedPassword)
    } catch (error: any) {
        throw new Error(`${FILENAME}: Failed to validate password: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
}

// Used to return user object safely to client (without password)
export function toSafeUser(user: IUser): Omit<IUser, 'hashedPassword'> {
    const { hashedPassword, ...rest } = user
    return rest
}

// Parse raw data (from JSON/file/db) into a valid User object
export function fromRecord(record: any): IUser {
    return {
        id: record.id,
        name: record.name,
        email: record.email,
        hashedPassword: record.hashedPassword,
        userType: record.userType,
        department: record.department,
        status: record.status ?? EUserStatus.ACTIVE, // backward-compatible default
    }
}

// Convert a User to a plain object (for file or DB storage)
export function toRecord(user: IUser): object {
    return { ...user }
}
