import { Router } from "express"

import { getOffices,
getOffice,
deleteOffice,
updatedOffice,
addOffice,
addAllOffice } from "../controller/office.controller.js"
import { authRequired } from "../middleware/validator.token.js"
import { verifyRole } from "../middleware/validator.role.js"

const router = Router()

router.get('/offices', authRequired, getOffices)

router.get('/office/:id', authRequired, getOffice)

router.put('/office/:id', authRequired, updatedOffice)

router.delete('/office/:id', authRequired, verifyRole(['admin', 'user']), deleteOffice)

router.post('/addoffice', authRequired,  addOffice)

router.post('/addalloffices', authRequired, addAllOffice)


export default router