import { Router } from 'express'
import * as UserController from '../controllers/UserController'
import { authenticate, requireActiveUser } from '../middleware/AuthMiddleware'

const router = Router()

// All user routes require authentication
router.use(authenticate)

// All user routes require active user status
router.use(requireActiveUser)

// User CRUD routes
router.post('/', UserController.createUser)                    // POST /users - Create user (Admin only)
router.get('/', UserController.getAllUsers)                   // GET /users - Get all users (Admin only)
router.get('/:id', UserController.getUserById)                // GET /users/:id - Get user by ID
router.get('/email/:email', UserController.getUserByEmail)    // GET /users/email/:email - Get user by email
router.put('/:id', UserController.updateUser)                 // PUT /users/:id - Update user
router.delete('/:id', UserController.deleteUser)              // DELETE /users/:id - Delete user
router.patch('/:id/status', UserController.changeUserStatus)  // PATCH /users/:id/status - Change user status

export default router