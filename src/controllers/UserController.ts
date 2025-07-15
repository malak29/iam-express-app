import { INewUserInput } from "../types/UserTypes"
import * as UserService from "../services/UserService"
import { INewUserRequestBody } from "../types/UserControllerTypes";
import { createUserSchema } from "../schemas/UserSchema";

const FILENAME = 'UserController.ts'

export async function createUser(req: Request, res: Response): Promise<void> {
    try {
        const { user, body } = req
        const requesteor = user
        const userData = validateBody(createUserSchema, req)
    }
}