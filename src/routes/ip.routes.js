import { Router } from "express";

import { getIps,
getIp,
deleteIp,
uploadIp,
generateIPs,
getIpsPuertasEnlaces,
getIpsByStateAndGateway,
getIpsByGatewayPaginated,
saludos } from "../controller/ip.controller.js";

import { validateUpdate } from "../middleware/validator.updatedIp.js"
import { validateMongoId } from "../middleware/validator.mongoId.js";
import { authRequired } from "../middleware/validator.token.js";
import { verifyRole } from "../middleware/validator.role.js"

const router = Router()

router.get('/saludos', saludos)

router.get('/ips', authRequired ,getIps)

router.get('/ip/:id', authRequired, getIp)

router.get('/ips/gateway/:puertaEnlace', authRequired, getIpsPuertasEnlaces)

router.get('/ips/gatewayandstates', authRequired, getIpsByStateAndGateway )

router.get('/ips/filtradas', authRequired, getIpsByGatewayPaginated)

router.post('/generateip', authRequired, verifyRole(['admin']), generateIPs )

router.delete('/ips/:id', authRequired, validateMongoId, verifyRole(['admin']), deleteIp)

router.put('/ips/:id', validateUpdate, authRequired, uploadIp)

export default router
