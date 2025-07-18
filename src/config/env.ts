import dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT || 3000
export const DB_PATH = process.env.DB_PATH || './src/db/users.json'
export const JWT_SECRET = process.env.JWT_SECRET as string
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || 86400 // 24 hours in seconds

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}