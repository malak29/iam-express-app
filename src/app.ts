import express, { Application } from 'express'
import cors from 'cors'
import authRoutes from './routes/AuthRoutes'
import userRoutes from './routes/UserRoutes'
import { requestLogger, notFoundHandler, errorHandler } from './middleware/ErrorMiddleware'

const app: Application = express()

// Middleware
app.use(cors())                    // Enable CORS
app.use(express.json())            // Parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies
app.use(requestLogger)             // Log requests

// Root endpoint
app.get('/', (req, res) => {
  res.send('Server is running!')
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

// Error handling middleware (must be last)
app.use(notFoundHandler)           // 404 handler
app.use(errorHandler)              // Global error handler

export default app