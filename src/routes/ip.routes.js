import { Router } from "express";
import { getIps,
getIp,
addIp,
deleteIp,
uploadIp,
generateIPs } from "../controller/ip.controller.js";
const router = Router()

router.get('/ips',getIps)

router.get('/ip/:id', getIp)

router.post('/addip', addIp)

router.delete('/ips/:id', deleteIp)

router.put('/ips/:id', uploadIp)

router.post('/generateip', generateIPs )

export default router
