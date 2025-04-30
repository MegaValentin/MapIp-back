import { Router } from "express"

import { getOffices,
getOffice,
deleteOffice,
updatedOffice,
addOffice,
addAllOffice } from "../controller/office.controller.js"

const router = Router()

router.get('/offices', getOffices)

router.get('/office/:id', getOffice)

router.put('/office/:id', updatedOffice)

router.delete('/office/:id', deleteOffice)

router.post('/addoffice', addOffice)

router.post('/addalloffices', addAllOffice)


export default router