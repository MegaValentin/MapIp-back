import { Router } from "express";
import { getIps,
getIp,
addIp,
deleteIp,
uploadIp,
generateIPs,
getIpsPuertasEnlaces } from "../controller/ip.controller.js";
import { validateUpdate } from "../middleware/validator.updatedIp.js"
import { validateMongoId } from "../middleware/validator.mongoId.js";

const router = Router()

router.get('/ips',getIps)

router.get('/ip/:id', getIp)

router.get('/ips/gateway/:puertaEnlace', getIpsPuertasEnlaces)

router.post('/addip', addIp)

router.post('/generateip', generateIPs )

router.delete('/ips/:id', validateMongoId, deleteIp)

router.put('/ips/:id', validateUpdate, uploadIp)

export default router
