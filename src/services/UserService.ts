import { EUserActions, EUserStatus, INewUserInput, IUser } from "../types/UserTypes";
import * as UserModel from '../models/UserModel'
import * as UserFactory from '../models/User'
import { canPerformAction } from "./PermissionService";
const FILENAME = 'UserService.ts'

const { CREATE, READ, UPDATE, DELETE, CHANGE_STATUS } = EUserActions

export async function registerUser (requestor: IUser, input: INewUserInput): Promise<void> {
    try {
        if (!canPerformAction( requestor, CREATE)) {
            throw new Error(`${FILENAME}: User ${requestor.id} does not have permission to register users`)
        }

        const newUser = await UserFactory.createUser(input)
        await UserModel.addUser(newUser)
    } catch (error: any) {
        throw new Error(`${FILENAME}: Failed to register user: ${error instanceof Error ? error.message : String(error)}`)
    }
}

export async function getUserById (requestor: IUser, id: string): Promise<IUser> {
    try {
        if (!canPerformAction(requestor, READ)) {
            throw new Error(`${FILENAME}: User ${requestor.id} does not have permission to read users`)
        }

        return await UserModel.getUserById(id)
    } catch (error: any) {
        throw new Error(`${FILENAME}: Failed to get user by id: ${error instanceof Error ? error.message : String(error)}`)
    }
}

export async function getUserByEmail (requestor: IUser, email: string): Promise<IUser> {
    try {
        if (!canPerformAction(requestor, READ)) {
            throw new Error(`${FILENAME}: User ${requestor.id} does not have permission to read users`)
        }

        return await UserModel.getUserByEmail(email)
    } catch (error: any) {
        throw new Error(`${FILENAME}: Failed to get user by email: ${error instanceof Error ? error.message : String(error)}`)
    }
}

export async function updateUser (requestor: IUser, updatedUser: IUser): Promise<void> {
    try {
        if (!canPerformAction(requestor, UPDATE, updatedUser)) {
            throw new Error(`${FILENAME}: User ${requestor.id} does not have permission to update users`)
        }

        await UserModel.updateUser(updatedUser)
    } catch (error: any) {
        throw new Error(`${FILENAME}: Failed to update user: ${error instanceof Error ? error.message : String(error)}`)
    }
}

export async function deleteUser (requestor: IUser, targetUser: IUser): Promise<void> {
    try {
        if (!canPerformAction(requestor, DELETE, targetUser)) {
            throw new Error(`${FILENAME}: User ${requestor.id} does not have permission to delete users`)
        }

        await UserModel.deleteUserById(targetUser.id)
    } catch (error: any) {
        throw new Error(`${FILENAME}: Failed to delete user: ${error instanceof Error ? error.message : String(error)}`)
    }
}

export async function changeUserStatus(requestor: IUser, targetUserId: string, newStatus: EUserStatus): Promise<void> {
    try {
        // Get target user
        const targetUser = await getUserById(requestor, targetUserId)

        // Check permission
        const isAllowed = canPerformAction(requestor, CHANGE_STATUS, targetUser, newStatus)
        if (!isAllowed) {
            throw new Error(`${FILENAME}: User ${requestor.id} does not have permission to change status`)
        }

        // Update status and save
        const updatedUser: IUser = {
            ...targetUser,
            status: newStatus
        }

        await updateUser(requestor, updatedUser)
    } catch (error: any) {
        throw new Error(`${FILENAME}: Failed to change status: ${error instanceof Error ? error.message : String(error)}`)
    }
}