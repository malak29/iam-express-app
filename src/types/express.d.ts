import { IUser } from './UserTypes'

declare global {
    namespace Express {
        interface Request {
            user?: IUser // Optional user object for authenticated requests
        }
    }
}