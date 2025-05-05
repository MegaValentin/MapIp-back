import { Router } from "express"
import { getIpsByRouter, createRouter } from "../controller/router.controller.js"

const router = Router()

router.get("/ips-router", getIpsByRouter)
router.post("/routers", createRouter)
//router.delete("/ips-router")
//router.put("/ips-router")



export default router 