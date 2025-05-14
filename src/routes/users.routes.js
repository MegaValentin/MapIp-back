import { Router } from "express";
import { register, login, getAllUsers, authorizeUser, deleteUser, changePassword } from "../controller/users.controller.js";
import { validate } from '../middleware/validate.js'
import { registerSchema, loginSchema, changePasswordSchema  } from '../schemas/auth.schema.js'
import { isAdmin, isAuthenticated  } from '../middleware/authMiddleware.js'



const router = Router()

router.post('/register', validate(registerSchema), register)

router.post('/login', validate(loginSchema), login)

router.get('/users', isAuthenticated, isAdmin, getAllUsers)

router.patch('/users/:id/authorize', isAuthenticated, isAdmin, authorizeUser)

router.delete('/users/:id', isAuthenticated, isAdmin, deleteUser)

router.patch('/change-password', isAuthenticated, validate(changePasswordSchema), changePassword)

export default router
