import { Router } from "express";
import { validateSchema } from "../middleware/validator.middleware.js";
import { registerSchema, loginSchema } from "../schema/auth.schema.js";
import { authRequired } from "../middleware/validator.token.js";
import { verifyRole } from "../middleware/validator.role.js";
import { registerUser, loginUser, logout, profile, getUser, deleteUser, verifyToken, authorizeUser } from "../controller/user.controller.js";


const router = Router()

router.post('/register',validateSchema(registerSchema), registerUser )

router.post("/login", validateSchema(loginSchema), loginUser)

router.post("/logout", logout)

router.get("/profile", authRequired , profile);

router.get("/verify", verifyToken);

//router.post("/adduser", validateSchema(registerSchema), authRequired, verifyRole(['admin']), addUser)

router.get("/getuser", authRequired, verifyRole(['admin']), getUser)

router.delete("/deleteuser/:id", authRequired, verifyRole(['admin']), deleteUser)

router.patch("/authorize/:id", authRequired, verifyRole(['admin']), authorizeUser);

export default router
