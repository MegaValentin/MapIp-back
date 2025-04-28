import { Router } from "express";
import { getIps,
getIp,
addIp,
deleteIp,
uploadIp,
generateIPs } from "../controller/ip.controller.js";
import { validateUpdate } from "../middleware/validator.updatedIp.js"

const router = Router()

router.get('/ips',getIps)

router.get('/ip/:id', getIp)

router.post('/addip', addIp)

router.delete('/ips/:id', deleteIp)

router.put('/ips/:id', validateUpdate, uploadIp)

router.post('/generateip', generateIPs )

export default router
