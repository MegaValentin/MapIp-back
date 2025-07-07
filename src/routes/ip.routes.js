import { Router } from "express";

import { getIps,
getIp,
deleteIp,
uploadIp,
generateIPs,
getIpsPuertasEnlaces,
getIpsByStateAndGateway,
getIpsByGatewayPaginated,
getUniqueGateways,
deleteIPsByGateway,
ipGateways,
getIpCountByOffice,
getIpsByOffices,
scanIpByOffice,
scanSingleIp
} from "../controller/ip.controller.js";

import { validateUpdate } from "../middleware/validator.updatedIp.js"
import { validateMongoId } from "../middleware/validator.mongoId.js";
import { authRequired } from "../middleware/validator.token.js";
import { verifyRole } from "../middleware/validator.role.js"

const router = Router()



router.get('/ips', authRequired ,getIps)

router.get('/ip/:id', authRequired, getIp)

router.get('/ips/gateway/:puertaEnlace', authRequired, getIpsPuertasEnlaces)

router.get('/ips/gatewayandstates', authRequired, getIpsByStateAndGateway )

router.get('/ips/filtradas', authRequired, getIpsByGatewayPaginated)

router.get('/gateways', authRequired, getUniqueGateways)

router.get('/lengthips', authRequired, ipGateways)

router.get('/ips/offices', authRequired, getIpCountByOffice )

router.get('/ips/by-office/:officeId', authRequired, getIpsByOffices)

router.get('/scan/office/:officeId', authRequired, scanIpByOffice)

router.get('/scan/ips/:ipId', authRequired , scanSingleIp)

router.post('/generateip', authRequired, verifyRole(['admin']), generateIPs )

router.delete('/ips/:id', authRequired, validateMongoId, verifyRole(['admin']), deleteIp)

router.delete('/removegateways', authRequired, verifyRole(['admin']), deleteIPsByGateway)

router.put('/ips/:id', validateUpdate, authRequired, uploadIp)

export default router
