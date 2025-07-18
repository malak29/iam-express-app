import path from 'path'
import { fromRecord, toRecord } from './User'
import { readJSON, writeJSON } from '../utility/FileUtility'
import { IUser } from '../types/UserTypes'

const dbPath = path.resolve(__dirname, '../../src/db/users.json')
const FILENAME = 'UserModel.ts'

export async function getAllUsers(): Promise<IUser[]> {
    try {
        const result = await readJSON<IUser[]>(dbPath)
        return result.map(fromRecord)
    } catch (error: any) {
        throw new Error(`${FILENAME}: Failed to read users from ${dbPath}: ${error instanceof Error ? error.message : String(error)}`)
    }
}

export async function getUserByEmail(email: string): Promise<IUser> {
    try {
        const users = await getAllUsers()
        const user = users.find((user) => user.email === email)
        if (!user) {
            throw new Error(`${FILENAME}: User not found with email ${email}`)
        }
        return user
    } catch (error: any) {
        throw new Error(`${FILENAME}: Failed to get user by email: ${error instanceof Error ? error.message : String(error)}`)
    }
}

export async function getUserById(id: string): Promise<IUser> {
    try {
        const users = await getAllUsers()
        const user = users.find((user) => user.id === id)
        if (!user) {
            throw new Error(`${FILENAME}: User not found with id ${id}`)
        }
        return user
    } catch (error: any) {
        throw new Error(`${FILENAME}: Failed to get user by id: ${error instanceof Error ? error.message : String(error)}`)
    }
}

export async function addUser(user: IUser): Promise<void> {
    try {
        const users = await getAllUsers()
        const userCheck = users.find((u) => u.email === user.email)
        if (userCheck) {
            throw new Error(`${FILENAME}: User already exists with email ${user.email}`)
        }
        const updatedUsers = [...users, user]
        await writeJSON(dbPath, updatedUsers.map(toRecord))
    } catch (error: any) {
        throw new Error(`${FILENAME}: Failed to add user: ${error instanceof Error ? error.message : String(error)}`)
    }
}

export async function updateUser(user: IUser): Promise<void> {
    try {
        const users = await getAllUsers()
        const userIndex = users.findIndex((u) => u.email === user.email)
        if (userIndex === -1) {
            throw new Error(`${FILENAME}: User does not exist with email ${user.email}`)
        }
        users[userIndex] = user
        await writeJSON(dbPath, users.map(toRecord))
    } catch (error: any) {
        throw new Error(`${FILENAME}: Failed to update user: ${error instanceof Error ? error.message : String(error)}`)
    }
}

export async function deleteUserById(id: string): Promise<void> {
    try {
        const users = await getAllUsers()
        const userIndex = users.findIndex((user) => user.id === id)
        if (userIndex === -1) {
            throw new Error(`${FILENAME}: User not found with id ${id}`)
        }
        users.splice(userIndex, 1)
        await writeJSON(dbPath, users.map(toRecord))
    } catch (error: any) {
        throw new Error(`${FILENAME}: Failed to delete user by id: ${error instanceof Error ? error.message : String(error)}`)
    }
}
