import { INewUserInput, IUser } from "./UserTypes"

export type INewUserRequestBody = {
    requestor: IUser,
    newUserInput: INewUserInput
}