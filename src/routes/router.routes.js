import { Router } from "express"
import { getRouters,
    createRouter,
    deleteRouter } from "../controller/router.controller.js"
import { validateUpdateRouter } from "../middleware/validator.updatedRouter.js"
import { authRequired } from "../middleware/validator.token.js"
import { verifyRole } from "../middleware/validator.role.js"
const router = Router()

router.get("/ips-router", authRequired, getRouters)

router.post("/routers", authRequired, createRouter)

router.delete("/routers/:id", authRequired, verifyRole(['admin']), deleteRouter)

//router.put("/ips-router/:id", validateUpdateRouter, authRequired,  updatedRouter)

export default router 