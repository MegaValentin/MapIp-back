import { Router } from "express"
import { getIpsByRouter, createRouter, deleteRouter } from "../controller/router.controller.js"

const router = Router()

router.get("/ips-router", getIpsByRouter)
router.post("/routers", createRouter)
router.delete("/routers/:id", deleteRouter)
//router.put("/ips-router")



export default router 