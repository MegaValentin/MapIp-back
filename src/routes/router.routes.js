import { Router } from "express"
import { getIpsByRouter, createRouter, deleteRouter, updatedRouter } from "../controller/router.controller.js"
import { validateUpdateRouter } from "../middleware/validator.updatedRouter.js"
const router = Router()

router.get("/ips-router", getIpsByRouter)

router.post("/routers", createRouter)

router.delete("/routers/:id", deleteRouter)

router.put("/ips-router/:id", validateUpdateRouter,  updatedRouter)

export default router 