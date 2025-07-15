import dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT || 3000
export const DB_PATH = process.env.DB_PATH || '.src/db/user.json'
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || 24 * 60 * 60 // 24 hours in seconds