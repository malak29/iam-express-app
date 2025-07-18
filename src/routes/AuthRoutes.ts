import { Router } from 'express'
import * as AuthController from '../controllers/AuthController'
import { authenticate } from '../middleware/AuthMiddleware'

const router = Router()

// Public routes - no authentication required
router.post('/login', AuthController.login)
router.post('/logout', AuthController.logout)

// Protected routes - require authentication
router.get('/me', authenticate, AuthController.getCurrentUser)
router.post('/refresh', authenticate, AuthController.refreshToken)
router.post('/change-password', authenticate, AuthController.changePassword)

export default router